import { useQuery } from '../helpers';
import { svc } from '../services';
import { TComponentPreviewParams } from './componentPreview/types';
import { TTheme } from '../common/docs/docsConstants';
import { useEffect, useMemo } from 'react';
import { setThemeCssClass } from '../helpers/appRootUtils';
import { parsePreviewIdFromString, formatPreviewIdToString } from './componentPreview/utils/previewLinkUtils';

export class PreviewQueryHelpers {
    static setParams(params: TComponentPreviewParams): void {
        svc.uuiRouter.redirect({
            pathname: '/preview',
            query: {
                theme: params.theme || TTheme.promo,
                isSkin: params.isSkin ?? true,
                componentId: params.componentId,
                previewId: formatPreviewIdToString(params.previewId),
            },
        });
    }
}

export function usePreviewParams(): TComponentPreviewParams {
    const isSkin: boolean = useQuery('isSkin') === 'true';
    const componentId: string = useQuery('componentId') || undefined;
    let previewId: string = useQuery('previewId') || undefined;
    previewId = previewId !== undefined ? String(previewId) : undefined;
    const theme = useQuery('theme') as TTheme || TTheme.promo;

    useEffect(() => {
        theme && setThemeCssClass(theme);
    }, [theme]);

    const previewIdNorm = useMemo(() => {
        return parsePreviewIdFromString(previewId);
    }, [previewId]);

    return {
        theme,
        isSkin,
        previewId: previewIdNorm,
        componentId,
    };
}
