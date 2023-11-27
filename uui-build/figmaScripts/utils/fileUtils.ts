import fs from 'fs';
import path from 'path';
import { IFigmaVarCollection } from '../types';
import { logger, uuiRoot } from '../constants';
import { FigmaScriptsContext } from '../context/context';

export class FileUtils {
    static writeResults(params: { result: IFigmaVarCollection, ctx: FigmaScriptsContext }) {
        const { result, ctx } = params;
        const { resultsDir, sourceFigmaVarCollection } = ctx.config;
        const outDir = path.resolve(uuiRoot, resultsDir);
        const extName = path.extname(sourceFigmaVarCollection);
        const sourceFileNameNoExt = path.basename(sourceFigmaVarCollection, extName);
        const resultPath = forwardSlashes(path.resolve(outDir, `${sourceFileNameNoExt}-converted${extName}`));
        const logPath = forwardSlashes(path.resolve(outDir, `${sourceFileNameNoExt}-log${extName}`));
        fs.writeFileSync(resultPath, JSON.stringify(result, undefined, 2));
        fs.writeFileSync(logPath, JSON.stringify(ctx.log.toJson(), undefined, 2));
        logger.success(`Files created:\n${resultPath}\n${logPath}`);
    }

    static readFigmaVarCollection(ctx: FigmaScriptsContext): IFigmaVarCollection {
        const absPath = path.resolve(uuiRoot, ctx.config.sourceFigmaVarCollection);
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
