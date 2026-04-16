import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { highlightTsCode } from './prism';

const router = express.Router();

const EXAMPLES_ROOT = path.resolve(__dirname, '../../../app/src/docs/_examples');

function resolveSafeExamplePath(userPath: unknown): string | null {
    if (typeof userPath !== 'string' || userPath.length === 0) {
        return null;
    }
    if (path.isAbsolute(userPath)) {
        return null;
    }
    const resolved = path.resolve(EXAMPLES_ROOT, userPath);
    const relative = path.relative(EXAMPLES_ROOT, resolved);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
        return null;
    }
    return resolved;
}

router.post('/get-code', async (req: any, res: any) => {
    try {
        const params = req.body;
        const filePath = resolveSafeExamplePath(params?.path);

        if (!filePath) {
            return res.status(500).json({ error: 'path is not inside docs examples folder' });
        }

        const gitPath = String(params.path).replace(/\\/g, '/').replace(/^\/+/, '');
        const gitUrl = `https://github.com/epam/UUI/tree/develop/${gitPath}`;

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
