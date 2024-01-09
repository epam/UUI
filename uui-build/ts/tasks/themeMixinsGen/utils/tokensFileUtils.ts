import { IUuiTokensCollection } from '../../themeTokensGen/types/sharedTypes';
import fs from 'fs';
import path from 'path';
import { uuiRoot } from '../../../constants';
import { tokensFile } from '../constants';

export function readFigmaTokens(): IUuiTokensCollection {
    const content = fs.readFileSync(path.resolve(uuiRoot, tokensFile)).toString();
    return JSON.parse(content);
}
