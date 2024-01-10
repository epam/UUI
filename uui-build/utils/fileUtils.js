const fs = require('fs');

module.exports = { readJsonFileSync };

function readJsonFileSync(filePathResolved) {
    const content = fs.readFileSync(filePathResolved, 'utf8').toString();
    return JSON.parse(content);
}
