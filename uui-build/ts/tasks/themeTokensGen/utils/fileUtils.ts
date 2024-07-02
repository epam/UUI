import fs from 'fs';
import { IFigmaVarCollection } from '../types/sourceTypes';
import { logger } from '../../../utils/jsBridge';

export function readFigmaVarCollection(absPath: string): IFigmaVarCollection {
    if (fs.existsSync(absPath)) {
        const content = fs.readFileSync(absPath);
        return JSON.parse(content.toString());
    }
    throw new Error(`Figma var collection not found: ${absPath}`);
}

export function forwardSlashes(pathStr: string): string {
    return pathStr.replace(/\\/g, '/');
}

export function logFileCreated(pathStr: string) {
    logger.success(`File created: ${forwardSlashes(pathStr)}`);
}
