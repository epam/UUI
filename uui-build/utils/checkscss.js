const { iterateFilesInDirAsync } = require('./fileUtils.js');
const { uuiRoot } = require('./constants.js');
const path = require('path');

async function main() {
    const countNotAssets = [];
    const countAssets = [];

    await iterateFilesInDirAsync(uuiRoot, (fp) => {
        if (fp.indexOf('node_modules') === -1 && fp.indexOf('.git') === -1 && fp.indexOf('build') === -1 && fp.endsWith('.scss')) {
            if (fp.indexOf('assets') !== -1) {
                countAssets.push(path.relative(uuiRoot, fp));
            } else {
                countNotAssets.push(path.relative(uuiRoot, fp));
            }
        }
    }, { recursive: true });

    console.log(`Totals - assets=${countAssets.length} not-assets=${countNotAssets.length}`);

    console.log(`\nAssets: ${countAssets.join(',\n')}\n`);
    console.log(`\nNotAssets: ${countNotAssets.join(',\n')}\n`);
}

main();
