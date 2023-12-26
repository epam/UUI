const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

/**
 *
 * @returns {import('@epam/uui-build/ts/figmaTokensGen/types/sharedTypes.ts').IUuiTokensCollection}
 */
function readThemeTokensJson() {
    const filePath = path.join(__dirname, '../../public/docs/figmaTokensGen/ThemeTokens.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Returns array of supported tokens
 */
router.get('/theme-tokens', (req, res) => {
    const { supportedTokens } = readThemeTokensJson();
    res.send({
        content: supportedTokens,
    });
});

module.exports = router;
