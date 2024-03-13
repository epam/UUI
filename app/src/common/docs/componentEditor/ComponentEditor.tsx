import * as React from 'react';
import {
    IComponentDocs,
    TDocConfig,
    TSkin,
    TDocsGenExportedType,
    useDocBuilderGen,
    PropDocPropsUnknown,
    PropDocUnknown,
} from '@epam/uui-docs';
import { ComponentEditorView } from './view/ComponentEditorView';
import { getSkin } from './utils';
import { PropSamplesCreationContext } from './view/PropSamplesCreationContext';
import { TTheme } from '../docsConstants';
import { loadDocsGenType } from '../../apiReference/dataHooks';
import {
    buildExamplesAndFindById,
    buildExamplesAndFindByValue,
    buildPropInputDataAll,
    buildNormalizedInputValuesMap,
    rebuildInputDataExamples,
    updatePropInputData,
} from './propDocUtils';
import { useQuery } from '../../../helpers';

export function ComponentEditorWrapper(props: {
    theme: TTheme,
    title: string;
    isSkin: boolean;
    config: TDocConfig;
    onRedirectBackToDocs: () => void;
}) {
    const {
        theme,
        title,
        isSkin,
        config,
        onRedirectBackToDocs,
    } = props;
    const componentId = useQuery('id');
    const skin = getSkin(theme, isSkin);
    const { isLoaded, docs, generatedFromType } = useDocBuilderGen({ config, skin, loadDocsGenType });
    const supportsPreview = !!docs?.docPreview;
    const previewLink = supportsPreview ? `/preview?theme=${theme}&isSkin=${isSkin}&componentId=${componentId}` : undefined;
    React.useEffect(() => {
        if (!config) {
            onRedirectBackToDocs();
        }
    }, [config, onRedirectBackToDocs]);

    return (
        <ComponentEditor
            isLoaded={ isLoaded }
            onRedirectBackToDocs={ onRedirectBackToDocs }
            docs={ docs }
            title={ title }
            skin={ skin }
            generatedFromType={ generatedFromType }
            previewLink={ previewLink }
        />
    );
}

interface ComponentEditorProps {
    docs?: IComponentDocs<PropDocPropsUnknown>;
    skin: TSkin;
    title: string;
    previewLink: string | undefined;
    isLoaded: boolean;
    onRedirectBackToDocs: () => void;
    generatedFromType?: TDocsGenExportedType;
}

interface ComponentEditorState {
    isInited: boolean;
    selectedContext?: string;
    inputData: TPropInputDataAll;
    componentKey?: string;
}
type TPropInputDataAll = { [name in keyof PropDocPropsUnknown]?: { value?: unknown | undefined, exampleId?: string | undefined } };

const getInitialState = (): ComponentEditorState => ({
    inputData: {},
    componentKey: undefined,
    isInited: false,
});

export class ComponentEditor extends React.Component<ComponentEditorProps, ComponentEditorState> {
    private propExamplesCtx = new PropSamplesCreationContext({
        forceUpdate: () => this.forceUpdate(),
        getInputValues: () => this.getInputValues(),
        handleChangeValueOfPropertyValue: (newValue) => this.handleChangeValueOfPropertyValue(newValue),
    });

    private getCtx = () => {
        return this.propExamplesCtx;
    };

    state = getInitialState();

    componentDidMount() {
        this.initProps();
    }

    componentDidUpdate(prevProps:Readonly<ComponentEditorProps>) {
        const docsChanged = prevProps.docs !== this.props.docs;
        if (docsChanged) {
            this.initProps();
        }
        const skinChanged = prevProps.skin !== this.props.skin;
        if (skinChanged) {
            this.setState({ selectedContext: undefined });
        }
    }

    handleResetDocs = (onAfterReset?: () => void) => {
        this.setState(() => getInitialState(), onAfterReset);
    };

    initProps() {
        this.handleResetDocs(() => {
            const { docs, isLoaded } = this.props;
            if (docs && isLoaded) {
                const inputData = buildPropInputDataAll({ docs, ctx: this.getCtx() });
                this.setState({ inputData, isInited: true });
            }
        });
    }

    getInputValues = () => {
        return buildNormalizedInputValuesMap(this.state.inputData);
    };

