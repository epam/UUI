import {
    IDocBuilderGenCtx, OneOfEditor, overrideProp, TDocConfig, TPropEditorTypeOverride, TSkin, TTypeProp, TTypeRef,
} from '@epam/uui-docs';
import { useUuiContext } from '@epam/uui-core';
import { useEffect, useMemo, useState } from 'react';
import { loadDocsGenType } from '../apiReference/dataHooks';
import { getAllIcons } from '../../documents/iconListHelpers';
import { AppContext } from '../../data';
import { ThemeId, BuiltInTheme } from '@epam/uui-docs';
import { CustomThemeManifest } from '../../data/customThemes';
import { useAppThemeContext } from '../../helpers/appTheme';
import prism from 'prismjs';
import { svc } from '../../services';

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

export const useExampleProps = (
    config: TDocConfig | undefined,
    type: TTypeRef | undefined,
    theme: ThemeId,
    propsOverride: TPropEditorTypeOverride[TTypeRef] | undefined,
) => {
    const [exampleProps, setExampleProps] = useState<Record<string, TTypeProp>>();

    useEffect(() => {
        if (config && type) {
            const loadExampleProps = async () => {
                const { content: { details } } = await loadDocsGenType(type);
                const initialProps = details.props;

                const updatedProps: Record<string, TTypeProp> = initialProps.reduce((prev, current) => {
                    const newProp = propsOverride && propsOverride[current.name] ? overrideProp(current, propsOverride[current.name]) : current;
                    return { ...prev, [current.name]: newProp };
                }, {});

                setExampleProps(updatedProps);
            };

            loadExampleProps().catch(console.error);
        }
    }, [config, type, theme, propsOverride]);

    return exampleProps;
};

export const useCode = (path: string, raw: string | undefined, exampleProps: Record<string, TTypeProp> | undefined, config: TDocConfig | undefined) => {
    const [code, setCode] = useState<string>();

    useEffect(() => {
        if (raw && exampleProps) {
            const newRaw = generateNewRawString(raw, exampleProps);
            const highlightedCode = prism.highlight(newRaw, prism.languages.ts, 'typescript');
            setCode(highlightedCode);
        }
    }, [exampleProps, raw]);

    useEffect(() => {
        if (!config) {
            svc.api.getCode({ path }).then((r) => {
                const highlightedCode = prism.highlight(r.raw, prism.languages.ts, 'typescript');
                setCode(highlightedCode);
            });
        }
    }, [config, path]);

    return code;
};

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
