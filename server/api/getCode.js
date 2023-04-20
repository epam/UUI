const express = require('express');

const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');

loadLanguages(['typescript']);

router.post('/get-code', async (req, res) => {
    try {
        const params = req.body;
        const filePath = path.resolve('src/docs/', path.normalize(params.path));

        const isPathInsideSrcDirectory = filePath.includes(path.normalize('/app/src/'));

        if (!isPathInsideSrcDirectory) {
            return res.status(500).json({ error: `path ${filePath} is not inside docs examples folder)}` });
        }

        const gitUrl = 'https://github.com/epam/UUI/tree/develop' + path.join(...params.path).replace('\\', '/');

        const raw = await fs.readFile(filePath, 'utf8');
        const highlighted = Prism.highlight(raw, Prism.languages.typescript, raw);

        res.json({
            ...req.body,
            filePath,
            raw,
            highlighted,
            gitUrl,
        });
    } catch {
        res.sendStatus(500);
    }
});

module.exports = router;
