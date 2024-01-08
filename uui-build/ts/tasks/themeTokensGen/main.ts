import { FileUtils } from './utils/fileUtils';
import { IGNORED_VAR_PLACEHOLDER } from './constants';
import { FigmaScriptsContext } from './context/context';
import {
    getCssVarFromFigmaVar,
    getNormalizedResolvedValueMap, isFigmaVarSupported,
} from './utils/figmaVarUtils';
import { IThemeVar, TUuiCssVarName } from './types/sharedTypes';
import { IFigmaVar } from './types/sourceTypes';
import { ITaskConfig } from '../../utils/taskUtils';

export const taskConfig: ITaskConfig = { main };

async function main() {
    generateTokens();
}

function generateTokens() {
    const ctx = new FigmaScriptsContext();
    const source = FileUtils.readFigmaVarCollection();
    const supportedTokens: IThemeVar[] = [];

    // non-filtered map
    const figmaVarById = source.variables.reduce<Record<string, IFigmaVar>>((acc, figmaVar) => {
        acc[figmaVar.id] = figmaVar;
        return acc;
    }, {});

    const variables = source.variables.map((figmaVar) => {
        const cssVar = getCssVarFromFigmaVar(figmaVar.name) as TUuiCssVarName;
        const supported = isFigmaVarSupported({ path: figmaVar.name });
        if (supported) {
            supportedTokens.push({
                id: figmaVar.name,
                type: figmaVar.type,
                description: figmaVar.description,
                useCases: '',
                cssVar,
                valueByTheme: getNormalizedResolvedValueMap({ figmaVar, figmaVarById, modes: source.modes }),
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
        return figmaVarComparator(t1.id, t2.id);
    });

    FileUtils.writeResults({
        newFigmaVarCollection: { ...source, variables },
        uuiTokensCollection: { supportedTokens },
        ctx,
    });
}

export function figmaVarComparator(path1: string, path2: string) {
    const s1 = splitByTrailingNumber(path1);
    const s2 = splitByTrailingNumber(path2);
    return s1.first.localeCompare(s2.first) || (Number(s1.second) - Number(s2.second));
}

function splitByTrailingNumber(figmaVarPath: string): { first: string, second: number | undefined } {
    const reg = /[0-9]+$/;
    if (reg.test(figmaVarPath)) {
        const secondStr = figmaVarPath.match(reg)?.[0] || '';
        const first = figmaVarPath.substring(0, (figmaVarPath.length - secondStr.length));
        return { first, second: Number(secondStr) };
    }
    return { first: figmaVarPath, second: undefined };
}
