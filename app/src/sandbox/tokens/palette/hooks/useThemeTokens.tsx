import { useEffect, useState } from 'react';
import { IThemeVar } from '../types/sharedTypes';
import { svc } from '../../../../services';
import { IThemeVarUI, TExpectedValueType } from '../types/types';
import { getFigmaTheme, validateActualTokenValue } from '../utils/themeVarUtils';
import { TTheme } from '../../../../common/docs/docsConstants';

const cache: { content: IThemeVar[] | undefined } = { content: undefined };
async function loadThemeTokens(): Promise<IThemeVar[]> {
    if (!svc.api) {
        throw new Error('svc.api not available');
    }
    if (!cache.content) {
        const { content } = await svc.api.getThemeTokens();
        cache.content = content;
    }

    return cache.content;
}

type TUseThemeTokensParams = {
    uuiTheme: TTheme | undefined,
    expectedValueType: TExpectedValueType,
    filter: { path: string },
};
export type TUseThemeTokensResult = {
    tokens: IThemeVarUI[],
    loading: boolean,
};

export function useThemeTokens(params: TUseThemeTokensParams): TUseThemeTokensResult {
    const { uuiTheme, expectedValueType, filter } = params;
    const [result, setResult] = useState<TUseThemeTokensResult>({ loading: true, tokens: [] });

    useEffect(() => {
        let active = true;
        if (uuiTheme) {
            setResult((prev) => ({ ...prev, loading: true }));
            const compStyle = getComputedStyle(document.body);
            loadThemeTokens().then((res) => {
                if (!active) {
                    return;
                }
                const resFiltered = res.filter(({ id }) => {
                    if (typeof filter.path === 'string') {
                        const f = filter.path.trim();
                        return id.indexOf(f) !== -1;
                    }
                    return true;
                });
                const tokens = loadedTokensConverter({ res: resFiltered, compStyle, uuiTheme, expectedValueType });
                setResult({ loading: false, tokens });
            }).catch((err) => {
                console.error(err);
                setResult({ tokens: [], loading: false });
            });
        } else {
            setResult({ tokens: [], loading: false });
        }
        return () => { active = false; };
    }, [uuiTheme, expectedValueType, filter.path]);
    return result;
}

function loadedTokensConverter(
    params: {
        res: IThemeVar[],
        expectedValueType:TExpectedValueType,
        uuiTheme: TTheme,
        compStyle: { getPropertyValue: (name: string) => string }
    },
) {
    const { res, expectedValueType, uuiTheme, compStyle } = params;
    const figmaTheme = getFigmaTheme(uuiTheme);
    return res.reduce<IThemeVarUI[]>((acc, token) => {
        const actual = token.cssVar === undefined ? '' : compStyle.getPropertyValue(token.cssVar);
        const { valueByTheme, ...rest } = token;

        if (figmaTheme && !valueByTheme[figmaTheme]) {
            // Figma theme exists but token is not defined in this theme. Need to SKIP it.
            return acc;
        }

        const valueKey = expectedValueType === TExpectedValueType.direct ? 'valueDirect' : 'valueChain';
        const expected = figmaTheme ? valueByTheme[figmaTheme]?.[valueKey] : undefined;
        const tokenUI: IThemeVarUI = {
            ...rest,
            value: {
                expected,
                actual,
                errors: [],
            },
        };

        const errors = validateActualTokenValue(tokenUI);
        acc.push({ ...tokenUI, value: { ...tokenUI.value, errors } });

        return acc;
    }, []);
}
