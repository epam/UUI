import { IThemeVar } from '../../types/sharedTypes';
import { IThemeVarUI, TLoadThemeTokensParams, TThemeTokenValueType } from '../../types/types';
import { getFigmaTheme, validateActualTokenValue } from '../../utils/themeVarUtils';
import { getBrowserTokens } from './browserTokens';
import { ThemeId } from '@epam/uui-docs';

export function loadedTokensConverter(
    params: TLoadThemeTokensParams & { rawTokens: IThemeVar[], uuiTheme: ThemeId },
) {
    const { rawTokens, uuiTheme, filter, valueType } = params;
    const browserTokens = getBrowserTokens();
    const figmaTheme = getFigmaTheme(uuiTheme);

    const rawTokensFiltered = rawTokens.filter((tok) => {
        if (filter.path) {
            const filterPathNorm = filter.path.trim();
            if (tok.id.indexOf(filterPathNorm) === -1) {
                return false;
            }
        }
        if (filter.published) {
            switch (filter.published) {
                case 'yes': {
                    if (tok.cssVarSupport !== 'supported') {
                        return false;
                    }
                    break;
                }
                case 'no': {
                    if (tok.cssVarSupport === 'supported') {
                        return false;
                    }
                    break;
                }
            }
        }
        return true;
    });

    return rawTokensFiltered.reduce<IThemeVarUI[]>((acc, token) => {
        const browser = browserTokens.getPropertyValue(token.cssVar);
        const { valueByTheme, ...rest } = token;

        if (figmaTheme && !valueByTheme[figmaTheme]) {
            // Figma theme exists but token is not defined in this theme. Need to SKIP it.
            return acc;
        }

        const valueKey = valueType === TThemeTokenValueType.direct ? 'valueDirect' : 'valueChain';
        const figma = figmaTheme ? valueByTheme[figmaTheme]?.[valueKey] : undefined;
        const tokenUI: IThemeVarUI = {
            ...rest,
            value: {
                figma,
                browser,
                errors: [],
            },
        };

        const errors = validateActualTokenValue(tokenUI);
        acc.push({ ...tokenUI, value: { ...tokenUI.value, errors } });

        return acc;
    }, []);
}
