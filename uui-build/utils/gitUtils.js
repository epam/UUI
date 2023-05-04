const execSync = require('child_process').execSync;

module.exports = {
    getHeadCommitHash,
};

function getHeadCommitHash() {
    const shortHash = 'git rev-parse --short HEAD';
    const hash = execSync(shortHash);
    return hash.toString().trim();
}
