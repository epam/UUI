const spawn = require('cross-spawn');
const path = require('path');

function forwardSlashes(pathStr) {
    return pathStr.replace(/\\/g, '/');
}

function hasArg(arg) {
    return process.argv.includes(arg);
}

const ROOT_DIR = path.resolve(`${__dirname}/../../.`);

function main() {
    const args = [];
    let cmd;
    hasArg('--fix') && args.push('--fix');
    args.push('--max-warnings', '999999'); // some very big number, so that the task always exists with status 0
    if (hasArg('--eslint')) {
        cmd = 'eslint';
        args.push('**/*.{ts,tsx,js}');
        args.push('-f', 'uui-build/linting/formatters/eslintFormatter.js');
        args.push('-o', './.reports/eslint.html');
    } else if (hasArg('--stylelint')) {
        cmd = 'stylelint';
        args.push('**/*.{scss,less}');
        args.push('--custom-formatter', 'uui-build/linting/formatters/stylelintFormatter.js');
        args.push('-o', './.reports/stylelint.html');
    } else {
        throw new Error('Required arguments are missed');
    }
    const cwd = forwardSlashes(ROOT_DIR);
    spawn.sync(cmd, args, { encoding: 'utf8', stdio: 'inherit', cwd });
}

main();
