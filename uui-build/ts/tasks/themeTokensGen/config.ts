import { TCssVarSupport, TUuiCssVarName } from './types/sharedTypes';
import { corePathToCssVar, palettePathToCssVar } from './utils/cssVarUtils';

interface IFigmaVarsConfig {
    [pathPrefix: string]: IFigmaVarConfigValue
}
export interface IFigmaVarConfigValue {
    enabled: boolean;
    pathToCssVar: (path: string) => TUuiCssVarName;
    cssVarSupportForUnpublished: TCssVarSupport;
}

export const FIGMA_VARS_CFG: IFigmaVarsConfig = {
    'core/': {
        enabled: true,
        pathToCssVar: corePathToCssVar,
        cssVarSupportForUnpublished: 'notDecided',
    },
    'palette-additional/': {
        enabled: true,
        pathToCssVar: palettePathToCssVar,
        cssVarSupportForUnpublished: 'supportedExceptFigma',
    },
    'palette/': {
        enabled: true,
        pathToCssVar: palettePathToCssVar,
        cssVarSupportForUnpublished: 'supportedExceptFigma',
    },
};
