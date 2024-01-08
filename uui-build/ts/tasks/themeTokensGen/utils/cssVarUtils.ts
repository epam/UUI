import { TUuiCssVarName } from '../types/sharedTypes';

export function palettePathToCssVar(path: string): TUuiCssVarName {
    const tokens = path.split('/');
    const lastToken = tokens[tokens.length - 1];
    return `--${lastToken}`;
}
export function corePathToCssVar(path: string): TUuiCssVarName {
    const tokens = path.split('/');
    const lastToken = tokens[tokens.length - 1];
    return `--uui-${lastToken}`;
}
