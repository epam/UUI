import { Log } from './log';

export class FigmaScriptsContext {
    public readonly log: Log;

    constructor() {
        this.log = new Log();
    }
}
