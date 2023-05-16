const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const scssParser = require('postcss-scss');
const postcssSass = require('@csstools/postcss-sass');
const scssModules = require('postcss-modules');
const { createFileSync, iterateFilesInDirAsync } = require('../utils/fileUtils.js');
const { uuiRoot } = require('../utils/constants.js');

function getFilesToCompile() {
    return process.argv.splice(2).filter((pair) => pair.indexOf(':') !== -1).map((pair) => pair.split(':'));
}

function assertNoLocalScopeSelectors({ srcPath, targetPath, variablesJson }) {
    if (Object.keys(variablesJson).length > 0) {
        const err = [
            'Local scope selectors aren\'t allowed.',
            `srcPath=${srcPath}`,
            `targetPath=${targetPath}`,
            JSON.stringify(variablesJson, undefined, 1),
        ].join('\n');
        const locSelectors = Object.values(variablesJson);
        console.error('Local scope selectors found in result css!', `"${path.relative(uuiRoot, srcPath).replaceAll('\\', '/')}" ${locSelectors[0]}${locSelectors.length > 1 ? `,...(${locSelectors.length} in total)` : ''}`);
        throw new Error(err);
    }
}

function getCompiler() {
    return postcss([
        postcssSass({ }),
        scssModules({
            getJSON: (srcPath, variablesJson, targetPath) => {
                assertNoLocalScopeSelectors({ srcPath, targetPath, variablesJson });
            },
        }),
    ]);
}

async function compileSingleFile({ from, to }) {
    const src = await fs.promises.readFile(from, 'utf8');
    const compiler = getCompiler();

    let result;
    try {
        result = await compiler.process(src, { map: { inline: false }, to, from, syntax: scssParser });
    } catch (err) {
        console.error(`cannot compile src=${from}`, err.stack);
    }

    if (result) {
        const isEmptyCss = result.map._sources.size() === 0;
        if (isEmptyCss) {
            console.error('The result css is empty!', path.relative(uuiRoot, to));
        } else {
            createFileSync(to, result.css);
            createFileSync(`${to}.map`, result.map.toString());
        }
    }
}

async function main() {
    const files = getFilesToCompile();
    const inProgress = [];
    for (let i = 0; i < files.length; i++) {
        const [from, to] = files[i];
        if (fs.existsSync(from)) {
            if (fs.lstatSync(from).isFile()) {
                // file
                const promise = compileSingleFile({
                    from: path.resolve(from),
                    to: path.resolve(to),
                });
                inProgress.push(promise);
            } else {
                await iterateFilesInDirAsync(from, (filePath) => {
                    if (!filePath.endsWith('.scss')) {
                        return;
                    }
                    const compileToFile = path.resolve(to, path.relative(from, filePath).replace('.scss', '.css'));
                    const promise = compileSingleFile({
                        from: path.resolve(filePath),
                        to: compileToFile,
                    });
                    inProgress.push(promise);
                }, { recursive: true });
            }
        }
    }

    await Promise.all(inProgress);
}

main();
