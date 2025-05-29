import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { highlightTsCode } from './prism';

const router = express.Router();

router.post('/get-code', async (req: any, res: any) => {
    try {
        const params = req.body;
        const filePath = path.resolve(__dirname, '../../../app/src/docs/', path.normalize(params.path));

        const isPathInsideSrcDirectory = filePath.includes(path.normalize('/app/src/'));

        if (!isPathInsideSrcDirectory) {
            return res.status(500).json({ error: `path ${filePath} is not inside docs examples folder)}` });
        }

        const gitUrl = 'https://github.com/epam/UUI/tree/develop' + path.join(...params.path).replace('\\', '/');

        const raw = await fs.readFile(filePath, 'utf8');
        const highlighted = highlightTsCode(raw);

        res.json({
            ...req.body,
            filePath,
            raw,
            highlighted,
            gitUrl,
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

export default router;
