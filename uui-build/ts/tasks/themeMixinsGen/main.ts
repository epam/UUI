import path from 'path';
import { logger } from '../../utils/jsBridge';
import { IUuiTokensCollection, TFigmaThemeName } from '../themeTokensGen/types/sharedTypes';
import { coreMixinGenTemplate, coreThemeMixinsConfig } from './constants';
import { ITaskConfig } from '../../utils/taskUtils';
import { uuiRoot } from '../../constants';
import { createFileSync } from '../../utils/fileUtils';
import { readFigmaTokens } from './utils/tokensFileUtils';

export const taskConfig: ITaskConfig = { main };

async function main() {
    const tokens = readFigmaTokens();

    Object.values(TFigmaThemeName).forEach((figmaTheme) => {
        genForFigmaTheme({
            tokens,
            figmaTheme,
        });
    });
}

function genForFigmaTheme(params: { figmaTheme: TFigmaThemeName, tokens: IUuiTokensCollection }) {
    const { figmaTheme, tokens } = params;

    const scssVars = new Map<string, string>();

    const cssVarsByGroup: Record<string, Map<string, string>> = {};

    tokens.supportedTokens.forEach(({ valueByTheme, cssVar, id }) => {
        const valueChain = valueByTheme[figmaTheme]?.valueChain;
        if (valueChain) {
            const groupId = id.substring(0, id.lastIndexOf('/'));
            const valueAliases = valueChain.alias;
            const explicitValue = valueChain.value as string;
            let cssVarValue: string;
            if (valueAliases?.length) {
                const firstAlias = valueAliases[0];
                if (firstAlias.supported) {
                    cssVarValue = `var(${firstAlias.cssVar})`;
                } else {
                    const scssVarName = '-' + firstAlias.id.replace(/\//g, '_');
                    cssVarValue = `$${scssVarName}`;
                    scssVars.set(scssVarName, explicitValue);
                }
            } else {
                cssVarValue = explicitValue;
            }
            if (!cssVarsByGroup[groupId]) {
                cssVarsByGroup[groupId] = new Map();
            }
            cssVarsByGroup[groupId].set(cssVar, cssVarValue);
        }
    });

    const errors = '';
    const content = coreMixinGenTemplate({ cssVarsByGroup, scssVars, errors });
    const mixinsPath = coreThemeMixinsConfig[figmaTheme].mixinsFile;
    const mixinsPathRes = path.resolve(uuiRoot, mixinsPath);
    createFileSync(mixinsPathRes, content);
    logger.success(`File created: ${mixinsPathRes}`);
}

/*
function getAllReferencedCssVars(scssFileContent: string) {
    const regexpReferenced = /var\((--[a-zA-Z0-9-]+)\);/gim;
    const resReferenced = [...scssFileContent.matchAll(regexpReferenced)];
    const referenced = new Set<string>();
    resReferenced.forEach((m) => {
        const name = m[1];
        referenced.add(name);
    });

    const regexpDefined = /(--[a-zA-Z0-9-]+): .*;/gim;
    const resDefined = [...scssFileContent.matchAll(regexpDefined)];
    const defined = new Set<string>();
    resDefined.forEach((m) => {
        const name = m[1];
        defined.add(name);
    });

    return retainUnique(referenced, defined);
}

function retainUnique(origSet: Set<string>, setToExclude: Set<string>) {
    const retained = new Set<string>();
    origSet.forEach((r) => {
        if (!setToExclude.has(r)) {
            retained.add(r);
        }
    });
    return retained;
}
*/
