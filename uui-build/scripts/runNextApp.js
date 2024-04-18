// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const fs = require('fs-extra');
const chalk = require('chalk');

const modulesNameMap = {
    'epam-assets': 'assets',
    'epam-promo': 'promo',
    uui: 'uui',
    'uui-components': 'uui-components',
    'uui-editor': 'uui-editor',
    'uui-docs': 'uui-docs',
    'uui-core': 'uui-core',
    'test-utils': 'uui-test-utils',
};

async function isModuleBuildExist(module) {
    const isExists = await fs.exists(`../../${module}/build`);
    let isEmpty = false;
    fs.readdir(`../../${module}/build`, function (err, files) {
        if (err) {
            console.log(err);
        } else {
            if (!files.length) {
                isEmpty = true;
            }
        }
    });
    return isExists && !isEmpty;
}

async function main() {
    console.log('run NextApp script');
    let isAllModulesIsBuilt = false;
    const modulesPath = Object.keys(modulesNameMap);
    for (let i = 0; i < modulesPath.length; i += 1) {
        const module = modulesPath[i];
        const isExist = await isModuleBuildExist(module);
        if (!isExist) {
            console.log(`Build folder is not existed or empty in module: ${module} `);
            process.exit(1);
            break;
        }
        isAllModulesIsBuilt = true;
    }

    if (isAllModulesIsBuilt) {
        try {
            console.log('Start coping current version of modules');
            for await (const mPath of modulesPath) {
                await fs.copySync(`../../${mPath}/build/`, `./node_modules/@epam/${modulesNameMap[mPath]}/`);
            }
            console.log(chalk.green('All modules are copied to next app'));
            const DOT_NEXT_DIR = './.next';
            if (fs.existsSync(DOT_NEXT_DIR)) {
                fs.rmdirSync(DOT_NEXT_DIR, { recursive: true, force: true });
            }
        } catch (err) {
            console.log(err);
        }
    }
}

main();
