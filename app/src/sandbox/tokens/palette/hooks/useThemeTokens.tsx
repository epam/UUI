import { useEffect, useState } from 'react';
import { IThemeVar } from '../types/sharedTypes';
import { svc } from '../../../../services';

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

export function useThemeTokens(): IThemeVar[] {
    const [tokens, setTokens] = useState<IThemeVar[]>([]);
    useEffect(() => {
        let active = true;
        setTokens([]);
        loadThemeTokens().then((res) => {
            active && setTokens(res);
        });
        return () => { active = false; };
    }, []);
    return tokens;
}
