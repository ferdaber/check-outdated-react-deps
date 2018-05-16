const fs = require('fs')
const path = require('path')
const semver = require('semver')

function getOutdatedPackages() {
    const packagesJson = require(__dirname + '/package.json')
    const dependencies = packagesJson.dependencies
    const version = process.argv[2] || '16.3.0'

    Object.keys(dependencies).forEach(pkg => {
        try {
            const packagePath = require.resolve(pkg)
            parsePackageJson(packagePath, pkg)
        } catch (e) {
            return
        }
    })
}

function parsePackageJson(file, pkgName) {
    const dir = path.dirname(file)
    const packageJsonPath = path.resolve(dir, 'package.json')
    fs.exists(packageJsonPath, exists => {
        if (!exists) {
            return parsePackageJson(dir, pkgName)
        }
        const packageJson = require(packageJsonPath)
        const reactDependencyVersionRange =
            (packageJson.dependencies && packageJson.dependencies.react) ||
            (packageJson.peerDependencies && packageJson.peerDependencies.react)
        if (reactDependencyVersionRange && !semver.satisfies(version, reactDependencyVersionRange)) {
            console.log(`${pkgName}: ${reactDependencyVersionRange}`)
        }
    })
}

module.exports = getOutdatedPackages
