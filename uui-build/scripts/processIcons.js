const path = require('path');
const fs = require('fs');
const SVGO = require('svgo');
const uniqueId = require('lodash.uniqueid');

const svgPrefix = {};
svgPrefix.toString = () => `${uniqueId()}_`;

const isModule = process.env.IS_MODULE === 'true';
const appDirectory = fs.realpathSync(process.cwd());

const resolveRoot = (relativePath) => isModule ? path.resolve(appDirectory, '..', relativePath) : path.resolve(appDirectory, relativePath);

const svgo = new SVGO({
    plugins: [
        {
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
        },
    ],
});

const [,, iconType] = process.argv;

let inputFolder = '';
let outputFolder = '';

switch (iconType) {
    case 'icons':
        inputFolder = 'icons-source';
        outputFolder = 'epam-assets/icons';
        break;
}

function getNewFilePath(filePath, fileName) {
    const relativePath = path.relative(resolveRoot(inputFolder), filePath);
    const newPath = path.join(outputFolder, relativePath);

    if (!fs.existsSync(resolveRoot(newPath))) {
        fs.mkdirSync(resolveRoot(newPath), { recursive: true });
    }

    return resolveRoot(path.join(newPath, fileName));
}

function iterateFolder(folder) {
    if (fs.lstatSync(folder).isFile()) {
        if (folder.indexOf('.svg') > 0) {
            const data = fs.readFileSync(folder);
            svgo.optimize(data).then((result) => {
                const fileName = path.basename(folder);
                const newFilePath = getNewFilePath(path.dirname(folder), fileName);
                fs.writeFileSync(newFilePath, result.data);
                // eslint-disable-next-line no-console
                console.log(`file ${folder} has been optimized`);
            });
        }
        return;
    }

    fs.readdirSync(folder).forEach((subFolder) => {
        iterateFolder(path.resolve(folder, subFolder));
    });
}

iterateFolder(resolveRoot(inputFolder));
