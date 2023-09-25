const express = require('express');

const router = express.Router();
const fs = require('fs');
const path = require('path');
const { isDevServer } = require('../utils/envUtils');
const { highlightTsCode } = require('./prism');

router.post('/get-doc-content', (req, res) => {
    const docContentPath = path.join(__dirname, '../../', 'public/docs/content/', `${req.body.name}.json`);

    const isPathInsideDocsDirectory = docContentPath.includes(path.normalize('public/docs/content/'));

    if (!isPathInsideDocsDirectory) {
        return res.status(500).json({ error: "Doc with such file name doesn't exist" });
    }

    if (!fs.existsSync(docContentPath)) {
        res.send({ content: null });
    } else {
        const content = JSON.parse(fs.readFileSync(docContentPath, 'utf8'));
        res.send({ content: content });
    }
});

router.post('/save-doc-content', (req, res) => {
    if (!isDevServer()) {
        return res.sendStatus(403);
    }
    const docContentPath = path.join(__dirname, '../../', 'public/docs/content/', `${req.body.name}.json`);

    const isPathInsideDocsDirectory = docContentPath.includes(path.normalize('public/docs/content/'));

    if (!isPathInsideDocsDirectory) {
        return res.status(500).json({ error: "File name isn't correct" });
    }

    fs.writeFileSync(docContentPath, JSON.stringify(req.body.content, null, 2));

    res.send({});
});

router.get('/get-props', (req, res) => {
    const propsFilePath = path.join(__dirname, '../../public/docs/componentsPropsSet.json');

    const content = JSON.parse(fs.readFileSync(propsFilePath, 'utf8'));

    res.send({
        content,
    });
});

function readDocsGenResultsJson() {
    const filePath = path.join(__dirname, '../../public/docs/docsGenOutput/docsGenOutput.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
router.get('/ts-docs/all', (req, res) => {
    const json = readDocsGenResultsJson();
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
    }
    Object.keys(json).forEach((packageName) => {
        const content = json[packageName];
        Object.keys(content).forEach((exportName) => {
            const data = content[exportName];
            data.typeValue = prettyPrintTypeValue(data.typeValue);
            if (data.props) {
                data.props = data.props.map((p) => {
                    p.typeValue = prettyPrintTypeValue(p.typeValue);
                    return p;
                });
            }
        });
    });
    res.send({
        content: json,
    });
});

router.get('/ts-docs/structure', (req, res) => {
    const json = readDocsGenResultsJson();
    const content = Object.keys(json).reduce((acc, packageName) => {
        acc[packageName] = Object.keys(json[packageName]);
        return acc;
    }, {});
    res.send({
        content,
    });
});

module.exports = router;
