import fs from 'fs';
import path from 'path';
import { IFigmaVarCollection } from '../types/sourceTypes';
import { PATH } from '../constants';
import { FigmaScriptsContext } from '../context/context';
import { logger, uuiRoot } from '../../jsBridge';
import { IUuiTokensCollection } from '../types/sharedTypes';

export class FileUtils {
    static writeResults(
        params: {
            newFigmaVarCollection: IFigmaVarCollection,
            uuiTokensCollection: IUuiTokensCollection,
            ctx: FigmaScriptsContext
        },
    ) {
        const { newFigmaVarCollection, uuiTokensCollection } = params;
        const outDir = path.resolve(uuiRoot, PATH.RESULTS_DIR);
        const extName = path.extname(PATH.FIGMA_VARS_COLLECTION_SRC);
        const sourceFileNameNoExt = path.basename(PATH.FIGMA_VARS_COLLECTION_SRC, extName);
        const resultPath = forwardSlashes(path.resolve(outDir, `${sourceFileNameNoExt}Output${extName}`));
        const uuiTokensCollectionPath = forwardSlashes(path.resolve(outDir, `${sourceFileNameNoExt}Tokens${extName}`));
        fs.writeFileSync(resultPath, JSON.stringify(newFigmaVarCollection, undefined, 2));
        fs.writeFileSync(uuiTokensCollectionPath, JSON.stringify(uuiTokensCollection, undefined, 2));
        logger.success(`Files created:\n${resultPath}\n${uuiTokensCollectionPath}`);
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
