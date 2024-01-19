import { DocBlock, DocPlainText } from '@microsoft/tsdoc';

export function parseBlockTag<T>(db: DocBlock, onResolve: (txt: string | undefined) => ({ extracted: boolean, value: T } | undefined)) {
    const valueParts = db.getChildNodes()[1]; // DocSection
    const firstValuePart = valueParts.getChildNodes()[0]; // DocParagraph
    const txt = firstValuePart.getChildNodes()[0]; // DocPlainText
    if (txt instanceof DocPlainText) {
        return onResolve(txt?.text);
    }
}

export function extractTagValueAsString(txtValueParam: string | undefined): { extracted: boolean, value: string } | undefined {
    const txtValue = txtValueParam?.trim();
    if (typeof txtValue !== 'undefined') {
        return {
            extracted: true,
            value: txtValue,
        };
    }
}

export function extractTagValue(txtValueParam: string | undefined): { extracted: boolean, value: boolean | string | number | null } | undefined {
    const txtValue = txtValueParam?.trim();
    const isInQuotes = (t: string) => ["'", '"'].indexOf(t[0]) !== -1 && ["'", '"'].indexOf(t[t.length - 1]) !== -1;
    if (typeof txtValue !== 'undefined') {
        let value: boolean | string | number | null;

        switch (txtValue) {
            case 'true':
            case 'false': {
                value = txtValue === 'true';
                break;
            }
            case 'null': {
                value = null;
                break;
            }
            default: {
                if (!isNaN(+txtValue)) {
                    value = +txtValue;
                } else if (isInQuotes(txtValue)) {
                    value = txtValue.substring(1, txtValue.length - 1);
                } else {
                    return;
                }
                break;
            }
        }
        return {
            extracted: true,
            value,
        };
    }
}

export function cleanAsteriks(line: string): string {
    const regex1 = /^([\s]*\/[*]{1,2})(.*)$/; // leading /* or /**
    const regex2 = /^(.*)([\s]*[*]{1,2}\/)$/; // trailing */ or **/
    const regex3 = /^([\s]*[*]{1,1})(.*)$/; // leading *
    return line.replace(regex1, '$2').replace(regex2, '$1').replace(regex3, '$2');
}
