import { SyntaxKind } from 'ts-morph';
import { ConverterUtils } from './converters/converterUtils';

class DocGenStatsBucket {
    private data: Record<string, Set<string>> = {};
    add(kind: SyntaxKind, value: string) {
        const kindStr = ConverterUtils.kindToString(kind);
        if (typeof this.data[kindStr] === 'undefined') {
            this.data[kindStr] = new Set();
        }
        this.data[kindStr].add(value);
    }

    toString() {
        const r = Object.keys(this.data).reduce<Record<string, string[]>>((acc, kind) => {
            acc[kind] = [...this.data[kind]];
            return acc;
        }, {});
        return JSON.stringify(r, undefined, 1);
    }
}

export class DocGenStats {
    private ignoredExports = new DocGenStatsBucket();
    private collectedExports = new DocGenStatsBucket();

    addIgnored(kind: SyntaxKind, name: string) {
        this.ignoredExports.add(kind, name);
    }

    addCollected(kind: SyntaxKind, name: string) {
        this.collectedExports.add(kind, name);
    }

    printIgnored() {
        // eslint-disable-next-line no-console
        console.log(`Ignored.\n${this.ignoredExports.toString()}`);
    }
}
