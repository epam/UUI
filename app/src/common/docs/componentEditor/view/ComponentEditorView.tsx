import * as React from 'react';
import {
    Spinner, FlexRow, LinkButton, MultiSwitch, ScrollBars, Text, FlexSpacer,
} from '@epam/uui';
import {
    IPropSamplesCreationContext,
    DemoContext,
    TDocsGenExportedType,
    PropDocPropsUnknown,
    PropDoc, isDocContextVisibleInPE,
} from '@epam/uui-docs';
import { DemoCode } from './DemoCode';
import { DemoErrorBoundary } from './DemoErrorBoundary';
import css from './ComponentEditorView.module.scss';
import { PeTable } from './peTable/PeTable';
import { buildNormalizedInputValuesMap } from '../propDocUtils';
import { TPreviewRef } from '../../../../preview/types';
import { FullscreenBtn } from './fullscreenBtn/fullscreenBtn';
import { QueryHelpers } from '../../baseDocBlock/utils/queryHelpers';

type TInputData<TProps> = {
    [name in keyof TProps]: {
        value?: TProps[keyof TProps] | undefined;
        exampleId?: string | undefined;
    }
};
interface IHaveContexts {
    contexts: DemoContext<PropDocPropsUnknown>[],
    onChangeSelectedCtx: (name: string) => void,
    selectedCtxName: string,
}
interface IHavePreviewRef {
    previewRef: TPreviewRef | undefined;
}
interface IComponentEditorViewProps<TProps> extends IHaveContexts, IHavePreviewRef {
    componentKey?: string;
    DemoComponent: React.ComponentType<PropDocPropsUnknown>;
    generatedFromType?: TDocsGenExportedType;
    isDocUnsupportedForSkin: boolean;
    isInited: boolean;
    propContext: IPropSamplesCreationContext<TProps>,
    propDoc: PropDoc<TProps, keyof TProps>[]
    tagName: string;
    title: string;
    inputData: TInputData<TProps>;
    onGetInputValues: () => PropDocPropsUnknown
    onRedirectBackToDocs: () => void;
    onResetAllProps: () => void;
    onClearProp: (name: keyof TProps) => void;
    onPropValueChange: (params: { prop: PropDoc<TProps, keyof TProps>, newValue: TProps[keyof TProps] }) => void;
    onPropExampleIdChange: (params: { prop: PropDoc<TProps, keyof TProps>, newExampleId: string | undefined }) => void;
}
export function ComponentEditorView<TProps = PropDocPropsUnknown>(props: IComponentEditorViewProps<TProps>) {
    const demoComponentProps = React.useMemo(() => {
        const map = buildNormalizedInputValuesMap(props.inputData);
        if (props.componentKey) {
            return {
                ...map,
                key: props.componentKey,
            };
        }
        return map;
    }, [props.inputData, props.componentKey]);

    const theme = QueryHelpers.getTheme();

    if (props.isDocUnsupportedForSkin) {
        return <NotSupportedForSkin onRedirectBackToDocs={ props.onRedirectBackToDocs } />;
    }

    if (!props.isInited) {
        return <Spinner cx={ css.uuiThemePromo } />;
    }

    const SelectedDemoContext = props.selectedCtxName
        ? props.contexts.find((ctx) => ctx.name === props.selectedCtxName).context
        : props.contexts[0].context;

    return (
        <div className={ css.root }>
            <PeTable<TProps>
                inputData={ props.inputData }
                onExampleIdChange={ props.onPropExampleIdChange }
                onResetAllProps={ props.onResetAllProps }
                onClearProp={ props.onClearProp }
                onValueChange={ props.onPropValueChange }
                propContext={ props.propContext }
                propDoc={ props.propDoc }
                title={ props.title }
                typeRef={ props.generatedFromType }
            >
                <DemoCode
                    demoComponentProps={ demoComponentProps }
                    tagName={ props.tagName }
                />
            </PeTable>
            <div className={ css.demoContext }>
                <ContextSwitcher
                    contexts={ props.contexts }
                    selectedCtxName={ props.selectedCtxName }
                    onChangeSelectedCtx={ props.onChangeSelectedCtx }
                    previewRef={ props.previewRef }
                />
                <div className={ css.demoContainer }>
                    <ScrollBars>
                        <DemoErrorBoundary>
                            <SelectedDemoContext DemoComponent={ props.DemoComponent } props={ { ...demoComponentProps, theme } } />
                        </DemoErrorBoundary>
                    </ScrollBars>
                </div>
            </div>
        </div>
    );
}

const ContextSwitcher = React.memo((props: IHaveContexts & IHavePreviewRef) => {
    const { contexts, selectedCtxName, onChangeSelectedCtx, previewRef } = props;
    const availableCtxNames = contexts?.map((i) => i.name) || [];
    const visibleCtxNames = availableCtxNames.filter(isDocContextVisibleInPE);
    return (
        <FlexRow
            key="head"
            size="36"
            padding="12"
            columnGap="6"
            background="surface-main"
            borderBottom
            cx={ css.contextSettingRow }
        >
            <FlexSpacer />
            <MultiSwitch
                key="multi-switch"
                items={ visibleCtxNames.map((id) => ({ caption: id, id })) }
                value={ selectedCtxName }
                onValueChange={ onChangeSelectedCtx }
                size="24"
            />
            <FlexSpacer />
            { previewRef && <FullscreenBtn previewRef={ previewRef } /> }
        </FlexRow>
    );
});

function NotSupportedForSkin(props: { onRedirectBackToDocs: () => void }) {
    return (
        <div className={ css.notSupport }>
            <Text fontSize="16" lineHeight="24">
                This component does not support property explorer
            </Text>
            <LinkButton
                size="24"
                cx={ css.backButton }
                caption="Back to Docs"
                onClick={ () => props.onRedirectBackToDocs() }
            />
        </div>
    );
}
