import React, { useCallback, useMemo } from 'react';
import { useDocBuilderGen } from '@epam/uui-docs';
import { getSkin, useDocBuilderGenCtx } from '../../common/docs/componentEditor/utils';
import { RenderCase } from './renderCase/renderCase';
import { PreviewLayout } from './previewLayout';
import { TPreviewContentParams } from '../types';
import { ERRORS } from '../constants';
import { buildRenderCaseArr, getConfigByComponentId } from './previewContentUtils';
import { formatPreviewIdToString } from '../utils/previewLinkUtils';
import { useUuiContext } from '@epam/uui-core';
import { MatrixInfo } from './matrixSummary/matrixSummary';

export function PreviewContent(props: { params: TPreviewContentParams }) {
    const { uuiModals } = useUuiContext();
    const { theme, isSkin, previewId, componentId } = props.params;
    const compConfig = useMemo(() => getConfigByComponentId(componentId), [componentId]);
    const docBuilderGenCtx = useDocBuilderGenCtx();
    const skin = getSkin(theme, isSkin);
    const { isLoaded, docs } = useDocBuilderGen({ config: compConfig, skin, docBuilderGenCtx });
    const allRenderCases = useMemo(() => buildRenderCaseArr(docs, previewId), [docs, previewId]);
    const totalNumberOfCases = allRenderCases?.props.length || 0;

    const error = useMemo(() => {
        if (isLoaded) {
            if (!componentId) {
                return ERRORS.COMPONENT_IS_MISSING;
            }
            if (!compConfig) {
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
    }, [allRenderCases, compConfig, componentId, isLoaded, previewId, totalNumberOfCases]);

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

    const handleOpenConfig = () => {
        if (allRenderCases?.matrix.length > 0) {
            uuiModals
                .show<string>((props) => <MatrixInfo { ...props } arr={ allRenderCases.matrix } />)
                .catch(() => {});
        }
    };

    return (
        <PreviewLayout
            onOpenConfig={ handleOpenConfig }
            error={ error }
            totalNumberOfCells={ totalNumberOfCases }
            cellSize={ allRenderCases?.cellSize }
            isLoaded={ isLoaded }
            renderCell={ renderCell }
        />
    );
}
