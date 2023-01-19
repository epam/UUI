const fs = require("fs");
const path = require("path");

module.exports = { readPackageJsonContentSync, copyPackageJsonAsync };

function readPackageJsonContentSync(dir) {
    const s = fs.readFileSync(path.resolve(dir, 'package.json')).toString('utf-8');
    return JSON.parse(s)
}

async function copyPackageJsonAsync({ fromDir, toDir, transform }) {
    const content = readPackageJsonContentSync(fromDir);
    transform(content);
    const contentStr = JSON.stringify(content, undefined, 2);
    const to = path.resolve(toDir, `./package.json`);
    await fs.writeFileSync(to, contentStr)
}
