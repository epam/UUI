import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

router.get('/get-changelog', async (req, res) => {
    try {
        const appDirectory = await fs.realpath(process.cwd());
        const docDirectory = path.join(appDirectory, '../');
        const docPath = path.join(docDirectory, 'changelog.md');
        const markdown = await fs.readFile(docPath, 'utf8');
        res.send({ markdown });
    } catch {
        res.status(500);
    }
});

export default router;
