import express from 'express';
import fs from 'fs';
import path from 'path';
import { sortBy } from 'lodash';

const router = express.Router();

router.post('/get-demo-doc-content', (req, res) => {
    const contentDir = path.join(__dirname, '../../../../../public/rte_contents/');
    const docContentPath = path.resolve(contentDir, `${req.body.name}`);
    if (!docContentPath.startsWith(contentDir)) {
        res.send(null);
    }
    if (!fs.existsSync(docContentPath)) {
        res.send(null);
    } else {
        const content = JSON.parse(JSON.parse(fs.readFileSync(docContentPath, 'utf8')).content);
        res.send(content);
    }
});

router.get('/get-contents-list', (req, res) => {
    const propsFilePath = path.join(__dirname, '../../public/rte_contents');
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
