import { IThemeVar, TFigmaThemeName } from '../themeTokensGen/types/sharedTypes';
import { PATH } from '../themeTokensGen/constants';

export type TVar = { token: IThemeVar, name: string, value: string };
export type TVarGroup = { title: string, items: TVar[] };
export type TMainGroupConfig = { title: string, condition: string[] | undefined, showInnerGroupTitle: boolean, getInnerGroupId: (v: TVar) => string };

export const TOKENS_MIXIN_NAME = 'theme-tokens';

const THEME_DIR = './epam-assets/theme';
const THEME_TOKENS_DIR = './epam-assets/theme/tokens';

export const tokensFile = PATH.FIGMA_VARS_COLLECTION_OUT_TOKENS;
export const coreThemeMixinsConfig: Record<TFigmaThemeName, { themeFile: string, mixinsFile: string }> = {
    [TFigmaThemeName.EPAM]: {
        themeFile: `${THEME_DIR}/theme_electric.scss`,
        mixinsFile: `${THEME_TOKENS_DIR}/_theme_electric.scss`,
    },
    [TFigmaThemeName.PROMO]: {
        themeFile: `${THEME_DIR}/theme_promo.scss`,
        mixinsFile: `${THEME_TOKENS_DIR}/_theme_promo.scss`,
    },
    [TFigmaThemeName.LOVESHIP_LIGHT]: {
        themeFile: `${THEME_DIR}/theme_loveship.scss`,
        mixinsFile: `${THEME_TOKENS_DIR}/_theme_loveship.scss`,
    },
    [TFigmaThemeName.LOVESHIP_DARK]: {
        themeFile: `${THEME_DIR}/theme_loveship_dark.scss`,
        mixinsFile: `${THEME_TOKENS_DIR}/_theme_loveship_dark.scss`,
    },
};

const getInnerGroupIdGeneric = (v: TVar) => {
    const idSplit = v.token.id.split('/');
    return idSplit.length >= 3 ? idSplit.slice(0, 2).join('/') : '';
};

export const GROUPS_CONFIG: Record<string, TMainGroupConfig> = {
    palette: {
        title: 'Palette',
        condition: ['palette/', 'palette-additional/'],
        showInnerGroupTitle: true,
        getInnerGroupId: getInnerGroupIdGeneric,
    },
    core: {
        title: 'Core',
        condition: ['core/'],
        showInnerGroupTitle: true,
        getInnerGroupId: (v) => {
            if (v.token.id.indexOf('core/semantic/') === 0) {
                const suffix = v.token.id.split('/')[2].split('-')[0];
                return `core/semantic/${suffix}-`;
            }
            return getInnerGroupIdGeneric(v);
        },
    },
    others: {
        title: 'Others',
        condition: undefined, // fallback
        showInnerGroupTitle: true,
        getInnerGroupId: getInnerGroupIdGeneric,
    },
};
