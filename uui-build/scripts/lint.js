const spawn = require('cross-spawn');
const path = require('path');
const { isCI } = require('../utils/envUtils.js');

function forwardSlashes(pathStr) {
    return pathStr.replace(/\\/g, '/');
}

function hasArg(arg) {
    return process.argv.includes(arg);
}

const ROOT_DIR = path.resolve(`${__dirname}/../../.`);

function main() {
    const isFromCI = isCI();
    const args = [];
    let cmd;
    hasArg('--fix') && args.push('--fix');
    /**
     * For non-CI env: specify some very big number for the "--max-warnings", so that the task always exists with status 0
     * The developer should check the generated report "./.reports/eslint" or "./.reports/stylelint" to see all errors/warnings.
     */
    // https://eslint.org/docs/latest/use/command-line-interface
    args.push('--max-warnings', isFromCI ? 0 : 999999);
    if (hasArg('--eslint')) {
        cmd = 'eslint';
        args.push('**/*.{ts,tsx,js}');
        if (isFromCI) {
            args.push('-f', 'compact');
        } else {
            args.push('-f', 'uui-build/linting/formatters/eslintFormatter.js');
            args.push('-o', './.reports/eslint.html');
        }
    } else if (hasArg('--stylelint')) {
        cmd = 'stylelint';
        args.push('**/*.{scss,less}');
        if (isFromCI) {
            args.push('-f', 'compact');
        } else {
            args.push('--custom-formatter', './uui-build/linting/formatters/stylelintFormatter.js');
            args.push('-o', './.reports/stylelint.html');
        }
    } else {
        throw new Error('Required arguments are missed');
    }
    const cwd = forwardSlashes(ROOT_DIR);
    const result = spawn.sync(cmd, args, {
        encoding: 'utf8',
        stdio: 'inherit',
        cwd,
    });
    if (result.status !== 0) {
        process.exitCode = 1;
    }
}

main();
