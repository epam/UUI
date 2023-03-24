const spawn = require('cross-spawn');
const { uuiRoot } = require('./constants.js');

module.exports = {
    runYarnScriptFromRootSync,
    runCmdFromRootSync,
    runCmdSync,
    hasCliArg,
    getCliArgValue,
}
function runYarnScriptFromRootSync(scriptName) {
    runCmdFromRootSync('yarn', [scriptName]);
}
function runCmdFromRootSync(cmd, args) {
    runCmdSync({ cmd, cwd: uuiRoot, args })
}
function runCmdSync({ cmd, cwd, args = []}) {
    const result = spawn.sync(cmd, args,{ encoding: "utf8", stdio: "inherit", cwd });
    if (result.status !== 0) {
        console.error(result.error);
        process.exit(1);
    }
}

function hasCliArg(argName) {
    return process.argv.includes(argName);
}

function getCliArgValue(argName) {
    const i = process.argv.indexOf(argName);
    if (i !== -1) {
        return process.argv[i + 1];
    }
}
