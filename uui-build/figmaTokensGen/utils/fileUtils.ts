import fs from 'fs';
import path from 'path';
import { IFigmaVarCollection } from '../types';
import { logger, uuiRoot, PATH } from '../constants';
import { FigmaScriptsContext } from '../context/context';

export class FileUtils {
    static writeResults(params: { result: IFigmaVarCollection, ctx: FigmaScriptsContext }) {
        const { result, ctx } = params;
        const outDir = path.resolve(uuiRoot, PATH.RESULTS_DIR);
        const extName = path.extname(PATH.FIGMA_VARS_COLLECTION_SRC);
        const sourceFileNameNoExt = path.basename(PATH.FIGMA_VARS_COLLECTION_SRC, extName);
        const resultPath = forwardSlashes(path.resolve(outDir, `${sourceFileNameNoExt}-generated${extName}`));
        const logPath = forwardSlashes(path.resolve(outDir, `${sourceFileNameNoExt}-log${extName}`));
        fs.writeFileSync(resultPath, JSON.stringify(result, undefined, 2));
        fs.writeFileSync(logPath, JSON.stringify(ctx.log.toJson(), undefined, 2));
        logger.success(`Files created:\n${resultPath}\n${logPath}`);
    }

    static readFigmaVarCollection(): IFigmaVarCollection {
        const absPath = path.resolve(uuiRoot, PATH.FIGMA_VARS_COLLECTION_SRC);
        if (fs.existsSync(absPath)) {
            const content = fs.readFileSync(absPath);
            return JSON.parse(content.toString());
        }
        throw new Error(`Figma var collection not found: ${absPath}`);
    }
}

function forwardSlashes(pathStr: string) {
    return pathStr.replace(/\\/g, '/');
}
