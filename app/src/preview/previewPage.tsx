import React, { useMemo } from 'react';
import { PreviewContent } from './previewContent/previewContent';
import { TPreviewContentParams } from './types';
import { usePreviewPageBg } from './hooks/usePreviewPageBg';
import { usePreviewParams } from './hooks/usePreviewParams';

export function PreviewPage() {
    const params = usePreviewParams();
    const theme = params.theme;
    const isSkin = params.isSkin || false;
    const componentId = params.componentId;
    const previewId = params.previewId;

    const currentParams: TPreviewContentParams = useMemo(() => {
        return {
            theme,
            isSkin,
            componentId,
            previewId,
        };
    }, [
        theme,
        isSkin,
        componentId,
        previewId,
    ]);

    usePreviewPageBg();

    const key = `${theme}_${isSkin}_${componentId}_${previewId}`;
    return <PreviewContent key={ key } params={ currentParams } />;
}
