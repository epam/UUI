import path from 'path';
import fs from 'fs';
import postcss from 'postcss';
import scssParser from 'postcss-scss';
// @ts-ignore Reason: no DTS in this package
import postcssSass from '@csstools/postcss-sass';
import scssDiscardComments from 'postcss-discard-comments';
import { createFileSync, iterateFilesInDirAsync } from '../../utils/fileUtils';

function isScssModule(filePath: string) {
    return filePath.endsWith('.module.scss');
}

function getCompiler(isModule: boolean) {
    const plugins = [
        postcssSass({}),
        scssDiscardComments({ removeAll: true }),
    ];
    if (isModule) {
        throw new Error('Compilation of scss modules isn\'t implemented.');
    }
    return postcss(plugins);
}

async function compileScssFile(params: { from: string, to: string }) {
    const { from, to } = params;
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
        const isEmptyCss = (result.map as any)._sources.size() === 0;
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
 * @returns {Promise<void>}
 */
export async function compileScssDir(
    params: { from: string, to: string, filter: (p: string) => boolean, recursive: boolean },
) {
    const { from, to, filter, recursive = false } = params;
    const inProgress: Promise<unknown>[] = [];
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
