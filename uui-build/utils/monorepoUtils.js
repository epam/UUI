const Project = require('@lerna/project');
const { PackageGraph } = require('@lerna/package-graph');
const fs = require('fs');
const path = require('path');
const { readPackageJsonContentSync } = require('./packageJsonUtils');
const { isRollupModule } = require('./indexFileUtils');
const { readJsonFileSync } = require('./fileUtils');
const { uuiRoot } = require('./constants');

module.exports = {
    getUuiVersion,
    assertRunFromModule,
    getAllLocalDependenciesInfo,
    getAllMonorepoPackages,
    isAllLocalDependenciesBuilt,
};

function getModuleDirNameFromModuleRootDir(moduleRootDir) {
    const rootTokens = moduleRootDir.split(/[\\/]/);
    return rootTokens[rootTokens.length - 1];
}

function assertRunFromModule(expectedModuleDirName) {
    const moduleDirName = getModuleDirNameFromModuleRootDir(process.cwd());
    if (moduleDirName !== expectedModuleDirName) {
        throw new Error(`This script is designed to be run from the "${expectedModuleDirName}" module.`);
    }
}

function getAllMonorepoPackages() {
    const packages = Project.getPackagesSync();
    const graph = new PackageGraph(packages);
    return packages.reduce((acc, p) => {
        const { location: moduleRootDir, name, version } = p;
        const localDependencies = Array.from(graph.get(name).localDependencies.values()).map((d) => d.name);
        acc[name] = {
            name, version, moduleRootDir, localDependencies,
        };
        return acc;
    }, {});
}

/**
 * Includes transitive local dependencies.
 */
function getAllLocalDependenciesInfo(moduleName) {
    function getAllLocalDependencies(name) {
        const pMap = getAllMonorepoPackages();
        function getAllDeps(n) {
            const loc = pMap[n].localDependencies;
            let arr = [...loc];
            loc.forEach((ld) => {
                const ldDeps = getAllDeps(ld);
                arr = arr.concat(ldDeps);
            });
            return [...new Set(arr)];
        }
        return getAllDeps(name);
    }
    const pMap = getAllMonorepoPackages();
    if (moduleName) {
        const arr = getAllLocalDependencies(moduleName);
        return arr.map((i) => pMap[i]);
    } else {
        return Object.values(pMap);
    }
}

/**
 * Checks that the module is built.
 * @param moduleRootDir
 * @returns {boolean}
 */
function isModuleBuilt(moduleRootDir) {
    if (!isRollupModule(moduleRootDir)) {
        return fs.existsSync(path.resolve(moduleRootDir, './build'));
    }
    const pkgPath = path.resolve(moduleRootDir, './build/package.json');
    const pkgJsonExists = fs.existsSync(pkgPath);
    if (pkgJsonExists) {
        const { main } = readPackageJsonContentSync(path.resolve(moduleRootDir, './build'));
        return main ? !!fs.existsSync(path.resolve(moduleRootDir, `./build/${main}`)) : true;
    }
    return false;
}

/**
 * Checks whether all dependencies of given module are built. Including all transitive dependencies.
 * @param [moduleName]
 * @returns {{isBuilt: boolean, modulesNotBuilt: array}}
 */
function isAllLocalDependenciesBuilt(moduleName) {
    const depsInfo = getAllLocalDependenciesInfo(moduleName);
    const { modulesNotBuilt, modulesBuilt } = depsInfo.reduce((acc, { name, moduleRootDir }) => {
        if (isModuleBuilt(moduleRootDir)) {
            acc.modulesBuilt.push(name);
        } else {
            acc.modulesNotBuilt.push(name);
        }
        return acc;
    }, { modulesNotBuilt: [], modulesBuilt: [] });
    const isBuilt = modulesNotBuilt.length === 0;
    return {
        isBuilt,
        modulesBuilt,
        modulesNotBuilt,
    };
}

/**
 * Version of UUI
 * @returns {string}
 */
function getUuiVersion() {
    return readJsonFileSync(path.resolve(uuiRoot, 'lerna.json')).version;
}
