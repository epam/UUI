import { FileUtils } from './utils/fileUtils';
import { IGNORED_VAR_PLACEHOLDER } from './constants';
import { FigmaScriptsContext } from './context/context';
import { logger } from '../jsBridge';
import {
    getCssVarFromFigmaVar,
    isCssVarSupportedByUui,
    getNormalizedResolvedValueMap,
} from './utils/cssVarUtils';
import { IThemeVar } from './types/sharedTypes';

export function main() {
    try {
        generateTokens();
    } catch (err) {
        logger.error(err);
        throw err;
    }
}

function generateTokens() {
    const ctx = new FigmaScriptsContext();
    const source = FileUtils.readFigmaVarCollection();
    const supportedTokens: IThemeVar[] = [];
    const variables = source.variables.map((figmaVar) => {
        const cssVar = getCssVarFromFigmaVar(figmaVar.name);
        const supported = isCssVarSupportedByUui(figmaVar.name);
        if (supported) {
            supportedTokens.push({
                id: figmaVar.name,
                type: figmaVar.type,
                description: figmaVar.description,
                useCases: '',
                cssVar,
                value: getNormalizedResolvedValueMap({ figmaVar, modes: source.modes }),
            });
        }
        return {
            ...figmaVar,
            codeSyntax: {
                ...figmaVar.codeSyntax,
                WEB: supported ? `var(${cssVar})` : IGNORED_VAR_PLACEHOLDER,
            },
        };
    });

    // It will mutate the original arr.
    supportedTokens.sort((t1, t2) => {
        return t1.id.localeCompare(t2.id);
    });

    FileUtils.writeResults({
        newFigmaVarCollection: { ...source, variables },
        uuiTokensCollection: { supportedTokens },
        ctx,
    });
}
