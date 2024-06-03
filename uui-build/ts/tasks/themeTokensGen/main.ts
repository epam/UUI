import { FileUtils } from './utils/fileUtils';
import { getHiddenFromPublishingVarPlaceholder } from './constants';
import { FigmaScriptsContext } from './context/context';
import {
    convertRawToken,
    getCssVarFromFigmaVar, getCssVarSupportForToken, canTokenPotentiallyDefineCssVar,
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
    const exposedTokens: IThemeVar[] = [];

    // non-filtered map
    const rawVarsById = source.variables.reduce<Record<string, IFigmaVarRaw>>((acc, figmaVar) => {
        acc[figmaVar.id] = figmaVar;
        return acc;
    }, {});
    const figmaVarByNameNorm = normalizeFigmaVarRawMap({ rawVarsById, modes: source.modes });

    const variables = source.variables.map((figmaVar) => {
        const rawTokenNorm = figmaVarByNameNorm[figmaVar.name] as IFigmaVarRawNorm;
        const canPotentiallyDefineCssVar = canTokenPotentiallyDefineCssVar({ rawTokenNorm, modes: source.modes });

        if (canPotentiallyDefineCssVar) {
            const converted = convertRawToken({ rawTokenNorm, modes: source.modes, figmaVarByNameNorm });
            exposedTokens.push(converted);
        }
        return {
            ...figmaVar,
            codeSyntax: {
                ...figmaVar.codeSyntax,
                WEB: getFigmaCodeSyntaxValue({ rawTokenNorm, canPotentiallyDefineCssVar }),
            },
        };
    });

    // It will mutate the original arr.
    sortSupportedTokens(exposedTokens);

    FileUtils.writeResults({
        newFigmaVarCollection: { ...source, variables },
        uuiTokensCollection: {
            modes: source.modes,
            exposedTokens,
        },
        ctx,
    });
}

function getFigmaCodeSyntaxValue(params: { rawTokenNorm: IFigmaVarRawNorm, canPotentiallyDefineCssVar: boolean }) {
    const { rawTokenNorm, canPotentiallyDefineCssVar } = params;
    if (canPotentiallyDefineCssVar) {
        const cssVarSupport = getCssVarSupportForToken(rawTokenNorm);
        const cssVarVisibleInFigma = cssVarSupport !== 'notSupported' && cssVarSupport !== 'supportedExceptFigma';

        if (cssVarVisibleInFigma) {
            const cssVarName = getCssVarFromFigmaVar(rawTokenNorm);
            return cssVarName ? `var(${cssVarName})` : undefined;
        }
    }
    // print chain
    const chain: string[] = [rawTokenNorm.name];
    return getHiddenFromPublishingVarPlaceholder(chain.join(' inherited from '));
}
