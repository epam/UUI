import { IPropSamplesCreationContext, PropDoc, PropExampleObject, TSkin } from '@epam/uui-docs';
import { TTheme, TUUITheme } from '../BaseDocsBlock';

export function isPropValueEmpty(propValue: any): boolean {
    return propValue === undefined;
}

export function getExamplesList(examples: PropDoc<any, any>['examples'], ctx: IPropSamplesCreationContext): PropExampleObject<any>[] {
    if (typeof examples === 'function') {
        return examples(ctx);
    } else if (examples.length) {
        return examples;
    }
    return [];
}

export function getSkin(theme: TUUITheme, isSkin: boolean): TSkin {
    if (!isSkin) return TSkin.UUI;

    switch (theme) {
        case `uui-theme-${TTheme.electric}`:
            return TSkin.Electric;
        case `uui-theme-${TTheme.loveship}`:
        case `uui-theme-${TTheme.loveship_dark}`:
            return TSkin.Loveship;
        case `uui-theme-${TTheme.promo}`:
            return TSkin.Promo;
        default:
            return TSkin.UUI;
    }
}

export function getInputValuesFromInputData(inputData: { [name: string]: { value?: any; exampleId?: string } }) {
    return Object.keys(inputData).reduce<{ [name: string]: any }>((acc, name) => {
        const value = inputData[name].value;
        if (!isPropValueEmpty(value)) {
            acc[name] = value;
        }
        return acc;
    }, {});
}
