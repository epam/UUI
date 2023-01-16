const Project = require("@lerna/project");
const { PackageGraph } = require("@lerna/package-graph");
const fs = require("fs");
const path = require("path");

module.exports = { assertRunFromModule, readPackageJsonContent, getAllLocalDependenciesInfo, getAllMonorepoPackages }

function readPackageJsonContent(dir) {
    const s = fs.readFileSync(path.resolve(dir, 'package.json')).toString('utf-8');
    return JSON.parse(s)
}

function getModuleNameFromModuleRootDir(moduleRootDir) {
    const rootTokens = moduleRootDir.split(/[\\/]/);
    return rootTokens[rootTokens.length - 1]
}

function assertRunFromModule(expectedModuleName) {
    const moduleName = getModuleNameFromModuleRootDir(process.cwd());
    if (moduleName !== expectedModuleName) {
        throw new Error(`This script is designed to be run from the "${expectedModuleName}" module.`)
    }
}

function getAllMonorepoPackages() {
    const packages = Project.getPackagesSync();
    const graph = new PackageGraph(packages);
    return packages.reduce((acc, p) => {
        const { location: moduleRootDir, name, version } = p;
        const localDependencies = Array.from(graph.get(name).localDependencies.values()).map(d => d.name);
        acc[name] = { name, version, moduleRootDir, localDependencies };
        return acc;
    }, {});
}

/**
 * Includes transitive local dependencies.
 */
function getAllLocalDependenciesInfo(name) {
    function getAllLocalDependencies(name) {
        const pMap = getAllMonorepoPackages();
        function getAllDeps(n) {
            const loc = pMap[n].localDependencies;
            let arr = [...loc];
            loc.forEach(ld => {
                const ldDeps = getAllDeps(ld);
                arr = arr.concat(ldDeps);
            })
            return [...new Set(arr)];
        }
        return getAllDeps(name);
    }
    const pMap = getAllMonorepoPackages();
    const arr = getAllLocalDependencies(name);
    return arr.map(i => pMap[i])
}
