// eslint-disable-next-line import/no-extraneous-dependencies
import Prism from 'prismjs';
// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import loadLanguages from 'prismjs/components/index';
import { TResultJson, TTypeValue } from './types/docsGenSharedTypes';

loadLanguages(['typescript']);

export function highlightTsCode(json: TResultJson): TResultJson {
    const jsonCopy = JSON.parse(JSON.stringify(json)) as TResultJson; // deep copy
    const byModule = jsonCopy.byModule;
    Object.keys(byModule).forEach((packageName) => {
        const content = byModule[packageName];
        Object.keys(content).forEach((exportName) => {
            const data = content[exportName];
            prettyPrintTypeValue(data.typeValue);
            if (data.props) {
                data.props = data.props.map((p) => {
                    prettyPrintTypeValue(p.typeValue);
                    return p;
                });
            }
        });
    });
    return jsonCopy;
}

function prettyPrintTypeValue(typeValue: TTypeValue) {
    if (typeValue) {
        if (typeValue.print) {
            typeValue.print = highlightString(typeValue.print.join('\n')).split('\n');
        }
        if (typeValue.raw) {
            typeValue.raw = highlightString(typeValue.raw);
        }
    }
}

function highlightString(str: string): string {
    if (typeof str !== 'undefined') {
        return Prism.highlight(str, Prism.languages.typescript, 'typescript');
    }
}
