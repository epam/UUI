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
    SRC_COLLECTION: '--src-collection',
    OUT_COLLECTION: '--out-collection',
    OUT_TOKENS: '--out-tokens',
    OUT_MIXINS: '--out-mixins',
};

export const taskConfig: ITaskConfig = {
    main,
    cliArgs: {
        [ARGS.SRC_COLLECTION]: { format: 'NameValue', required: true },
        [ARGS.OUT_MIXINS]: { format: 'NameValue', required: true },
        [ARGS.OUT_COLLECTION]: { format: 'NameValue', required: false },
        [ARGS.OUT_TOKENS]: { format: 'NameValue', required: false },
    },
};

async function main(params: TTaskParams) {
    const {
        [ARGS.SRC_COLLECTION]: { value: srcCollectionPath },
        [ARGS.OUT_COLLECTION]: outCollection,
        [ARGS.OUT_TOKENS]: outTokens,
        [ARGS.OUT_MIXINS]: { value: outMixinsPath },
    } = params.cliArgs;

    const srcCollectionData = readFigmaVarCollection(srcCollectionPath as string);
    const { outCollectionData, outTokensData } = generateTokens({ srcCollectionData });
    if (outCollection?.value) {
        const outCollectionPathAbs = path.resolve(outCollection.value as string);
        writeFileSync(outCollectionPathAbs, JSON.stringify(outCollectionData, undefined, 2));
    }
    if (outTokens?.value) {
        const outTokensPathAbs = path.resolve(outTokens.value as string);
        writeFileSync(outTokensPathAbs, JSON.stringify(outTokensData, undefined, 2));
    }

    await mixinsGenerator(outTokensData, outMixinsPath as string);
}

function generateTokens(params: { srcCollectionData: IFigmaVarCollection }) {
    const { srcCollectionData } = params;
    const exposedTokens: IThemeVar[] = [];

    // non-filtered map
    const rawVarsById = srcCollectionData.variables.reduce<Record<string, IFigmaVarRaw>>((acc, figmaVar) => {
        acc[figmaVar.id] = figmaVar;
        return acc;
    }, {});
    const figmaVarByNameNorm = normalizeFigmaVarRawMap({ rawVarsById, modes: srcCollectionData.modes });

    const variables = srcCollectionData.variables.map((figmaVar) => {
        const rawTokenNorm = figmaVarByNameNorm[figmaVar.name] as IFigmaVarRawNorm;
        const canPotentiallyDefineCssVar = canTokenPotentiallyDefineCssVar({ rawTokenNorm, modes: srcCollectionData.modes });

        if (canPotentiallyDefineCssVar) {
            const converted = convertRawToken({ rawTokenNorm, modes: srcCollectionData.modes, figmaVarByNameNorm });
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

    const outCollectionData = { ...srcCollectionData, variables };
    const outTokensData = { modes: srcCollectionData.modes, exposedTokens };

    return { outCollectionData, outTokensData };
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
