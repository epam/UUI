import * as React from 'react';
import {
    Spinner, FlexRow, LinkButton, MultiSwitch, ScrollBars, Text,
} from '@epam/uui';
import {
    IPropSamplesCreationContext,
    DemoContext,
    TDocsGenExportedType,
    PropDocPropsUnknown,
    PropDoc,
} from '@epam/uui-docs';
import { DemoCode } from './DemoCode';
import { DemoErrorBoundary } from './DemoErrorBoundary';
import css from './ComponentEditorView.module.scss';
import { PeTable } from './peTable/PeTable';
import { buildNormalizedInputValuesMap } from '../propDocUtils';

type TInputData<TProps> = {
    [name in keyof TProps]: {
        value?: TProps[keyof TProps] | undefined;
        exampleId?: string | undefined;
    }
};

interface IComponentEditorViewProps<TProps> {
    contexts: DemoContext<PropDocPropsUnknown>[],
    componentKey?: string;
    DemoComponent: React.ComponentType<PropDocPropsUnknown>;
    generatedFromType?: TDocsGenExportedType;
    isDocUnsupportedForSkin: boolean;
    isInited: boolean;
    propContext: IPropSamplesCreationContext<TProps>,
    propDoc: PropDoc<TProps, keyof TProps>[]
    selectedCtxName: string,
    tagName: string;
    title: string;
    inputData: TInputData<TProps>;
    onGetInputValues: () => PropDocPropsUnknown
    onChangeSelectedCtx: (name: string) => void;
    onRedirectBackToDocs: () => void;
    onResetAllProps: () => void;
    onClearProp: (name: keyof TProps) => void;
    onPropValueChange: (params: { prop: PropDoc<TProps, keyof TProps>, newValue: TProps[keyof TProps] }) => void;
    onPropExampleIdChange: (params: { prop: PropDoc<TProps, keyof TProps>, newExampleId: string | undefined }) => void;
    previewLink: string | undefined;
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
                previewLink={ props.previewLink }
            >
                <DemoCode
                    demoComponentProps={ demoComponentProps }
                    tagName={ props.tagName }
                />
            </PeTable>
            <div className={ css.demoContext }>
                <ContextSwitcher contexts={ props.contexts } selectedCtxName={ props.selectedCtxName } onChangeSelectedCtx={ props.onChangeSelectedCtx } />
                <div className={ css.demoContainer }>
                    <ScrollBars>
                        <DemoErrorBoundary>
                            <SelectedDemoContext DemoComponent={ props.DemoComponent } props={ demoComponentProps } />
                        </DemoErrorBoundary>
                    </ScrollBars>
                </div>
            </div>
        </div>
    );
}

const ContextSwitcher = React.memo(
    ({ contexts, selectedCtxName, onChangeSelectedCtx }: Pick<IComponentEditorViewProps<PropDocPropsUnknown>, 'contexts' | 'selectedCtxName' | 'onChangeSelectedCtx'>) => {
        const availableCtxNames = contexts?.map((i) => i.name) || [];
        return (
            <FlexRow
                key="head"
                size="36"
                padding="12"
                spacing="6"
                background="surface-main"
                borderBottom
                cx={ css.contextSettingRow }
            >
                <MultiSwitch
                    key="multi-switch"
                    items={ availableCtxNames.map((id) => ({ caption: id, id })) }
                    value={ selectedCtxName }
                    onValueChange={ onChangeSelectedCtx }
                    size="24"
                />
            </FlexRow>
        );
    },
);

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
