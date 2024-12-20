import {
    IDocBuilderGenCtx, OneOfEditor, TPropEditorTypeOverride, TSkin, TTypeProp, TTypeRef,
} from '@epam/uui-docs';
import { useUuiContext } from '@epam/uui-core';
import { useMemo } from 'react';
import { loadDocsGenType } from '../apiReference/dataHooks';
import { getAllIcons } from '../../documents/iconListHelpers';
import { AppContext, BuiltInTheme, ThemeId } from '../../data';
import { CustomThemeManifest } from '../../data/customThemes';
import { useAppThemeContext } from '../../helpers/appTheme';

export function getSkin(theme: ThemeId, isSkin: boolean): TSkin {
    if (!isSkin) return TSkin.UUI;

    switch (theme) {
        case BuiltInTheme.electric:
            return TSkin.Electric;
        case BuiltInTheme.loveship:
        case BuiltInTheme.loveship_dark:
            return TSkin.Loveship;
        case BuiltInTheme.promo:
            return TSkin.Promo;
        default:
            return TSkin.UUI;
    }
}

export function useDocBuilderGenCtx(propsOverride: TPropEditorTypeOverride[TTypeRef] | undefined): IDocBuilderGenCtx {
    const uuiCtx = useUuiContext<any, AppContext>();
    return useMemo(() => {
        const result: IDocBuilderGenCtx = {
            loadDocsGenType,
            uuiCtx: {
                uuiNotifications: uuiCtx.uuiNotifications,
            },
            demoApi: uuiCtx.api.demo,
            getIconList: getAllIcons,
            propsOverride,
        };
        return result;
    }, [propsOverride, uuiCtx.api.demo, uuiCtx.uuiNotifications]);
}

export function usePropEditorTypeOverride(themeId: ThemeId, typeRef: TTypeRef | undefined): TPropEditorTypeOverride[TTypeRef] | undefined {
    const { themesById } = useAppThemeContext();
    if (typeRef && themesById) {
        const themeDetails = (themesById[themeId] as CustomThemeManifest);
        return themeDetails?.propsOverride?.[typeRef];
    }
}

export function generateNewRawString(initialRaw: string, props: Record<string, TTypeProp>) {
    // Remove the import statement
    const importGetAllPropValuesRegEx = /import\s+\{\s*getAllPropValues\s*\}\s+from\s+'[^']*';[\r\n]*[\r\n]/;
    const importExamplePropsRegEx = /import\s+\{\s*ExampleProps\s*\}\s+from\s+'[^']*';[\r\n]*[\r\n]/;

    let updatedString = initialRaw.replace(importGetAllPropValuesRegEx, '').replace(importExamplePropsRegEx, '');

    // Remove `props: ExampleProps` from function definition
    const functionParamRegEx = /export\sdefault\sfunction\s(\w+)\(props:\sExampleProps\)\s\{/;
    updatedString = updatedString.replace(functionParamRegEx, 'export default function $1() {');

    // Find the getAllPropValues call and extract the key and reverse flag
    const functionCallRegEx = /getAllPropValues\('([a-zA-Z]+)'\s*,\s*(true|false),\s*props\)/;
    const match = updatedString.match(functionCallRegEx);

    if (match) {
        const key = match[1];
        const shouldRevert = match[2] === 'true';

        // Get the values from props
        const values = (props[key].editor as OneOfEditor).options;
        const valuesArray = shouldRevert ? values.slice().reverse() : values;

        // Create the new array string
        const newArrayString = `['${valuesArray.join("', '")}']`;

        // Replace the `getAllPropValues` call with the actual array string in the initial string
        updatedString = updatedString.replace(functionCallRegEx, newArrayString);
    }

    return updatedString;
}
