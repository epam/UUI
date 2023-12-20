import { useEffect, useState } from 'react';
import { IThemeVar } from '../types/sharedTypes';
import { svc } from '../../../../services';
import { IThemeVarUI, TThemeVarUiErr } from '../types/types';
import { getExpectedValueByTheme } from '../utils/themeVarUtils';
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

export function useThemeTokens(theme: TTheme | undefined): IThemeVarUI[] {
    const [tokens, setTokens] = useState<IThemeVarUI[]>([]);

    useEffect(() => {
        let active = true;
        setTokens([]);
        if (theme) {
            const compStyle = getComputedStyle(document.body);
            loadThemeTokens().then((res) => {
                active && setTokens(res.map((token) => {
                    const value = compStyle.getPropertyValue(token.cssVar);
                    const errors: IThemeVarUI['valueCurrent']['errors'] = [];
                    const expected = getExpectedValueByTheme({ theme, themeVar: token });
                    if (value === '') {
                        errors.push({
                            type: TThemeVarUiErr.VAR_ABSENT,
                            message: `CSS variable ${token.cssVar} is not defined`,
                        });
                    } else if (expected !== undefined && expected.value !== value) {
                        errors.push({
                            type: TThemeVarUiErr.VALUE_MISMATCHED,
                            message: 'Actual value doesn\'t match expected value',
                        });
                    }
                    return {
                        ...token,
                        valueCurrent: { value, theme, errors },
                    };
                }));
            });
        }
        return () => { active = false; };
    }, [theme]);
    return tokens;
}
