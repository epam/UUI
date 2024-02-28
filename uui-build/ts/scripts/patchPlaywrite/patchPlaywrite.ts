import path from 'node:path';
import fs from 'node:fs';
import { uuiRoot } from '../../constants';

const replaceWhat = 's.push([()=>({name:"css-to-identity-obj-proxy",visitor:{ImportDeclaration(i){i.node.source.value.match(/\\.(css|less|scss)$/)&&i.remove()}}})])';
const replaceTo = `
/** UUI patch start */
s.push([require('./_patch.js')])
/** UUI patch end */
`;
const replaceInFile = 'node_modules/playwright/lib/transform/babelBundleImpl.js';
const copyPatchFrom = 'uui-build/ts/scripts/patchPlaywrite/_patch.js';
const copyPatchTo = 'node_modules/playwright/lib/transform/_patch.js';

/**
 * It patches this part: https://github.com/microsoft/playwright/pull/26626/files
 */
function main() {
    const isReplaced = replaceFileContent(replaceInFile, replaceWhat, replaceTo);
    if (isReplaced) {
        writeFileRel(copyPatchTo, readFileRel(copyPatchFrom));
        console.log(`File ${replaceInFile} was successfully patched`);
    } else {
        console.log(`File ${replaceInFile} was already patched`);
    }
}

function replaceFileContent(relPath: string, what: string, to: string) {
    const fileContents = readFileRel(relPath);
    if (fileContents.indexOf(what) !== -1) {
        const newContent = fileContents.replace(what, to);
        writeFileRel(relPath, newContent);
        writeFileRel(`${relPath}.original`, fileContents);
        return true;
    }
}

function readFileRel(relPath: string) {
    const absPath = path.resolve(uuiRoot, relPath);
    return fs.readFileSync(absPath, 'utf-8');
}
function writeFileRel(relPath: string, content: string) {
    const absPath = path.resolve(uuiRoot, relPath);
    return fs.writeFileSync(absPath, content, 'utf-8');
}

main();
