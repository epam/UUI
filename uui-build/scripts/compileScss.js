const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const scssParser = require('postcss-scss');
const postcssSass = require('@csstools/postcss-sass');
const scssModules = require('postcss-modules');
const scssDiscardComments = require('postcss-discard-comments');
const { createFileSync, iterateFilesInDirAsync } = require('../utils/fileUtils.js');
const { uuiRoot } = require('../utils/constants.js');

function isFilePathIgnored(filePath) {
    return !filePath.endsWith('.scss') || filePath.indexOf('build') !== -1;
}

function isScssModule(filePath) {
    return filePath.endsWith('.module.scss');
}

function getFilesToCompile() {
    return process.argv.splice(2).filter((pair) => pair.indexOf(':') !== -1).map((pair) => pair.split(':'));
}

function uuiImporter(url, prev, done) {
    const ALIASES = {
        '@epam/assets': 'epam-assets',
    };
    const uuiResolvers = Object.keys(ALIASES).map((origPath) => {
        const origPathReplaceTo = ALIASES[origPath];
        return (filePathToImport) => {
            const prefix = [`~${origPath}`, origPath].find((p) => filePathToImport.indexOf(p) === 0);
            if (prefix) {
                let newUrl = filePathToImport.replace(prefix, path.resolve(uuiRoot, origPathReplaceTo));
                if (!newUrl.endsWith('.scss')) {
                    newUrl += '.scss';
                }
                return {
                    file: newUrl,
                    contents: fs.readFileSync(newUrl).toString(),
                };
            }
        };
    });
    uuiResolvers.find((r) => {
        const res = r(url);
        if (res) {
            done(res);
            return true;
        }
        return false;
    });
}

function getCompiler(isModule) {
    const plugins = [
        postcssSass({
            importer: uuiImporter,
        }),
        scssDiscardComments({ removeAll: true }),
    ];
    if (isModule) {
        plugins.push(scssModules({}));
    }
    return postcss(plugins);
}

async function compileSingleFile({ from, to }) {
    const src = await fs.promises.readFile(from, 'utf8');
    const compiler = getCompiler(isScssModule(from));

    let result;
    try {
        result = await compiler.process(src, { map: { inline: false }, to, from, syntax: scssParser });
    } catch (err) {
        console.error(`Compile error ${from}`, err.stack);
        throw new Error(err);
    }

    if (result) {
        const isEmptyCss = result.map._sources.size() === 0;
        if (!isEmptyCss) {
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
                    if (isFilePathIgnored(filePath)) {
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
