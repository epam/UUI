const express = require('express');
const { highlightTsCode } = require('./prism');
const fs = require('fs');
const path = require('path');

const router = express.Router();

/**
 *
 * @returns {import('@epam/uui-build/docsGen/types/sharedTypes.ts').TApiReferenceJson}
 */
function readDocsGenResultsJson() {
    const filePath = path.join(__dirname, '../../public/docs/docsGenOutput/docsGenOutput.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 *
 * @param typeValue {import('@epam/uui-build/docsGen/types/sharedTypes.ts').TTypeValue}
 * @returns {import('@epam/uui-build/docsGen/types/sharedTypes.ts').TTypeValue}
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

router.get('/ts-docs/details/:shortRef', (req, res) => {
    const shortRef = req.params.shortRef;
    if (!shortRef) {
        res.sendStatus(400);
    }
    const { allTypes } = readDocsGenResultsJson();

    const exportedType = allTypes[shortRef];
    const details = exportedType.details;

    if (details) {
        details.typeValue = prettyPrintTypeValue(details.typeValue);
        if (details.props) {
            details.props = details.props.map((p) => {
                p.typeValue = prettyPrintTypeValue(p.typeValue);
                return p;
            });
        }
    }

    res.send({
        content: exportedType,
    });
});

router.get('/ts-docs/exports', (req, res) => {
    const { allTypes } = readDocsGenResultsJson();
    const exportedTypes = Object.keys(allTypes).filter((ref) => {
        return allTypes[ref].summary.exported;
    });
    const exports = exportedTypes.reduce((acc, ref) => {
        const sum = allTypes[ref].summary;
        const exportName = sum.typeName.name;
        const moduleName = sum.module;
        if (!acc[moduleName]) {
            acc[moduleName] = [];
        }
        acc[moduleName].push(exportName);
        return acc;
    }, {});

    res.send({
        content: exports,
    });
});

/**
 * We only return "summary" part of each type for performance reasons.
 */
router.get('/ts-docs/summaries', (req, res) => {
    const { allTypes } = readDocsGenResultsJson();
    const content = Object.keys(allTypes).reduce((acc, typeRef) => {
        acc[typeRef] = allTypes[typeRef].summary;
        return acc;
    }, {});

    res.send({
        content,
    });
});

module.exports = router;
