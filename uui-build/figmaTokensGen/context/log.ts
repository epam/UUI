export class Log {
    private supportedTokens: string[] = [];
    private unsupportedTokens: string[] = [];

    logSupported(v: string) {
        this.supportedTokens.push(v);
    }

    logUnsupported(v: string) {
        this.unsupportedTokens.push(v);
    }

    toJson() {
        const { unsupportedTokens, supportedTokens } = this;
        const timestamp = getTimestamp();
        return { timestamp, supportedTokens, unsupportedTokens };
    }
}

export function getTimestamp(): string {
    return new Date().toISOString();
}
