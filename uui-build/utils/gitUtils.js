// const execSync = require('child_process').execSync;

module.exports = {
    getHeadCommitHash,
};

function getHeadCommitHash() {
    /**
     * Error: Command failed: git rev-parse --short HEAD
     * fatal: detected dubious ownership in repository at '/__w/UUI/UUI'
     * To add an exception for this directory, call:
     *
     *    git config --global --add safe.directory /__w/UUI/UUI
     */
    return '';
/*
    const shortHash = 'git rev-parse --short HEAD';
    const hash = execSync(shortHash);
    return hash.toString().trim(); */
}
