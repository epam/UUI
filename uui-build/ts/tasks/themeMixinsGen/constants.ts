import { TFigmaThemeName } from '../themeTokensGen/types/sharedTypes';
import { PATH } from '../themeTokensGen/constants';

const THEME_DIR = './epam-assets/theme';

export const tokensFile = PATH.FIGMA_VARS_COLLECTION_OUT_TOKENS;
export const coreThemeMixinsConfig: Record<TFigmaThemeName, { themeFile: string, mixinsFile: string }> = {
    [TFigmaThemeName.EPAM]: {
        themeFile: `${THEME_DIR}/theme_electric.scss`,
        mixinsFile: `${THEME_DIR}/theme_electric_mixins.scss`,
    },
    [TFigmaThemeName.PROMO]: {
        themeFile: `${THEME_DIR}/theme_promo.scss`,
        mixinsFile: `${THEME_DIR}/theme_promo_mixins.scss`,
    },
    [TFigmaThemeName.LOVESHIP_LIGHT]: {
        themeFile: `${THEME_DIR}/theme_loveship.scss`,
        mixinsFile: `${THEME_DIR}/theme_loveship_mixins.scss`,
    },
    [TFigmaThemeName.LOVESHIP_DARK]: {
        themeFile: `${THEME_DIR}/theme_loveship_dark.scss`,
        mixinsFile: `${THEME_DIR}/theme_loveship_dark_mixins.scss`,
    },
};

export const GROUPS_CONFIG: Record<string, { title: string, condition: string[] | undefined }> = {
    palette: {
        title: 'Palette variables',
        condition: ['palette/', 'palette-additional/'],
    },
    core: {
        title: 'Core variables',
        condition: ['core/'],
    },
    others: {
        title: 'Other variables',
        condition: undefined, // fallback
    },
};
export const MIXIN_NAME = 'theme_core-mixin';
