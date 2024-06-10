import React, { useCallback, useMemo } from 'react';
import { useDocBuilderGen } from '@epam/uui-docs';
import { getSkin, useDocBuilderGenCtx, usePropEditorTypeOverride } from '../../common/docs/componentEditor/utils';
import { RenderCase } from './renderCase/renderCase';
import { PreviewLayout } from './previewLayout';
import { TPreviewContentParams } from '../types';
import { ERRORS } from '../constants';
import { buildRenderCaseArr, getConfigByComponentId } from './previewContentUtils';
import { formatPreviewIdToString } from '../utils/previewLinkUtils';

export function PreviewContent(props: { params: TPreviewContentParams }) {
    const { theme, isSkin, previewId, componentId } = props.params;
    const config = useMemo(() => getConfigByComponentId(componentId), [componentId]);

    const skin = getSkin(theme, isSkin);
    const docBuilderGenCtx = useDocBuilderGenCtx(
        usePropEditorTypeOverride(theme, config?.bySkin[skin]?.type),
    );
    const { isLoaded, docs } = useDocBuilderGen({ config, skin, docBuilderGenCtx });
    const allRenderCases = useMemo(() => buildRenderCaseArr(docs, previewId), [docs, previewId]);
    const totalNumberOfCases = allRenderCases?.props.length || 0;

    const error = useMemo(() => {
        if (isLoaded) {
            if (!componentId) {
                return ERRORS.COMPONENT_IS_MISSING;
            }
            if (!config) {
                return ERRORS.UNKNOWN_COMPONENT_OR_NO_PREVIEW({ componentId });
            }
            const hasAnyPreview = totalNumberOfCases > 0;
            if (!hasAnyPreview) {
                return ERRORS.PREVIEW_IS_UNSUPPORTED({ componentId, previewId: previewId.toString() });
            }
            const isContextSupported = hasAnyPreview && !!allRenderCases.context;
            if (!isContextSupported) {
                return ERRORS.CONTEXT_IS_UNSUPPORTED();
            }
        }
    }, [allRenderCases, config, componentId, isLoaded, previewId, totalNumberOfCases]);

    const previewIdAsString = useMemo(() => formatPreviewIdToString(previewId), [previewId]);
    const renderCell = useCallback((params: { index: number }) => {
        if (allRenderCases.context) {
            const pp = allRenderCases.props[params.index];
            return (
                <RenderCase
                    key={ previewIdAsString }
                    docs={ docs }
                    renderCaseProps={ pp }
                    context={ allRenderCases.context }
                />
            );
        }
        return null;
    }, [allRenderCases, docs, previewIdAsString]);

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
