const child_process = require('child_process');

async function runCliCommand(cwd, command) {
    await new Promise((resolve, reject) => {
        child_process.exec(
            command,
            {
                cwd,
            },
            (error, stdout, stderr) => {
                if (error) {
                    console.error(stdout);
                    console.error(stderr);
                    reject(new Error(`${command} error: ${error}`));
                }
                resolve();
            },
        );
    });
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

module.exports = {
    runCliCommand,
    hasCliArg,
    getCliArgValue,
};
