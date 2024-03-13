import { useQuery } from '../helpers';
import { svc } from '../services';
import { TComponentPreviewParams } from './componentPreview/types';
import { TTheme } from '../common/docs/docsConstants';
import { useEffect } from 'react';
import { setThemeCssClass } from '../helpers/appRootUtils';

export class PreviewQueryHelpers {
    static setParams(params: TComponentPreviewParams): void {
        svc.uuiRouter.redirect({
            pathname: '/preview',
            query: {
                theme: params.theme || TTheme.promo,
                isSkin: params.isSkin ?? true,
                componentId: params.componentId,
                previewId: params.previewId || undefined,
            },
        });
    }
}

export function usePreviewParams(): TComponentPreviewParams {
    const isSkin: boolean = useQuery('isSkin') === 'true';
    const componentId: string = useQuery('componentId') || undefined;
    let previewId: string = useQuery('previewId') || undefined;
    previewId = previewId !== undefined ? String(previewId) : undefined;
    const theme = useQuery('theme') as TTheme;

    useEffect(() => {
        theme && setThemeCssClass(theme);
    }, [theme]);

    return {
        theme,
        isSkin,
        previewId,
        componentId,
    };
}
