import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { DocBuilder, useDocBuilderGen } from '@epam/uui-docs';
import { getSkin, useDocBuilderGenCtx } from '../../common/docs/componentEditor/utils';
import { RenderCaseView } from './view/renderCaseView';
import { PreviewLayout } from './view/previewLayout';
import { TComponentPreviewParams } from './types';
import { getConfigByComponentId } from './utils/previewUtils';

const ERR = {
    CONTEXT_IS_UNSUPPORTED: (params: { context: string }) => `Context "${params.context}" is not supported`,
    PREVIEW_IS_UNSUPPORTED: (params: { componentId: string, previewId: string }) => `Component "${params.componentId}" does not have preview "${params.previewId}"`,
    UNKNOWN_COMPONENT_OR_NO_PREVIEW: (params: { componentId: string }) => {
        return [
            `Component "${params.componentId}" is unknown.`,
            'Please make sure such component exists in "app/src/documents/structureComponents.ts" and at least one preview is defined for selected theme/skin.',
        ].join('\n');
    },
    PREVIEW_IS_MISSING: 'Preview ID is missing',
    COMPONENT_IS_MISSING: 'Component ID is missing',
};

export function ComponentPreview(props: {
    params: TComponentPreviewParams;
    onParamsChange: (newParams: TComponentPreviewParams) => void;
}) {
    const {
        theme,
        isSkin,
        previewId,
        componentId,
    } = props.params;
    const skin = getSkin(theme, isSkin);

    const compConfig = useMemo(() => {
        return getConfigByComponentId(componentId);
    }, [componentId]);

    const docBuilderGenCtx = useDocBuilderGenCtx();
    const { isLoaded, docs } = useDocBuilderGen({ config: compConfig, skin, docBuilderGenCtx });

    const allRenderCases = useMemo(() => {
        if (docs) {
            if (previewId) {
                if (typeof previewId === 'object') {
                    const rc = DocBuilder.convertPreviewPropsItemToRenderCases(previewId, docs);
                    if (rc && !rc.props.length) {
                        return { ...rc, props: [{}] };
                    }
                    return rc;
                } else {
                    const arr = docs.getPreviewRenderCaseGroups();
                    return arr?.find(({ id }) => {
                        return id === previewId;
                    });
                }
            }
        }
    }, [docs, previewId]);
    const context = useMemo(() => {
        if (allRenderCases && docs) {
            return docs.contexts.find(({ name }) => {
                return allRenderCases.context === name;
            });
        }
    }, [docs, allRenderCases]);

    const totalNumberOfCases = allRenderCases?.props.length || 0;
    const hasAnyPreview = totalNumberOfCases > 0;
    const isContextSupported = hasAnyPreview && !!context;

    const error = useMemo(() => {
        if (isLoaded) {
            if (!componentId) {
                return ERR.COMPONENT_IS_MISSING;
            }
            if (!compConfig) {
                return ERR.UNKNOWN_COMPONENT_OR_NO_PREVIEW({ componentId });
            }

            if (!hasAnyPreview) {
                return ERR.PREVIEW_IS_UNSUPPORTED({ componentId, previewId: previewId.toString() });
            }
            if (!isContextSupported) {
                return ERR.CONTEXT_IS_UNSUPPORTED({ context: allRenderCases.context });
            }
        }
    }, [allRenderCases?.context, compConfig, componentId, hasAnyPreview, isContextSupported, isLoaded, previewId]);

    const previewIdAsString = useMemo(() => {
        return typeof previewId !== 'string' ? JSON.stringify(previewId) : previewId;
    }, [previewId]);

    const renderCell = useCallback((params: { index: number }) => {
        const pp = allRenderCases?.props[params.index];
        return (
            <RenderCaseView
                key={ previewIdAsString }
                DemoComponent={ docs.component }
                docs={ docs }
                renderCaseProps={ pp }
                context={ context }
            />
        );
    }, [allRenderCases?.props, context, docs, previewIdAsString]);

    return (
        <PreviewLayout
            error={ error }
            totalNumberOfCells={ totalNumberOfCases }
            cellSize={ allRenderCases?.cellSize }
            isLoaded={ isLoaded }
            renderCell={ renderCell }
        />
    );
}
