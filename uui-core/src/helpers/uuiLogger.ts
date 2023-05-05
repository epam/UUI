enum MsgLevel {
    error = 'error',
    warn = 'warn',
    log = 'log'
}

function getCurrentStack(cutItems: number = 0) {
    let stack = new Error().stack;
    if (cutItems > 0) {
        const rest = stack.slice(1).split('\n');
        stack = rest.slice(cutItems).join('\n');
    }
    return stack;
}

function getKey(msg: string, args: any[]) {
    return msg + args.join();
}

class UuiLogger {
    private msgHistory: { [key: string]: true } = {};

    private msgAddToHistory = (msg: string, args: any[]) => {
        this.msgHistory[getKey(msg, args)] = true;
    };

    private msgIsAlreadyLogged = (msg: string, args: any[]) => {
        const isNew = !this.msgHistory[getKey(msg, args)];
        return !isNew;
    };

    private addToLog = (severity: MsgLevel, msg: string, args: any[]): void => {
        if (this.msgIsAlreadyLogged(msg, args)) {
            return;
        }
        this.msgAddToHistory(msg, args);
        let method = console[severity];
        // @ts-ignore
        const origMethodReplaced = method.__REACT_DEVTOOLS_STRICT_MODE_ORIGINAL_METHOD__;

        if (origMethodReplaced) {
            method = origMethodReplaced;
        }
        method(msg, ...args);
    };

    /**
     * Logs warning to console in DEV mode only. Does nothing in production.
     *
     * @param msg
     * @param args
     */
    public warn = (msg: string, ...args: any[]) => {
        if (__DEV__) {
            const stack = getCurrentStack(3);

            this.addToLog(MsgLevel.error, `[UUI Warning]: ${msg}\n\n%s`, [...args, stack]);
        }
    };
}

export const devLogger = new UuiLogger();
