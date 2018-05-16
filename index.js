const fs = require('fs')
const path = require('path')
const semver = require('semver')

function getOutdatedPackages(version = '16.3.0') {
    const packagesJson = require(path.resolve(process.cwd(), 'package.json'))
    const dependencies = packagesJson.dependencies

    Object.keys(dependencies).forEach(pkg => {
        try {
            const packagePath = require.resolve(pkg, { paths: [process.cwd()] })
            parsePackageJson(packagePath, pkg, version)
        } catch (e) {
            return
        }
    })
}

function parsePackageJson(file, pkgName, version) {
    const dir = path.dirname(file)
    const packageJsonPath = path.resolve(dir, 'package.json')
    fs.exists(packageJsonPath, exists => {
        if (!exists) {
            return parsePackageJson(dir, pkgName, version)
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
