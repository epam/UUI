import express from 'express';
import { readDocsGenResultsJson, getComponentSummariesLookup } from '../utils/docsGen';

const router = express.Router();

router.get('/docs-gen/details/:shortRef', (req, res) => {
    const shortRef = req.params.shortRef;
    if (!shortRef) {
        res.sendStatus(400);
    }
    const { docsGenTypes } = readDocsGenResultsJson();

    const exportedType = docsGenTypes[shortRef];

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
    const content = getComponentSummariesLookup();
    res.send({
        content,
    });
});

export default router;
