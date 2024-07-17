import { IThemeVar, IUuiTokensCollection, TCssVarSupport, TFigmaThemeName } from '../types/sharedTypes';
import { getThemeMixinsFilePath } from './constants';
import { createFileSync } from '../../../utils/fileUtils';

import { formatVarsAsMixin } from './tokenFormatters';
import { logFileCreated } from '../utils/fileUtils';
import { getThemeColorClassesTemplate } from '../templates/templates';
import path from 'path';

export async function mixinsGenerator(figmaTokens: IUuiTokensCollection, outMixinsPath: string) {
    // 1. create color classes mixin shared by all themes; this mixin depends on theme specific CSS vars.
    createFileSync(path.resolve(outMixinsPath, '_color_classes.scss'), getThemeColorClassesTemplate());
    // 2. create theme-specific mixins with tokens
    Object.values(figmaTokens.modes).forEach((figmaTheme) => {
        genForFigmaTheme({
            figmaTokens,
            figmaTheme,
            outMixinsPath,
        });
    });
}

function genForFigmaTheme(
    params: { figmaTheme: TFigmaThemeName, figmaTokens: IUuiTokensCollection, outMixinsPath: string },
) {
    const { figmaTheme, figmaTokens, outMixinsPath } = params;

    const scssVars: { token: IThemeVar, name: string, value: string }[] = [];
    const cssVars: { token: IThemeVar, name: string, value: string }[] = [];

    const themeVarsMapById = figmaTokens.exposedTokens.reduce<Record<string, IThemeVar>>((acc, v) => {
        acc[v.id] = v;
        return acc;
    }, {});

    figmaTokens.exposedTokens.forEach((token) => {
        const { valueByTheme, cssVar } = token;
        const valueChain = valueByTheme[figmaTheme]?.valueChain;
        if (valueChain && canHaveCssVar(token.cssVarSupport)) {
            const valueAliases = valueChain.alias;
            const explicitValue = valueChain.value as string;
            let cssVarValue: string;
            if (valueAliases?.length) {
                const firstAlias = valueAliases[0];
                if (canHaveCssVar(firstAlias.cssVarSupport)) {
                    cssVarValue = `var(${firstAlias.cssVar})`;
                } else {
                    cssVarValue = getScssVarNameForToken(themeVarsMapById[firstAlias.id]);
                    scssVars.push({ token: themeVarsMapById[firstAlias.id], name: cssVarValue, value: explicitValue });
                }
            } else {
                cssVarValue = explicitValue;
            }
            cssVars.push({ token, name: cssVar as string, value: cssVarValue });
        }
    });

    const content = formatVarsAsMixin({ cssVars, scssVars });
    const mixinsPathAbs = getThemeMixinsFilePath(outMixinsPath, figmaTheme);
    createFileSync(mixinsPathAbs, content);
    logFileCreated(mixinsPathAbs);
}

function getScssVarNameForToken(token: IThemeVar) {
    return '$-' + token.id.replace(/\//g, '_');
}

function canHaveCssVar(support: TCssVarSupport) {
    return support === 'supported' || support === 'supportedExceptFigma';
}
