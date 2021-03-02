var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/get-doc-content', (req, res) => {
    const docContentPath = path.join(__dirname, '../../', 'public/docs/content/', `${req.body.name}.json`);

    const isPathInsideDocsDirectory = docContentPath.includes(path.normalize('public/docs/content/'));

    if(!isPathInsideDocsDirectory) {
        return res.status(500).json({ error: `Doc with such file name doesn't exist` });
    }

    if(!fs.existsSync(docContentPath)) {
        res.send({ content: null });
    } else {
        const content = JSON.parse(fs.readFileSync(docContentPath, "utf8"));
        res.send({ content: content });
    }
})

router.post('/save-doc-content', (req, res) => {
    const docContentPath = path.join(__dirname, '../../', 'public/docs/content/', `${req.body.name}.json`);

    const isPathInsideDocsDirectory = docContentPath.includes(path.normalize('public/docs/content/'));

    if(!isPathInsideDocsDirectory) {
        return res.status(500).json({ error: `File name isn't correct` });
    }

    fs.writeFileSync(docContentPath, JSON.stringify(req.body.content, null, 2));

    res.send({});
})

router.get('/get-props', (req, res) => {
    const propsFilePath = path.join(__dirname, '../../public/docs/componentsPropsSet.json');

    content = JSON.parse(fs.readFileSync(propsFilePath, "utf8"));

    res.send({
        content: content,
    });
})

module.exports = router;