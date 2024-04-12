import { useEffect, useMemo } from 'react';
import { TPreviewContentParams } from '../types';
import { useQuery } from '../../helpers';
import { TTheme } from '../../common/docs/docsConstants';
import { setThemeCssClass } from '../../helpers/appRootUtils';
import { parsePreviewIdFromString } from '../utils/previewLinkUtils';

export function usePreviewParams(): TPreviewContentParams {
    const isSkin: boolean = useQuery('isSkin') === 'true';
    const componentId: string = useQuery('componentId') || undefined;
    let previewId: string = useQuery('previewId') || undefined;
    previewId = previewId !== undefined ? String(previewId) : undefined;
    const theme = useQuery('theme') as TTheme || TTheme.promo;

    useEffect(() => {
        theme && setThemeCssClass(theme);
    }, [theme]);

    const previewIdNorm = useMemo(() => parsePreviewIdFromString(previewId), [previewId]);

    return {
        theme,
        isSkin,
        previewId: previewIdNorm,
        componentId,
    };
}
