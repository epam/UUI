import express from 'express';
import fs from 'fs';
import path from 'path';
import { isDevServer } from '../utils/envUtils';

const router = express.Router();

router.post('/get-doc-content', (req: any, res: any) => {
    const docContentPath = path.join(__dirname, '../../../', 'public/docs/content/', `${req.body.name}.json`);

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

router.post('/save-doc-content', (req: any, res: any) => {
    if (!isDevServer()) {
        return res.sendStatus(403);
    }
    const docContentPath = path.join(__dirname, '../../../', 'public/docs/content/', `${req.body.name}.json`);

    const isPathInsideDocsDirectory = docContentPath.includes(path.normalize('public/docs/content/'));

    if (!isPathInsideDocsDirectory) {
        return res.status(500).json({ error: "File name isn't correct" });
    }

    fs.writeFileSync(docContentPath, JSON.stringify(req.body.content, null, 2));

    res.send({});
});

router.get('/get-props', (req: any, res: any) => {
    const propsFilePath = path.join(__dirname, '../../../public/docs/componentsPropsSet.json');

    const content = JSON.parse(fs.readFileSync(propsFilePath, 'utf8'));

    res.send({
        content,
    });
});

export default router;
