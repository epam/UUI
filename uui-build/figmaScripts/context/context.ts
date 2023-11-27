import { Log } from './log';
import { ITokensConfig } from '../types';
import path from 'path';
import { CONFIG_PATH, uuiRoot } from '../constants';
import fs from 'fs';

export class FigmaScriptsContext {
    public readonly log: Log;
    public readonly config: ITokensConfig;

    constructor() {
        this.log = new Log();
        this.config = readConfig();
    }
}

function readConfig(): ITokensConfig {
    const absPath = path.resolve(uuiRoot, CONFIG_PATH);
    const content = fs.readFileSync(absPath).toString();
    return JSON.parse(content);
}
