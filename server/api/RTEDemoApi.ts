import express from 'express';
import fs from 'fs';
import path from 'path';
import { sortBy } from 'lodash';

const router = express.Router();

router.post('/get-demo-doc-content', (req, res) => {
    const contentDir = path.resolve(__dirname, '../../../public/rte_contents');
    const docContentPath = path.resolve(contentDir, `${req.body.name}`);
    const relativeToContentDir = path.relative(contentDir, docContentPath);
    if (relativeToContentDir.startsWith('..') || path.isAbsolute(relativeToContentDir)) {
        return res.send(null);
    }
    if (!fs.existsSync(docContentPath)) {
        return res.send(null);
    }
    const content = JSON.parse(JSON.parse(fs.readFileSync(docContentPath, 'utf8')).content);
    return res.send(content);
});

router.get('/get-contents-list', (req, res) => {
    const propsFilePath = path.join(__dirname, '../../../public/rte_contents');
    const contentsList = [];
    fs.readdirSync(propsFilePath).forEach((file) => {
        contentsList.push(file);
    });
    res.send(sortBy(contentsList, (i) => {
        const regex = /(\d+)/;
        const match = i.match(regex);
        return +match[0];
    }));
});

export default router;
