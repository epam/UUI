import * as React from 'react';
import { useMemo } from 'react';
import { DocBuilder, PropDocPropsUnknown, useDocBuilderGen } from '@epam/uui-docs';
import { getSkin } from '../../common/docs/componentEditor/utils';
import { loadDocsGenType } from '../../common/apiReference/dataHooks';
import { UseCaseView } from './view/useCaseView';
import { PreviewLayout } from './view/previewLayout';
import { PreviewToolbar } from './view/previewToolbar';
import { TComponentPreviewParams } from './types';
import { getConfigByComponentId, getDefaultPreviewId } from './utils/previewUtils';
import { ErrorAlert, FlexCell, Text } from '@epam/uui';
import { PreviewQueryHelpers, usePreviewParams } from '../previewQueryHelpers';

const ERR = {
    CONTEXT_IS_UNSUPPORTED: (params: { context: string }) => `Context "${params.context}" is not supported`,
    PREVIEW_IS_UNSUPPORTED: (params: { componentId: string }) => `Component "${params.componentId}" does not have any previews`,
    PREVIEW_IS_NOT_SELECTED: (params: { componentId: string }) => `Preview ID is not selected for the component "${params.componentId}"`,
    PREVIEW_IS_UNDEFINED: 'Preview ID is not defined',
    COMPONENT_IS_NOT_SELECTED: 'Component ID is not selected',
};

export default function ComponentPreviewWrapper() {
    const params = usePreviewParams();
    const theme = params.theme;
    const isSkin = params.isSkin || false;
    const componentId = params.componentId;
    const previewId = params.previewId || getDefaultPreviewId(componentId);

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

    const key = `${theme}_${isSkin}_${componentId}_${previewId}`;
    return (
        <ComponentPreview
            key={ key }
            params={ currentParams }
            onParamsChange={ (newParams) => {
                PreviewQueryHelpers.setParams({
                    componentId: newParams.componentId,
                    previewId: newParams.previewId,
                    theme: newParams.theme,
                    isSkin: newParams.isSkin,
                });
            } }
        />
    );
}

function ComponentPreview(props: {
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

    const config = useMemo(() => {
        return getConfigByComponentId(componentId);
    }, [componentId]);

    const { isLoaded, docs } = useDocBuilderGen({ config, skin, loadDocsGenType });
    const fields = [
        {
            label: 'Theme',
            value: theme,
        },
        {
            label: 'Is Skin',
            value: String(isSkin),
        },
        {
            label: 'Component ID',
            value: componentId || '',
            hasError: !componentId,
            tooltip: !componentId ? ERR.COMPONENT_IS_NOT_SELECTED : undefined,
        },
        {
            label: 'Preview ID',
            value: previewId || '',
            hasError: !previewId,
            tooltip: !previewId ? ERR.PREVIEW_IS_NOT_SELECTED({ componentId }) : undefined,
        },
    ];

    return (
        <PreviewLayout
            isLoaded={ isLoaded }
            renderToolbar={
                () => (
                    <PreviewToolbar
                        value={ props.params }
                        onValueChange={ props.onParamsChange }
                        fields={ fields }
                    />
                )
            }
            renderUseCases={ () => <UseCases docs={ docs } previewId={ previewId } componentId={ componentId } /> }
        />
    );
}

export function UseCases(
    props: {
        docs: DocBuilder<PropDocPropsUnknown> | undefined;
        previewId: string | undefined;
        componentId: string | undefined;
    },
) {
    const { docs, previewId, componentId } = props;

    const useCases = useMemo(() => {
        if (docs && previewId) {
            const arr = docs.getPreviewUseCaseGroups();
            return arr?.find(({ id }) => {
                return id === previewId;
            });
        }
    }, [docs, previewId]);

    const context = useMemo(() => {
        if (useCases && docs) {
            return docs.contexts.find(({ name }) => {
                return useCases.context === name;
            });
        }
    }, [docs, useCases]);

    const hasAnyPreview = useCases?.props.length > 0;
    const isContextSupported = hasAnyPreview && !!context;

    if (hasAnyPreview) {
        if (isContextSupported) {
            const totalNum = useCases.props.length;
            return (
                <React.Fragment>
                    {
                        useCases.props.map((pp, i) => (
                            <UseCaseView
                                key={ String(i) }
                                id={ `${i + 1} / ${totalNum}` }
                                DemoComponent={ docs.component }
                                docs={ docs }
                                currentUseCaseProps={ pp }
                                context={ context }
                            />
                        ))
                    }
                </React.Fragment>
            );
        }
        return renderErr(ERR.CONTEXT_IS_UNSUPPORTED({ context: useCases.context }));
    }
    return renderErr(ERR.PREVIEW_IS_UNSUPPORTED({ componentId }));
}

function renderErr(msg: string) {
    return (
        <FlexCell style={ { marginTop: '-25px' } }>
            <ErrorAlert>
                <Text size="30">{ msg }</Text>
            </ErrorAlert>
        </FlexCell>
    );
}
