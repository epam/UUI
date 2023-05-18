const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const scssParser = require('postcss-scss');
const postcssSass = require('@csstools/postcss-sass');
const scssModules = require('postcss-modules');
const scssDiscardComments = require('postcss-discard-comments');
const { createFileSync, iterateFilesInDirAsync } = require('../utils/fileUtils.js');
const { uuiRoot } = require('../utils/constants.js');

module.exports = {
    compileScssDir,
};

function isScssModule(filePath) {
    return filePath.endsWith('.module.scss');
}

function uuiImporter(url, prev, done) {
    const ALIASES = {
        '@epam/assets': 'epam-assets',
        '@epam/promo': 'epam-promo',
        '@epam/loveship': 'loveship',
        '@epam/uui': 'uui',
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
        plugins.push(scssModules({
            getJSON() {
                /**
                 * we don't want the JSON files with selectors to be generated here,
                 * because it's not the purpose of this tool
                 */
            },
        }));
    }
    return postcss(plugins);
}

async function compileScssFile({ from, to }) {
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

/**
 * Compiles all scss files in the dir.
 * If some scss file in the dir compiles to empty css, then such empty *.css file will not be created.
 *
 * @param from - Absolute path to the source directory.
 * @param to - Absolute path to the target dir. The dir structure will be automatically created if it doesn't exist.
 * @param filter - A callback, should return true in order to include a file and false - to exclude it.
 * @param [recursive=false]
 * @returns {Promise<void>}
 */
async function compileScssDir({ from, to, filter, recursive = false }) {
    const inProgress = [];
    await iterateFilesInDirAsync(from, (filePath) => {
        if (!filter(filePath)) {
            return;
        }
        const compileToFile = path.resolve(to, path.relative(from, filePath).replace('.scss', '.css'));
        const promise = compileScssFile({
            from: filePath,
            to: compileToFile,
        });
        inProgress.push(promise);
    }, { recursive });

    await Promise.all(inProgress);
}
