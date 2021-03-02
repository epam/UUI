var express = require('express');
var router = express.Router();
const fs = require('fs').promises;
const path = require('path');

router.get('/get-changelog', async (req, res) => {
    try {
        const appDirectory = await fs.realpath(process.cwd());
        const docDirectory = path.join(appDirectory, '../');

        const docPath = path.join(docDirectory, 'changelog.md');

        const markdown = await fs.readFile(docPath, 'utf8');

        res.send({ markdown });
    } catch {
        res.statusCode(500);
    }
})

module.exports = router;