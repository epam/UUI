const express = require('express');

const router = express.Router();
const fs = require('fs').promises;

router.post('/template-endpoint', async (req, res) => {
    try {
        const appDirectory = await fs.realpath(process.cwd());

        res.json({ hello: 'Hello', request: req.body, appDirectory });
    } catch {
        res.statusCode(500);
    }
});

module.exports = router;
