import path from 'path';
import { logger } from '../../utils/jsBridge';
import { IThemeVar, IUuiTokensCollection, TCssVarSupport, TFigmaThemeName } from '../themeTokensGen/types/sharedTypes';
import { getThemeMixinsFilePath } from './constants';
import { ITaskConfig } from '../../utils/taskUtils';
import { uuiRoot } from '../../constants';
import { createFileSync } from '../../utils/fileUtils';
import { readFigmaTokens } from './utils/tokensFileUtils';
import { formatVarsAsMixin } from './utils/tokenFormatters';

export const taskConfig: ITaskConfig = { main };

async function main() {
    const tokens = readFigmaTokens();
    Object.values(tokens.modes).forEach((figmaTheme) => {
        genForFigmaTheme({
            tokens,
            figmaTheme,
        });
    });
}

function genForFigmaTheme(params: { figmaTheme: TFigmaThemeName, tokens: IUuiTokensCollection }) {
    const { figmaTheme, tokens } = params;

    const scssVars: { token: IThemeVar, name: string, value: string }[] = [];
    const cssVars: { token: IThemeVar, name: string, value: string }[] = [];

    const themeVarsMapById = tokens.exposedTokens.reduce<Record<string, IThemeVar>>((acc, v) => {
        acc[v.id] = v;
        return acc;
    }, {});

    tokens.exposedTokens.forEach((token) => {
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
    const mixinsPath = getThemeMixinsFilePath(figmaTheme);
    const mixinsPathRes = path.resolve(uuiRoot, mixinsPath);
    createFileSync(mixinsPathRes, content);
    logger.success(`File created: ${mixinsPathRes}`);
}

function getScssVarNameForToken(token: IThemeVar) {
    return '$-' + token.id.replace(/\//g, '_');
}

function canHaveCssVar(support: TCssVarSupport) {
    return support === 'supported' || support === 'supportedExceptFigma';
}
