import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { pathToFileURL } from 'url';
import * as sass from 'sass';
import { highlightTsCode } from './prism';

const UUI_DND_MIXINS_PATH = path.resolve(__dirname, '../../../uui/assets/styles/dnd.scss');

/** Strip webpack-style ~@epam @import/@use — not resolvable in server sass; theme CSS is loaded in CodeSandbox separately. */
async function compileScssForCodesandbox(filePath: string, raw: string): Promise<string> {
    let scssSource = raw.replace(/^@(import|use)\s+['"]~@epam\/[^'"]+['"][^;]*;?\s*\r?\n/gm, '');

    if (scssSource.includes('dnd-cursor-style')) {
        const mixins = await fs.readFile(UUI_DND_MIXINS_PATH, 'utf8');
        scssSource = `${mixins}\n${scssSource}`;
    }

    return sass.compileString(scssSource, {
        style: 'expanded',
        url: pathToFileURL(filePath),
        loadPaths: [path.dirname(filePath)],
    }).css;
}

const router = express.Router();

const EXAMPLES_ROOT = path.resolve(__dirname, '../../../app/src/docs/_examples');
/** Paths are joined relative to EXAMPLES_ROOT (e.g. codesandbox uses ../../data/...); must stay under this tree. */
const GET_CODE_ALLOWED_ROOT = path.resolve(__dirname, '../../../app/src');

function resolveSafeExamplePath(userPath: unknown): string | null {
    if (typeof userPath !== 'string' || userPath.length === 0) {
        return null;
    }
    if (path.isAbsolute(userPath)) {
        return null;
    }
    const resolved = path.resolve(EXAMPLES_ROOT, userPath);
    const relative = path.relative(GET_CODE_ALLOWED_ROOT, resolved);
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
            return res.status(500).json({ error: 'path is not inside allowed app/src tree' });
        }

        const gitPath = String(params.path).replace(/\\/g, '/').replace(/^\/+/, '');
        const gitUrl = `https://github.com/epam/UUI/tree/develop/${gitPath}`;

        const raw = await fs.readFile(filePath, 'utf8');
        const highlighted = highlightTsCode(raw);
        const isScss = filePath.endsWith('.scss');
        const compiledCss = isScss ? await compileScssForCodesandbox(filePath, raw) : undefined;

        res.json({
            ...req.body,
            filePath,
            raw,
            highlighted,
            gitUrl,
            compiledCss,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: message });
    }
});

export default router;
