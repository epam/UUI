import { useEffect, useMemo } from 'react';
import { TPreviewContentParams } from '../types';
import { useQuery } from '../../helpers';
import { parsePreviewIdFromString } from '../utils/previewLinkUtils';
import { useAppThemeContext } from '../../helpers/appTheme';
import { ThemeId, BuiltInTheme } from '@epam/uui-docs';

export function usePreviewParams(): TPreviewContentParams {
    const isSkin: boolean = useQuery('isSkin') === 'true';
    const componentId: string = useQuery('componentId') || undefined;
    let previewId: string = useQuery('previewId') || undefined;
    previewId = previewId !== undefined ? String(previewId) : undefined;
    const themeFromQuery = useQuery('theme') as ThemeId || BuiltInTheme.promo;

    const { theme, toggleTheme } = useAppThemeContext();

    useEffect(() => {
        if (themeFromQuery !== theme) {
            toggleTheme(themeFromQuery);
        }
    }, [themeFromQuery, theme, toggleTheme]);

    const previewIdNorm = useMemo(() => parsePreviewIdFromString(previewId), [previewId]);

    return {
        theme,
        isSkin,
        previewId: previewIdNorm,
        componentId,
    };
}
