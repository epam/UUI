import path from 'path';
import { readFigmaVarCollection, writeFileSync } from './utils/fileUtils';
import { getHiddenFromPublishingVarPlaceholder } from './constants';
import {
    convertRawToken,
    getCssVarFromFigmaVar, getCssVarSupportForToken, canTokenPotentiallyDefineCssVar,
} from './utils/figmaVarUtils';
import { IThemeVar } from './types/sharedTypes';
import { IFigmaVarCollection, IFigmaVarRaw, IFigmaVarRawNorm } from './types/sourceTypes';
import { ITaskConfig, TTaskParams } from '../../utils/taskUtils';
import { normalizeFigmaVarRawMap } from './utils/firmaVarRawNormalizer';
import { sortSupportedTokens } from './utils/sortingUtils';
import { mixinsGenerator } from './mixinsGenerator/mixinsGenerator';

const ARGS = {
    // source collection JSON (UX designers should provide it)
    TOKENS: '--tokens',
    // output folder for SCSS mixins
    OUT: '--out',
    // source collection with info about CSS variables added (it must be sent to UX designers so that they import it back to Figma)
    OUT_TOKENS: '--out-tokens',
    // normalized collection of theme tokens with inheritance hierarchy (It is used for: color palette docs, table with tokens in sandbox)
    OUT_TOKENS_DATA: '--out-tokens-data',
};

export const taskConfig: ITaskConfig = {
    main,
    cliArgs: {
        [ARGS.TOKENS]: { format: 'NameValue', required: true },
        [ARGS.OUT]: { format: 'NameValue', required: true },
        [ARGS.OUT_TOKENS]: { format: 'NameValue', required: false },
        [ARGS.OUT_TOKENS_DATA]: { format: 'NameValue', required: false },
    },
};

async function main(params: TTaskParams) {
    const {
        [ARGS.TOKENS]: { value: srcTokensPath },
        [ARGS.OUT]: { value: outPath },
        [ARGS.OUT_TOKENS]: outTokens,
        [ARGS.OUT_TOKENS_DATA]: outTokensData,
    } = params.cliArgs;

    const srcTokensData = readFigmaVarCollection(srcTokensPath as string);
    const { outTokensJson, outTokensDataJson } = generateTokens({ srcTokensData });
    if (outTokensData?.value) {
        const outTokensDataPathAbs = path.resolve(outTokensData.value as string);
        writeFileSync(outTokensDataPathAbs, JSON.stringify(outTokensDataJson, undefined, 2));
    }
    if (outTokens?.value) {
        const outTokensPathAbs = path.resolve(outTokens.value as string);
        writeFileSync(outTokensPathAbs, JSON.stringify(outTokensJson, undefined, 2));
    }

    await mixinsGenerator(outTokensDataJson, outPath as string);
}

function generateTokens(params: { srcTokensData: IFigmaVarCollection }) {
    const { srcTokensData } = params;
    const exposedTokens: IThemeVar[] = [];

    // non-filtered map
    const rawVarsById = srcTokensData.variables.reduce<Record<string, IFigmaVarRaw>>((acc, figmaVar) => {
        acc[figmaVar.id] = figmaVar;
        return acc;
    }, {});
    const figmaVarByNameNorm = normalizeFigmaVarRawMap({ rawVarsById, modes: srcTokensData.modes });

    const variables = srcTokensData.variables.map((figmaVar) => {
        const rawTokenNorm = figmaVarByNameNorm[figmaVar.name] as IFigmaVarRawNorm;
        const canPotentiallyDefineCssVar = canTokenPotentiallyDefineCssVar({ rawTokenNorm, modes: srcTokensData.modes });

        if (canPotentiallyDefineCssVar) {
            const converted = convertRawToken({ rawTokenNorm, modes: srcTokensData.modes, figmaVarByNameNorm });
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

    const outTokensJson = { ...srcTokensData, variables };
    const outTokensDataJson = { modes: srcTokensData.modes, exposedTokens };

    return { outTokensJson, outTokensDataJson };
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
