import { Page } from '../common';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ComponentPreview } from './componentPreview/componentPreview';
import { PreviewQueryHelpers, usePreviewParams } from './previewQueryHelpers';
import { TComponentPreviewParams } from './componentPreview/types';
import { PlayWrightInterfaceName } from './componentPreview/constants';

import css from './previewPage.module.scss';
import { useLayoutEffectSafeForSsr } from '@epam/uui-core';

export function PreviewPage() {
    const params = usePreviewParams();
    const theme = params.theme;
    const isSkin = params.isSkin || false;
    const componentId = params.componentId;
    const previewId = params.previewId;

    const currentParams: TComponentPreviewParams = useMemo(() => {
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

    const handleNavPreview = useCallback((newParams: TComponentPreviewParams) => {
        PreviewQueryHelpers.setParams({
            componentId: newParams.componentId,
            previewId: newParams.previewId,
            theme: newParams.theme,
            isSkin: newParams.isSkin,
        });
    }, []);

    usePlayWrightInterface(handleNavPreview);

    useLayoutEffectSafeForSsr(() => {
        const style = document.body.style;
        const prev = style.backgroundColor;
        style.backgroundColor = 'var(--uui-surface-main)';
        return () => {
            style.backgroundColor = prev;
        };
    }, []);

    const key = `${theme}_${isSkin}_${componentId}_${previewId}`;
    return (
        <Page renderHeader={ () => null } rootCx={ css.root }>
            <ComponentPreview
                key={ key }
                params={ currentParams }
                onParamsChange={ handleNavPreview }
            />
        </Page>
    );
}

function usePlayWrightInterface(setter: (newParams: TComponentPreviewParams) => void) {
    useEffect(() => {
        (window as any)[PlayWrightInterfaceName] = (_params: string) => {
            setter(JSON.parse(_params) as TComponentPreviewParams);
        };
        return () => {
            delete (window as any)[PlayWrightInterfaceName];
        };
    }, [setter]);
}