    handleChangeValueOfPropertyValue = (newValue: unknown) => {
        const propertyName = 'value';
        const prop = this.getPropByName(propertyName);
        this.handlePropValueChange({ prop, newValue: newValue });
    };

    getPropByName = (propName: string) => {
        return this.props.docs.props.find((p) => p.name === propName);
    };

    handleClearProp = (propertyName: string) => {
        const prop = this.getPropByName(propertyName);
        this.setPropExampleAndValue({
            prop,
            newValue: undefined,
            newExampleId: undefined,
        });
    };

    handleResetAllPropsToDefault = () => {
        const { docs } = this.props;
        const inputData = buildPropInputDataAll({ docs, ctx: this.getCtx() });
        this.setState({ inputData });
    };

    handlePropValueChange = (params: { prop: PropDocUnknown, newValue: unknown }) => {
        const { prop, newValue } = params;
        const newExampleId = buildExamplesAndFindByValue({ prop, ctx: this.getCtx(), value: newValue })?.id;
        this.setPropExampleAndValue({
            prop,
            newValue,
            newExampleId,
        });
    };

    handlePropExampleIdChange = (params: { prop: PropDocUnknown, newExampleId: string }) => {
        const { prop, newExampleId } = params;
        const newExample = buildExamplesAndFindById({ prop, ctx: this.getCtx(), id: newExampleId });
        if (newExample) {
            this.setPropExampleAndValue({
                prop,
                newValue: newExample.value,
                newExampleId,
            });
        } else {
            console.error(`Unknown example id=${newExampleId}`, prop);
            this.setPropExampleAndValue({
                prop,
                newValue: undefined,
                newExampleId: undefined,
            });
        }
    };

    private setPropExampleAndValue = (params: { prop: PropDocUnknown, newExampleId: string | undefined, newValue: unknown | undefined }) => {
        const {
            prop,
            newExampleId,
            newValue,
        } = params;

        this.setState((prevState) => {
            const newPropData = { value: newValue, exampleId: newExampleId };
            const newInputData = updatePropInputData({ prop, prevInputData: prevState.inputData, newPropData });
            const newState = {
                ...prevState,
                inputData: newInputData,
            };
            if (prop.remountOnChange) {
                newState.componentKey = new Date().getTime().toString();
            }
            return newState;
        }, this.handleAdjustDynamicExamples);
    };

    /**
     * Known example where it's needed: DropdownContainer.doc.tsx
     */
    handleAdjustDynamicExamples = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                ...rebuildInputDataExamples({
                    prevInputData: prevState.inputData,
                    docs: this.props.docs,
                    ctx: this.getCtx(),
                }),
            };
        });
    };

    handleChangeContext = (selectedContext: string) => {
        this.setState({ selectedContext });
    };

    render() {
        const { title, docs, isLoaded, onRedirectBackToDocs, generatedFromType, previewLink } = this.props;
        const { inputData, selectedContext, isInited, componentKey } = this.state;
        const { component: DemoComponent, name: tagName, contexts, props } = docs || {};
        const selectedCtxName = selectedContext || (contexts?.length > 0 ? contexts[0].name : undefined);
        const isDocUnsupportedForSkin = isLoaded && !docs;

        return (
            <ComponentEditorView
                previewLink={ previewLink }
                contexts={ contexts }
                componentKey={ componentKey }
                DemoComponent={ DemoComponent }
                generatedFromType={ generatedFromType }
                inputData={ inputData }
                onGetInputValues={ this.getInputValues }
                isDocUnsupportedForSkin={ isDocUnsupportedForSkin }
                isInited={ isLoaded && isInited }
                propContext={ this.getCtx() }
                propDoc={ props }
                selectedCtxName={ selectedCtxName }
                tagName={ tagName }
                title={ title }
                onChangeSelectedCtx={ this.handleChangeContext }
                onPropExampleIdChange={ this.handlePropExampleIdChange }
                onPropValueChange={ this.handlePropValueChange }
                onRedirectBackToDocs={ onRedirectBackToDocs }
                onResetAllProps={ this.handleResetAllPropsToDefault }
                onClearProp={ this.handleClearProp }
            />
        );
    }
}
