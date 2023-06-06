const fs = require('fs');
const path = require('path');

module.exports = { readPackageJsonContentSync, copyPackageJsonAsync };

function readPackageJsonContentSync(dir) {
    const s = fs.readFileSync(path.resolve(dir, 'package.json')).toString('utf-8');
    return JSON.parse(s);
}

async function copyPackageJsonAsync({ fromDir, toDir, transform }) {
    let content = readPackageJsonContentSync(fromDir);
    content = transform ? transform(content) : content;
    const contentStr = JSON.stringify(content, undefined, 2);
    const to = path.resolve(toDir, './package.json');
    if (!fs.existsSync(toDir)) {
        fs.mkdirSync(toDir);
    }
    await fs.writeFileSync(to, contentStr);
}
