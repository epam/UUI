import { IThemeVar } from '../types/sharedTypes';

export function sortSupportedTokens(tokens: IThemeVar[]) {
    tokens.sort((t1, t2) => {
        return figmaVarComparator(t1.id, t2.id);
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
