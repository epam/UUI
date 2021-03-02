var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs').promises;

router.post('/template-endpoint', async (req, res) => {
    try {
        const params = req.body; // JSON-parsed request

        const appDirectory = await fs.realpath(process.cwd());

        res.json({ hello: "Hello", request: req.body, appDirectory });
    } catch {
        res.statusCode(500);
    }
})

module.exports = router;