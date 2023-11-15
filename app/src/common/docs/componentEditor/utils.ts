import { IPropSamplesCreationContext, PropDoc, PropExampleObject } from '@epam/uui-docs';
import { TSkin } from '../docBuilderGen/types';

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

export function getTheme(skin: TSkin) {
    switch (skin) {
        case TSkin.UUI:
            return '';
        case TSkin.UUI4_promo:
            return 'uui-theme-promo';
        case TSkin.UUI3_loveship:
            return 'uui-theme-loveship';
        default:
            return '';
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
