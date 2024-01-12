import { FileUtils } from './utils/fileUtils';
import { getHiddenFromPublishingVarPlaceholder, IGNORED_VAR_PLACEHOLDER } from './constants';
import { FigmaScriptsContext } from './context/context';
import {
    convertRawToken,
    getCssVarFromFigmaVar,
    isFigmaTokenSupported,
} from './utils/figmaVarUtils';
import { IThemeVar } from './types/sharedTypes';
import { IFigmaVarRaw, IFigmaVarRawNorm } from './types/sourceTypes';
import { ITaskConfig } from '../../utils/taskUtils';
import { normalizeFigmaVarRawMap } from './utils/firmaVarRawNormalizer';
import { sortSupportedTokens } from './utils/sortingUtils';

export const taskConfig: ITaskConfig = { main };

async function main() {
    generateTokens();
}

function generateTokens() {
    const ctx = new FigmaScriptsContext();
    const source = FileUtils.readFigmaVarCollection();
    const supportedTokens: IThemeVar[] = [];

    // non-filtered map
    const rawVarsById = source.variables.reduce<Record<string, IFigmaVarRaw>>((acc, figmaVar) => {
        acc[figmaVar.id] = figmaVar;
        return acc;
    }, {});
    const figmaVarByNameNorm = normalizeFigmaVarRawMap({ rawVarsById, modes: source.modes });

    const variables = source.variables.map((figmaVar) => {
        const rawTokenNorm = figmaVarByNameNorm[figmaVar.name] as IFigmaVarRawNorm;
        const supported = isFigmaTokenSupported({ rawTokenNorm, modes: source.modes });

        if (supported) {
            const converted = convertRawToken({ rawTokenNorm, modes: source.modes, figmaVarByNameNorm });
            supportedTokens.push(converted);
        }
        return {
            ...figmaVar,
            codeSyntax: {
                ...figmaVar.codeSyntax,
                WEB: getCodeSyntaxValue({ rawTokenNorm, supported }),
            },
        };
    });

    // It will mutate the original arr.
    sortSupportedTokens(supportedTokens);

    FileUtils.writeResults({
        newFigmaVarCollection: { ...source, variables },
        uuiTokensCollection: { supportedTokens },
        ctx,
    });
}

function getCodeSyntaxValue(
    params: { supported: boolean, rawTokenNorm: IFigmaVarRawNorm },
) {
    const { supported, rawTokenNorm } = params;
    if (supported) {
        const cssVar = `var(${getCssVarFromFigmaVar(rawTokenNorm.name)})`;
        if (rawTokenNorm.hiddenFromPublishing) {
            return getHiddenFromPublishingVarPlaceholder(cssVar);
        }
        return cssVar;
    }
    return IGNORED_VAR_PLACEHOLDER;
}
