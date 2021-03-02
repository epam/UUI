const path = require('path');
const fs = require('fs').promises;

const cache = {};

const getFileContents = async (fileName) => {
    const filePath = path.resolve(__dirname, '../data', fileName + '.json');
    const raw = await fs.readFile(filePath);
    const parsed = JSON.parse(raw);
    return parsed;
}

module.exports.getData = async (fileName) => {
    if (!cache[fileName]) {
        return cache[fileName] = getFileContents(fileName);
    }

    return cache[fileName];
}