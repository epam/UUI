export type TCliArgParsed = {
    name: string,
    value?: string
};

export type TCliArgConfig = Record<string, { format: 'Name' | 'NameValue', required?: boolean }>;

function getCliArgs() {
    const allArgs = [...process.argv].slice(2);
    return allArgs.reduce<{ name: string, value?: string }[]>((acc, item) => {
        if (item.indexOf('=') !== -1) {
            const [name, value] = item.split('=');
            acc.push({ name, value });
        } else {
            acc.push({ name: item });
        }
        return acc;
    }, []);
}

export function parseCliArgs(args: TCliArgConfig | undefined): TCliArgParsed[] {
    if (args) {
        const argsFromCli = getCliArgs();
        return Object.keys(args).reduce<TCliArgParsed[]>((acc, name) => {
            const { format, required } = args[name];
            const found = argsFromCli.find((p) => p.name === name);
            if (required && !found) {
                throw new Error(`CLI argument ${name} is mandatory`);
            }
            if (found) {
                if (format === 'NameValue' && !found.hasOwnProperty('value')) {
                    throw new Error(`CLI argument ${name} should have next format: <name>=<value>`);
                }
                if (format === 'Name' && found.hasOwnProperty('value')) {
                    throw new Error(`CLI argument ${name} should have next format: <name>`);
                }
                acc.push(found);
            }
            return acc;
        }, []);
    }
    return [];
}
