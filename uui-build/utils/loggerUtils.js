const chalk = require('chalk');

const logger = {
    info, warn, error, success, table,
};

module.exports = { logger };

function info(...args) { console.log(...args); }

function error(...args) { console.log(chalk.red(...args)); }

function warn(...args) { console.log(chalk.yellow(...args)); }

function success(...args) { console.log(chalk.green(...args)); }

function table({ caption, data }) {
    if (caption) {
        info(caption);
    }
    console.table(data);
}
