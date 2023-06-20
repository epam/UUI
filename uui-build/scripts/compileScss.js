const fs = require('fs');
const path = require('path');
const { compileScssDir } = require('../utils/compileScssUtils.js');

function parseCliArgs() {
    const allArgs = process.argv.splice(2);
    const recursive = !!allArgs.find((a) => a === '--recursive');
    const allSrc = allArgs.filter((pair) => pair.indexOf(':') !== -1).map((pair) => pair.split(':'));
    const dirs = [];
    for (let i = 0; i < allSrc.length; i++) {
        const item = allSrc[i];
        const [from, to] = item;
        if (!fs.existsSync(from)) {
            throw new Error(`Can't find ${from}`);
        }
        if (fs.lstatSync(from).isFile()) {
            throw new Error(`Folder is expected ${from}`);
        } else {
            dirs.push({
                from: path.resolve(from),
                to: path.resolve(to),
            });
        }
    }
    return {
        dirs,
        recursive,
    };
}

/**
 * Compiles scss. One or more CLI args are allowed in following format: <src_dir_relative_to_cwd>:<target_dir_relative_to_cwd>
 * (e.g.: node ../uui-build/scripts/compileScss.js ./theme:./build/css/theme)
 * @returns {Promise<void>}
 */
async function main() {
    const { dirs, recursive } = parseCliArgs();
    function filter(filePath) {
        return filePath.endsWith('.scss') && filePath.indexOf('build') === -1;
    }
    await Promise.all(
        dirs.map(({ from, to }) => compileScssDir({ from, to, filter, recursive })),
    );
}

main();
