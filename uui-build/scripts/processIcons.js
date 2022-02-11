'use strict';

const path = require('path');
const fs = require('fs');
const SVGO = require('svgo');
const uniqueId = require('lodash.uniqueid');
const { transform } = require('@svgr/core');
const svgPrefix = {};
svgPrefix.toString = () => `${uniqueId()}_`;

const isModule = process.env.IS_MODULE === 'true';
const appDirectory = fs.realpathSync(process.cwd());

const resolveRoot = relativePath => isModule ? path.resolve(appDirectory, '..', relativePath) : path.resolve(appDirectory, relativePath);
let lastIconId = 0;

process.env.BABEL_ENV = 'production';

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

function getNewFileName(filePath, extension) {
    filePath = filePath.replace(/\s/g, '');
    const fullFileName = filePath.split('icon-sources' + path.sep)[1].replace(/[\\,\/,&]/g, '-');

    // move icon size from the start of the path to the end
    let [fileName] = fullFileName.split('.');
    const fileNameParts = fileName.split('-');
    const temp = fileNameParts[0];
    fileNameParts.shift();
    fileNameParts.push(temp);

    return `${fileNameParts.join('-')}.${extension}`;
}

async function getNewFilePath(originalPath, subfolder, extension) {
    const fileName = getNewFileName(originalPath, extension);

    const filePath = resolveRoot(path.join('epam-assets', 'icons', subfolder));

    if (!(await fs.promises.stat(filePath).err)){
        await fs.promises.mkdir(filePath, { recursive: true });
    }

    return path.join(filePath, fileName);
}

async function iterateFolder(sourcePath /* file of folder */) {
    if ((await fs.promises.lstat(sourcePath)).isFile()) {
        if (sourcePath.indexOf('.svg') > 0) {
            let data = await fs.promises.readFile(sourcePath);
            let optimized = await svgo.optimize(data);
            const svgPath = await getNewFilePath(sourcePath, 'common', 'svg');
            await fs.promises.writeFile(svgPath, optimized.data);

            var svgr = await transform(
                optimized.data,
                {
                    jsx: {
                        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
                        babelConfig: {
                            "plugins": [
                                [
                                    "@babel/plugin-transform-react-jsx",
                                    {
                                        "runtime": "automatic"
                                    }
                                ],
                            ]
                        }
                    },
                    icon: true
                },
                { componentName: 'ReactComponent' },
            )

            const svgrPath = await getNewFilePath(sourcePath, 'react', 'js');
            await fs.promises.writeFile(svgrPath, svgr);

            console.log(`file ${sourcePath} has been optimized`);
        }
    } else {
        var subFolders = await fs.promises.readdir(sourcePath);

        for(let n = 0; n < subFolders.length; n++) {
            await iterateFolder(path.resolve(sourcePath, subFolders[n]));
        }
    }
}

iterateFolder(resolveRoot(path.join('epam-assets', 'icon-sources')));

