const fs = require('fs-extra');
const path = require('path');
const { getIndexFilePath } = require('./../utils/indexFileUtils');
const { logger } = require('./../utils/loggerUtils');
const { buildUsingRollup } = require('./../rollup/rollupBuildUtils');

const BUILD_FOLDER = 'build'
const COPY_AS_IS = ['readme.md', 'assets']

async function main() {
    const moduleRootDir = process.cwd();
    logger.success(`Building package: ${moduleRootDir}`);
    fs.emptyDirSync(BUILD_FOLDER);

    const moduleIndexFile = await getModuleIndexFile(moduleRootDir);
    if (moduleIndexFile) {
        await copyStaticFilesAsync();
        await copyPackageJson({ moduleRootDir, isModule: true })
        try {
            await buildUsingRollup({ moduleRootDir, moduleIndexFile });
        } catch(err) {
            logger.error(`Failed building package: ${moduleRootDir}`);
            err && err.message && logger.error(err.message);
            process.exit(1);
        }
    } else {
        logger.info("No index.tsx exists. Will publish package as is, w/o pre-build");
        copyAllFilesSync(moduleRootDir);
    }
    logger.success(`Done building package: ${moduleRootDir}`);
}

async function copyStaticFilesAsync() {
    const p = COPY_AS_IS.map(async (c) => {
        if (await fs.exists(c)) {
            await fs.copy(c, `${BUILD_FOLDER}/${c}`);
        }
    })
    await Promise.all(p)
}

async function copyPackageJson({ moduleRootDir, isModule }) {
    const from = path.resolve(moduleRootDir, './package.json');
    const to = path.resolve(moduleRootDir, `./${BUILD_FOLDER}/package.json`);
    const content = await fs.readJSON(from);
    delete content['epam:uui:main'];
    if (isModule) {
        // content.sideEffects = false; // TODO: set only if module doesn't have side effects.
        content.type = 'module'
    }
    await fs.writeFile(to, JSON.stringify(content, undefined, 2))
}

/**
 * Copy everything to the output folder "as-is".
 * @param moduleRootDir
 */
function copyAllFilesSync(moduleRootDir) {
    for(let file of fs.readdirSync(moduleRootDir)) {
        if (file !== BUILD_FOLDER) {
            const from = path.resolve(moduleRootDir, file);
            const to = path.resolve(moduleRootDir, BUILD_FOLDER, file)
            fs.copySync(from, to)
        }
    }
}

async function getModuleIndexFile(moduleRootDir) {
    return await getIndexFilePath(moduleRootDir);
}

main();
