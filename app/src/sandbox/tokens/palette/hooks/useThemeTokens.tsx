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
    uuiThemeRequested: TTheme | undefined,
    expectedValueType: TExpectedValueType
};
type TUseThemeTokensResult = {
    theme: TTheme,
    tokens: IThemeVarUI[],
} | undefined;

export function useThemeTokens(params: TUseThemeTokensParams): TUseThemeTokensResult {
    const { uuiThemeRequested, expectedValueType } = params;
    const [result, setResult] = useState<TUseThemeTokensResult>(undefined);

    useEffect(() => {
        let active = true;
        setResult(undefined);
        if (uuiThemeRequested) {
            const compStyle = getComputedStyle(document.body);
            loadThemeTokens().then((res) => {
                if (!active) {
                    return;
                }
                const tokens = loadedTokensConverter({ res, compStyle, uuiTheme: uuiThemeRequested, expectedValueType });
                setResult({ tokens, theme: uuiThemeRequested });
            });
        }
        return () => { active = false; };
    }, [uuiThemeRequested, expectedValueType]);
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
