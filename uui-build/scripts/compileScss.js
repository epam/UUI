const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const scssParser = require('postcss-scss');
const postcssSass = require('@csstools/postcss-sass');
const scssModules = require('postcss-modules');

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

async function compileSingleFile(from, to) {
    const src = await fs.promises.readFile(from, 'utf8');
    const compiler = getCompiler();
    const result = await compiler.process(src, { map: true, to, from, syntax: scssParser });
    // check target dir exists
    const dir = path.dirname(to);
    if (fs.existsSync(dir)) {
        fs.existsSync(to) && fs.rmSync(to);
        fs.existsSync(`${to}.map`) && fs.rmSync(`${to}.map`);
    } else {
        fs.mkdirSync(dir, { recursive: true });
    }
    await fs.promises.writeFile(to, result.css, 'utf8');
    await fs.promises.writeFile(`${to}.map`, result.map.toString(), 'utf8');
}

async function main() {
    const files = getFilesToCompile();
    const inProgress = files.reduce((acc, [from, to]) => {
        if (fs.existsSync(from)) {
            if (fs.lstatSync(from).isFile()) {
                // file
                const promise = compileSingleFile(path.resolve(from), path.resolve(to));
                acc.push(promise);
            } else {
                throw new Error(`Unable to find source file ${from}`);
            }
        }
        return acc;
    }, []);
    await Promise.all(inProgress);
}

main();
