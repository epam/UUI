const chalk = require('chalk');
const logger = { info, error, success };

function ModuleBuildProgressLogger({ moduleRootDir, isRollup }) {
    const notes = isRollup ? '(Building using Rollup)' : '(No index.tsx exists. Will publish package as is, w/o pre-build)';
    this.start = () => logger.success(`Building package: ${moduleRootDir} ${notes}.`);
    this.done = () => logger.success(`Done building package: ${moduleRootDir}`);
    this.error = () => logger.error(`Failed building package: ${moduleRootDir}`);
}

module.exports = { logger, ModuleBuildProgressLogger };

function info(...args) { console.log(...args); }
function error(...args) { console.log(chalk.red(...args)); }
function success(...args) { console.log(chalk.green(...args)); }

