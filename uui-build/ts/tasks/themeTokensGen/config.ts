import { TFigmaThemeName, TUuiCssVarName } from './types/sharedTypes';
import { corePathToCssVar, palettePathToCssVar } from './utils/cssVarUtils';

interface IFigmaVarsConfig {
    [pathPrefix: string]: IFigmaVarConfigValue
}
export type TList = Record<string, TFigmaThemeName[] | '*'>;
export interface IFigmaVarConfigValue {
    enabled: boolean;
    pathToCssVar: (path: string) => TUuiCssVarName;
    whitelist?: TList;
    blacklist?: TList;
}

export const FIGMA_VARS_CFG: IFigmaVarsConfig = {
    'core/': {
        enabled: true,
        pathToCssVar: corePathToCssVar,
    },
    'palette-additional/': {
        enabled: true,
        pathToCssVar: palettePathToCssVar,
    },
    'palette/': {
        enabled: true,
        pathToCssVar: palettePathToCssVar,
    },
};
