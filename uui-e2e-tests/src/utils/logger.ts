export class Logger {
    static warn(...args: any[]) {
        console.error('\x1b[33m%s\x1b[0m', ...args);
    }

    static error(...args: any[]) {
        console.error('\x1b[41m\x1b[37m%s\x1b[0m', ...args);
    }

    static info(...args: any[]) {
        // eslint-disable-next-line no-console
        console.info(...args);
    }

    static infoHighlighted(...args: any[]) {
        // eslint-disable-next-line no-console
        console.log('\x1b[41m\x1b[44m%s\x1b[0m', ...args);
    }
}
