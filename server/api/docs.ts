import express from 'express';
import fs from 'fs';
import path from 'path';
import { isDevServer } from '../utils/envUtils';

const router = express.Router();

const docsContentDir = path.resolve(__dirname, '../../../public/docs/content');

function resolveDocJsonPath(name: string | undefined): string | null {
    if (name == null || typeof name !== 'string') {
        return null;
    }
    const docContentPath = path.resolve(docsContentDir, `${name}.json`);
    const relativeToContent = path.relative(docsContentDir, docContentPath);
    if (relativeToContent.startsWith('..') || path.isAbsolute(relativeToContent)) {
        return null;
    }
    return docContentPath;
}

router.post('/get-doc-content', (req: any, res: any) => {
    const docContentPath = resolveDocJsonPath(req.body.name);

    if (!docContentPath) {
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
    const docContentPath = resolveDocJsonPath(req.body.name);

    if (!docContentPath) {
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
