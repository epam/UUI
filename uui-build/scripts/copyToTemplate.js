const fs = require('fs-extra');
const path = require('path');

const modules = {
    'epam-assets': 'assets',
    loveship: 'loveship',
    uui: 'uui',
    'uui-components': 'uui-components',
};

const outDir = '../ui-template/node_modules/@epam';

Object.keys(modules).forEach(srcName => {
    var srcDir = path.join(srcName, 'build');
    var dstDir = path.join(outDir, modules[srcName]);
    fs.removeSync(dstDir);
    fs.copySync(srcDir, dstDir);
});
