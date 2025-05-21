import path from 'path';
import fs from 'fs/promises';

const cache = {};

const getFileContents = async (fileName) => {
    const filePath = path.resolve(__dirname, '../../data', fileName + '.json');
    const raw = await fs.readFile(filePath);
    const parsed = JSON.parse((raw as any).toString());
    return parsed;
};

export async function getData(name) {
    if (!cache[name]) {
        return cache[name] = getFileContents(name);
    }

    return cache[name];
}
