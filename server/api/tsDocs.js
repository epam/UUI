const express = require('express');
const { highlightTsCode } = require('./prism');
const fs = require('fs');
const path = require('path');

const router = express.Router();

/**
 *
 * @returns {import('../../uui-build/docsGen/types/docsGenSharedTypes.ts').TApiReferenceJson}
 */
function readDocsGenResultsJson() {
    const filePath = path.join(__dirname, '../../public/docs/docsGenOutput/docsGenOutput.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 *
 * @param typeValue {import('../../uui-build/docsGen/types/docsGenSharedTypes.ts').TTypeValue}
 * @returns {import('../../uui-build/docsGen/types/docsGenSharedTypes.ts').TTypeValue}
 */
function prettyPrintTypeValue(typeValue) {
    if (typeValue) {
        const pp = {};
        if (typeValue.print) {
            pp.print = highlightTsCode(typeValue.print.join('\n')).split('\n');
        }
        if (typeValue.raw) {
            pp.raw = highlightTsCode(typeValue.raw);
        }
        return {
            ...typeValue,
            ...pp,
        };
    }
    return typeValue;
}

router.get('/ts-docs/types/details/:shortRef', (req, res) => {
    const shortRef = req.params.shortRef;
    if (!shortRef) {
        res.sendStatus(400);
    }
    const { publicTypes } = readDocsGenResultsJson();
    const [moduleName, exportName] = shortRef.split(':');

    const exportedType = publicTypes[moduleName]?.[exportName];

    exportedType.typeValue = prettyPrintTypeValue(exportedType.typeValue);
    if (exportedType.props) {
        exportedType.props = exportedType.props.map((p) => {
            p.typeValue = prettyPrintTypeValue(p.typeValue);
            return p;
        });
    }

    res.send({
        content: exportedType,
    });
});

router.get('/ts-docs/types/navigation', (req, res) => {
    const { publicTypes } = readDocsGenResultsJson();
    const content = Object.keys(publicTypes).reduce((acc, packageName) => {
        acc[packageName] = Object.keys(publicTypes[packageName]);
        return acc;
    }, {});
    res.send({
        content,
    });
});

router.get('/ts-docs/types/refs', (req, res) => {
    const { refs } = readDocsGenResultsJson();
    res.send({
        content: refs,
    });
});

module.exports = router;
