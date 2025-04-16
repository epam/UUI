const express = require('express');
const { highlightTsCode } = require('./prism');
const fs = require('fs');
const path = require('path');

const router = express.Router();

/**
 *
 * @returns {import('@epam/uui-build/ts/tasks/docsGen/types/sharedTypes.ts').TApiReferenceJson}
 */
function readDocsGenResultsJson() {
    const filePath = path.join(__dirname, '../../public/docs/docsGenOutput/docsGenOutput.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 *
 * @param typeValue {import('@epam/uui-build/ts/tasks/docsGen/types/sharedTypes.ts').TTypeValue}
 * @returns {import('@epam/uui-build/ts/tasks/docsGen/types/sharedTypes.ts').TTypeValue}
 */
function prettyPrintTypeValue(typeValue) {
    if (typeValue) {
        const pp = {};
        if (typeValue.print) {
            pp.print = highlightTsCode(typeValue.print.join('\n')).split('\n');
        }
        if (typeValue.raw) {
            pp.html = highlightTsCode(typeValue.raw);
        }
        return {
            ...typeValue,
            ...pp,
        };
    }
    return typeValue;
}

router.get('/docs-gen/details/:shortRef', (req, res) => {
    const shortRef = req.params.shortRef;
    if (!shortRef) {
        res.sendStatus(400);
    }
    const { docsGenTypes } = readDocsGenResultsJson();

    const exportedType = docsGenTypes[shortRef];
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

router.get('/docs-gen/exports', (req, res) => {
    const { docsGenTypes } = readDocsGenResultsJson();
    const exportedTypes = Object.keys(docsGenTypes).filter((ref) => {
        return docsGenTypes[ref].summary.exported;
    });
    const exports = exportedTypes.reduce((acc, ref) => {
        const sum = docsGenTypes[ref].summary;
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
router.get('/docs-gen/summaries', (req, res) => {
    const { docsGenTypes } = readDocsGenResultsJson();
    const content = Object.keys(docsGenTypes).reduce((acc, typeRef) => {
        acc[typeRef] = docsGenTypes[typeRef].summary;
        return acc;
    }, {});

    res.send({
        content,
    });
});

module.exports = router;
