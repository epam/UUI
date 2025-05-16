import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

router.post('/template-endpoint', async (req: any, res: any) => {
    try {
        const appDirectory = await fs.realpath(path.resolve(__dirname, '../../'));

        res.json({ hello: 'Hello', request: req.body, appDirectory });
    } catch {
        res.status(500);
    }
});

export default router;
