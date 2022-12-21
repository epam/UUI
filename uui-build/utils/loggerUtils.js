const chalk = require('chalk');
const logger = { info, error, success };

module.exports = { logger };

function info(...args) { console.log(...args); }
function error(...args) { console.log(chalk.red(...args)); }
function success(...args) { console.log(chalk.green(...args)); }
