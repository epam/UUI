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
                    console.log(stdout);
                    console.error(stderr);
                    reject(`${command} error: ${error}`);
                }
                resolve();
            }
        );
    });
}

module.exports = {
    runCliCommand,
};
