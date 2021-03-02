'use strict';

const path = require('path');
const fs = require('fs');
const SVGO = require('svgo');
const uniqueId = require('lodash.uniqueid');
const svgPrefix = {};
svgPrefix.toString = () => `${uniqueId()}_`;

const isModule = process.env.IS_MODULE === 'true';
const appDirectory = fs.realpathSync(process.cwd());

const resolveRoot = relativePath => isModule ? path.resolve(appDirectory, '..', relativePath) : path.resolve(appDirectory, relativePath);
let lastIconId = 0;

const svgo = new SVGO({
    plugins: [{
        cleanupAttrs: true,
    }, {
        removeDoctype: true,
    }, {
        removeXMLProcInst: true,
    }, {
        removeComments: true,
    }, {
        removeMetadata: true,
    }, {
        removeTitle: true,
    }, {
        removeDesc: true,
    }, {
        removeUselessDefs: true,
    }, {
        removeEditorsNSData: true,
    }, {
        removeEmptyAttrs: true,
    }, {
        removeHiddenElems: true,
    }, {
        removeEmptyText: true,
    }, {
        removeEmptyContainers: true,
    }, {
        removeViewBox: false,
    }, {
        cleanupEnableBackground: true,
    }, {
        convertStyleToAttrs: true,
    }, {
        convertColors: true,
    }, {
        convertPathData: true,
    }, {
        convertTransform: true,
    }, {
        removeUnknownsAndDefaults: true,
    }, {
        removeNonInheritableGroupAttrs: true,
    }, {
        removeUselessStrokeAndFill: true,
    }, {
        removeUnusedNS: true,
    }, {
        cleanupIDs: {
            prefix: svgPrefix,
        },
    }, {
        cleanupNumericValues: true,
    }, {
        moveElemsAttrsToGroup: true,
    }, {
        moveGroupAttrsToElems: true,
    }, {
        collapseGroups: true,
    }, {
        removeRasterImages: false,
    }, {
        mergePaths: true,
    }, {
        convertShapeToPath: true,
    }, {
        sortAttrs: true,
    }, {
        removeDimensions: false,
    }, {
        removeAttrs: { attrs: '(stroke|fill)' },
    }]
});

function getNewFileName(filePath) {
    filePath = filePath.replace(/\s/g, '');
    const fullFileName = filePath.split('icon-sources' + path.sep)[1].replace(/[\\,\/,&]/g, '-');

    // move icon size from the start of the path to the end
    let [fileName, extension] =  fullFileName.split('.');
    const fileNameParts = fileName.split('-');
    const temp = fileNameParts[0];
    fileNameParts.shift();
    fileNameParts.push(temp);

    return `${fileNameParts.join('-')}.${extension}`;
}
function getNewFilePath(fileName) {
    return resolveRoot(path.join('epam-assets', 'icons', 'common', fileName));
}

function iterateFolder(folder) {
    if (fs.lstatSync(folder).isFile()) {
        if (folder.indexOf('.svg') > 0) {
            let data = fs.readFileSync(folder);
            svgo.optimize(data).then(result => {
                fs.writeFileSync(getNewFilePath(getNewFileName(folder)), result.data);
                console.log(`file ${folder} has been optimized`);
            });
        }
        return;
    }

    fs.readdirSync(folder).forEach(subFolder => {
        iterateFolder(path.resolve(folder, subFolder));
    })
}

iterateFolder(resolveRoot(path.join('epam-assets', 'icon-sources')));

