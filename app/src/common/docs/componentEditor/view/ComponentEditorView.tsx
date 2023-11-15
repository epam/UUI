import * as React from 'react';
import {
    FlexCell,
    FlexSpacer,
    IconButton,
    Spinner,
    FlexRow, LinkButton, MultiSwitch, ScrollBars, Text, Tooltip,
} from '@epam/uui';
import { cx } from '@epam/uui-core';
import { PropDoc, IPropSamplesCreationContext, DemoContext } from '@epam/uui-docs';
import { TDocsGenExportedType } from '../../../apiReference/types';
import { PropEditorRow } from './PropEditorRow';
//
import { ReactComponent as ResetIcon } from '../../../../icons/reset-icon.svg';
import css from './ComponentEditorView.module.scss';
import { DemoCode } from './DemoCode';
import { DemoErrorBoundary } from './DemoErrorBoundary';
import { getInputValuesFromInputData } from '../utils';
import { TEMP_THEME_PROMO_SELECTOR } from '../../constants';

interface IComponentEditorViewProps {
    contexts: DemoContext[],
    currentTheme: string;
    DemoComponent: React.ComponentType<any>;
    generatedFromType?: TDocsGenExportedType;
    isDocUnsupportedForSkin: boolean;
    isInited: boolean;
    propContext: IPropSamplesCreationContext,
    propDoc: PropDoc<any, string | number | symbol>[]
    selectedCtxName: string,
    showCode: boolean;
    tagName: string;
    title: string;
    inputData: {
        [name: string]: {
            value?: any;
            exampleId?: string;
        }
    };
    onGetInputValues: () => { [p: string]: any }
    onChangeSelectedCtx: (name: string) => void;
    onPropExampleIdChange: (params: { prop: PropDoc<any, any>, newPropExampleId: string }) => void;
    onPropValueChange: (params: { prop: PropDoc<any, any>, newPropValue: any }) => void;
    onRedirectBackToDocs: () => void;
    onReset: () => void;
    onResetProp: (name: string) => void;
    onToggleShowCode: () => void;
}
export function ComponentEditorView(props: IComponentEditorViewProps) {
    const inputValues = React.useMemo(() => getInputValuesFromInputData(props.inputData), [props.inputData]);

    if (props.isDocUnsupportedForSkin) {
        return <NotSupportedForSkin onRedirectBackToDocs={ props.onRedirectBackToDocs } />;
    }

    if (!props.isInited) {
        return <Spinner cx={ TEMP_THEME_PROMO_SELECTOR } />;
    }

    const SelectedDemoContext = props.selectedCtxName
        ? props.contexts.find((ctx) => ctx.name === props.selectedCtxName).context
        : props.contexts[0].context;

    const rows = props.propDoc.map((p, index: number) => {
        const key = `${p.name}_${index}`;
        const propValue = props.inputData[p.name].value;
        const propExampleId = props.inputData[p.name].exampleId;
        return (
            <PropEditorRow
                key={ key }
                prop={ p }
                propValue = { propValue }
                propExampleId = { propExampleId }
                onResetProp = { props.onResetProp }
                propContext={ props.propContext }
                onPropValueChange={ props.onPropValueChange }
                onPropExampleIdChange={ props.onPropExampleIdChange }
            />
        );
    });

    return (
        <div className={ css.root }>
            <div className={ cx(css.container, TEMP_THEME_PROMO_SELECTOR) }>
                <Toolbar title={ props.title } onReset={ props.onReset } generatedFromType={ props.generatedFromType } />
                <Header />
                <div className={ css.rowProps }>
                    <ScrollBars cx={ css.lastBorder }>
                        { rows }
                    </ScrollBars>
                </div>
                <DemoCode
                    demoComponentProps={ inputValues }
                    onToggleShowCode={ props.onToggleShowCode }
                    tagName={ props.tagName }
                    showCode={ props.showCode }
                />
            </div>
            <div className={ css.demoContext }>
                <ContextSwitcher contexts={ props.contexts } selectedCtxName={ props.selectedCtxName } onChangeSelectedCtx={ props.onChangeSelectedCtx } />
                <div className={ cx(css.demoContainer, css[props.currentTheme]) }>
                    <ScrollBars>
                        <DemoErrorBoundary>
                            <SelectedDemoContext DemoComponent={ props.DemoComponent } props={ inputValues } />
                        </DemoErrorBoundary>
                    </ScrollBars>
                </div>
            </div>
        </div>
    );
}

const ContextSwitcher = React.memo(
    ({ contexts, selectedCtxName, onChangeSelectedCtx }: Pick<IComponentEditorViewProps, 'contexts' | 'selectedCtxName' | 'onChangeSelectedCtx'>) => {
        const availableCtxNames = contexts?.map((i) => i.name) || [];
        return (
            <FlexRow
                key="head"
                size="36"
                padding="12"
                spacing="6"
                background="surface"
                borderBottom
                cx={ cx(css.contextSettingRow, TEMP_THEME_PROMO_SELECTOR) }
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
const Toolbar = React.memo(
    ({ generatedFromType, title, onReset }: Pick<IComponentEditorViewProps, 'generatedFromType' | 'title' | 'onReset'>) => {
        return (
            <FlexRow key="head" size="36" padding="12" borderBottom spacing="6" cx={ css.boxSizing }>
                <Tooltip content={ generatedFromType }>
                    <Text fontSize="16" lineHeight="24" cx={ css.vPadding } font="semibold">
                        {title}
                    </Text>
                </Tooltip>
                <FlexSpacer />
                <Tooltip placement="auto" content="Reset setting">
                    <IconButton
                        icon={ ResetIcon }
                        onClick={ onReset }
                        color="info"
                    />
                </Tooltip>
            </FlexRow>
        );
    },
);
const Header = React.memo(function HeaderComponent() {
    return (
        <FlexRow key="table-head" size="36" padding="12" spacing="6" borderBottom cx={ css.boxSizing } background="surface">
            <FlexCell key="name" width={ 130 }>
                <Text size="24" font="semibold">
                    NAME
                </Text>
            </FlexCell>
            <FlexCell key="default" width={ 100 }>
                <Text size="24" font="semibold">
                    DEFAULT
                </Text>
            </FlexCell>
            <FlexCell key="examples" grow={ 1 }>
                <Text size="24" font="semibold">
                    PRESET
                </Text>
            </FlexCell>
        </FlexRow>
    );
});

function NotSupportedForSkin(props: { onRedirectBackToDocs: () => void }) {
    return (
        <div className={ cx(css.notSupport, TEMP_THEME_PROMO_SELECTOR) }>
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
