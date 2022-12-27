const path = require("path");
const fs = require("fs");


function cleanDirSync({ dir, isCleanNodeModules, isCleanBuild, isCleanBuildCache }) {
    if (isCleanNodeModules) {
        const modulesPath = path.resolve(dir, './node_modules');
        if (fs.existsSync(modulesPath)) {
            fs.rmdirSync(modulesPath, { recursive: true })
        }
    }
    if (isCleanBuildCache) {
        const cachePath = path.resolve(dir, './node_modules/.cache');
        if (fs.existsSync(cachePath)) {
            fs.rmdirSync(cachePath, { recursive: true })
        }
    }
    if (isCleanBuild) {
        const buildPath = path.resolve(dir, './build');
        if (fs.existsSync(buildPath)) {
            fs.rmdirSync(buildPath, { recursive: true })
        }
    }
}

async function main() {
    const isCleanNodeModules = true;
    const isCleanBuild = true;
    const isCleanBuildCache = true;

    const rootDir = path.resolve(process.cwd(), '../../.');
    cleanDirSync({ dir: rootDir, isCleanNodeModules, isCleanBuild, isCleanBuildCache })
    const files = fs.readdirSync(rootDir);
    const dirs = files.reduce((acc, d) => {
        const dir = path.resolve(rootDir, d);
        const stat = fs.statSync(dir);
        if (stat.isDirectory()) {
            acc.push(dir);
        }
        return acc;
    }, []);
    dirs.forEach(dir => cleanDirSync({ dir, isCleanNodeModules, isCleanBuild, isCleanBuildCache }));
}

main();
