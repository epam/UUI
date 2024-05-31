import { useEffect, useState } from 'react';
import { TLoadThemeTokensParams, TLoadThemeTokensResult } from '../../types/types';
import { loadThemeTokens } from './loadThemeTokens';
import { useAppThemeContext } from '../../../../../helpers/appTheme';

export function useThemeTokens(params: TLoadThemeTokensParams): TLoadThemeTokensResult {
    const { valueType, filter } = params;
    const { theme: uuiTheme } = useAppThemeContext();
    const [result, setResult] = useState<TLoadThemeTokensResult>({ loading: true, tokens: [], uuiTheme });

    useEffect(() => {
        let active = true;
        if (uuiTheme) {
            setResult((prev) => ({ ...prev, loading: true }));
            loadThemeTokens({ filter, uuiTheme, valueType }).then((tokens) => {
                if (!active) {
                    return;
                }
                setResult({ loading: false, tokens, uuiTheme });
            }).catch((err) => {
                console.error(err);
                setResult({ tokens: [], loading: false, uuiTheme });
            });
        } else {
            setResult({ tokens: [], loading: false, uuiTheme });
        }
        return () => { active = false; };
    }, [filter, uuiTheme, valueType]);
    return result;
}
