// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.IS_MODULE = 'true';

const fs = require('fs-extra');
const path = require('path');
const paths = require('../config/paths.js');
const getWebpackConfig = require('../config/webpack.config.js');
const runWebpack = require('./runWebpack');
const chalk = require('chalk');

const webpackConfig = getWebpackConfig({ env: 'module' });

async function main() {
    console.log(chalk.green(`Building package: ` + paths.appPath));
    fs.emptyDirSync('./build');

    const indexExists = !!paths.appIndexTs && await fs.exists(paths.appIndexTs);
    const assetsExists = await fs.exists('./assets/');


    if (indexExists) {
        await fs.copy('./package.json', './build/package.json');
        await fs.copy('./readme.md', './build/readme.md');

        // If package contains 'assets' folder, we move it to build as is
        if(assetsExists) {
            await fs.copy('./assets/', './build/assets/');
        }

        try {
            await runWebpack(webpackConfig);
        } catch(err) {
            if (err && err.message) {
                console.log(chalk.red(`Failed building package: ` + paths.appPath));
                console.log(err.message);
                process.exit(1);
            }
        }
    } else {
        console.log("No index.tsx exists. Will publish package as is, w/o pre-build");

        for(let file of fs.readdirSync(paths.appPath)) {
            if (file != 'build') {
                //console.log([path.resolve(paths.appPath, file), path.resolve(paths.appPath,'build')]);
                fs.copySync(path.resolve(paths.appPath, file), path.resolve(paths.appPath, 'build', file))
            };
        }
    }
    console.log(chalk.green(`Done building package: ` + paths.appPath));
}

main();