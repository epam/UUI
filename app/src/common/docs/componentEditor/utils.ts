import { IPropSamplesCreationContext, PropDoc, PropExampleObject, TSkin } from '@epam/uui-docs';
import { TTheme } from '../docsConstants';

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

export function getSkin(theme: TTheme, isSkin: boolean): TSkin {
    if (!isSkin) return TSkin.UUI;

    switch (theme) {
        case TTheme.electric:
            return TSkin.Electric;
        case TTheme.loveship:
        case TTheme.loveship_dark:
            return TSkin.Loveship;
        case TTheme.promo:
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
