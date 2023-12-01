import * as React from 'react';
import { IHasCX } from '@epam/uui-core';
import { IComponentDocs, PropDoc, PropExample, TDocConfig, TSkin, TDocsGenExportedType } from '@epam/uui-docs';
import { ComponentEditorView } from './view/ComponentEditorView';
import { useDocBuilderGen } from '../docBuilderGen/hooks/useDocBuilderGen';
import { getExamplesList, getInputValuesFromInputData, getSkin, isPropValueEmpty } from './utils';
import { PropSamplesCreationContext } from './view/PropSamplesCreationContext';
import { TUUITheme } from '../docsConstants';

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
    const skin = getSkin(theme, isSkin);
    const { isLoaded, docs, generatedFromType } = useDocBuilderGen({
        config,
        skin: skin,
    });

    React.useEffect(() => {
        if (!config) {
            onRedirectBackToDocs();
        }
    }, [config, onRedirectBackToDocs]);

    return (
        <ComponentEditor
            key={ skin }
            isLoaded={ isLoaded }
            onRedirectBackToDocs={ onRedirectBackToDocs }
            docs={ docs }
            title={ title }
            skin={ skin }
            generatedFromType={ generatedFromType }
        />
    );
}

interface ComponentEditorProps extends IHasCX {
    docs?: IComponentDocs<any>;
    skin: TSkin;
    title: string;
    isLoaded: boolean;
    onRedirectBackToDocs: () => void;
    generatedFromType?: TDocsGenExportedType;
}

interface ComponentEditorState {
    showCode: boolean;
    isInited: boolean;
    selectedContext?: string;
    inputData: {
        [name: string]: { value?: any; exampleId?: string }
    };
    componentKey?: string;
}

const getInitialState = (): ComponentEditorState => ({
    showCode: false,
    inputData: {},
    componentKey: undefined,
    isInited: false,
});

export class ComponentEditor extends React.Component<ComponentEditorProps, ComponentEditorState> {
    propSamplesCreationContext = new PropSamplesCreationContext(this);
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
                const inputData: ComponentEditorState['inputData'] = {};
                docs.props.forEach((prop) => {
                    inputData[prop.name] = { value: undefined };
                    const defaultExample = this.getDefaultPropExample(prop);
                    if (defaultExample) {
                        inputData[prop.name].exampleId = defaultExample.id;
                        inputData[prop.name].value = defaultExample.value;
                    }
                });
                this.setState({ inputData, isInited: true });
            }
        });
    }

    getPropExamples = (prop: PropDoc<any, any>) => {
        const { examples } = prop;
        return getExamplesList(examples, this.propSamplesCreationContext);
    };

    getDefaultPropExample = (prop: PropDoc<any, any>): PropExample<any> => {
        const propExamples = this.getPropExamples(prop);
        let exampleResolved = propExamples.find((i) => i.isDefault);
        if (!exampleResolved && prop.isRequired) {
            exampleResolved = propExamples[0];
        }
        return exampleResolved;
    };

    /**
     * Used by PropSamplesCreationContext
     */
    public getInputValues = () => {
        return getInputValuesFromInputData(this.state.inputData);
    };

    /**
     * Used by PropSamplesCreationContext
     * @param newValue
     */
    public handleChangeValueOfPropertyValue = (newValue: any) => {
        const propertyName = 'value';
        const prop = this.getPropByName(propertyName);
        this.handlePropValueChange({ prop, newPropValue: newValue });
    };

    getPropByName = (propName: string) => {
        return this.props.docs.props.find((p) => p.name === propName);
    };

    handleResetProp = (propertyName: string) => {
        const prop = this.getPropByName(propertyName);
        this.setPropExampleAndValue({
            prop,
            newPropValue: undefined,
            newPropExampleId: undefined,
        });
    };

    handleReset = () => {
        this.initProps();
    };

    handlePropValueChange = (params: { prop: PropDoc<any, any>, newPropValue: any }) => {
        const { prop, newPropValue } = params;
        const newPropExampleId = this.getPropExamples(prop).find((ex) => ex.value === newPropValue)?.id;
        this.setPropExampleAndValue({
            prop,
            newPropValue,
            newPropExampleId,
        });
    };

    handlePropExampleIdChange = (params: { prop: PropDoc<any, any>, newPropExampleId: string }) => {
        const { prop, newPropExampleId } = params;
        const propExamplesList = this.getPropExamples(prop);
        const newExample = propExamplesList.find((ex) => ex.id === newPropExampleId);
        if (newExample) {
            this.setPropExampleAndValue({
                prop,
                newPropValue: newExample.value,
                newPropExampleId,
            });
        } else {
            console.error(`Unknown example id=${newPropExampleId}`, prop, propExamplesList);
            this.setPropExampleAndValue({
                prop,
                newPropValue: undefined,
                newPropExampleId: undefined,
            });
        }
    };

    private setPropExampleAndValue = (params: { prop: PropDoc<any, any>, newPropExampleId: string | undefined, newPropValue: any }) => {
        const {
            prop: {
                name,
                remountOnChange,
            },
            newPropExampleId,
            newPropValue,
        } = params;

        this.setState((prevState) => {
            const propInputData = { ...prevState.inputData[name] };
            if (newPropExampleId === undefined) {
                delete propInputData.exampleId;
            } else {
                propInputData.exampleId = newPropExampleId;
            }
            if (newPropValue === undefined) {
                delete propInputData.value;
            } else {
                propInputData.value = newPropValue;
            }
            const newState: Partial<ComponentEditorState> = {
                inputData: {
                    ...prevState.inputData,
                    [name]: propInputData,
                },
            };
            if (remountOnChange) {
                newState.componentKey = new Date().getTime().toString();
            }
            return {
                ...prevState,
                ...newState,
            };
        }, this.handleAdjustDynamicExamples);
    };

    /**
     * Known example where it's needed: DropdownContainer.doc.tsx
     */
    handleAdjustDynamicExamples = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                inputData: Object.keys(prevState.inputData).reduce<ComponentEditorState['inputData']>((acc, propName) => {
                    const prev = prevState.inputData[propName];
                    if (prev.exampleId !== undefined) {
                        const prop = this.getPropByName(propName);
                        const eList = this.getPropExamples(prop);
                        const example = eList.find(({ id }) => id === prev.exampleId);
                        acc[propName] = {
                            exampleId: example.id,
                        };
                        if (!isPropValueEmpty(example.value)) {
                            acc[propName].value = example.value;
                        }
                    } else {
                        acc[propName] = prev;
                    }
                    return acc;
                }, {}),
            };
        });
    };

    handleChangeContext = (selectedContext: string) => {
        this.setState({ selectedContext });
    };

    handleToggleShowCode = () => this.setState((prev) => {
        return { showCode: !prev.showCode };
    });

    render() {
        const { title, docs, isLoaded, onRedirectBackToDocs, generatedFromType } = this.props;
        const { showCode, inputData, selectedContext, isInited, componentKey } = this.state;
        const { component: DemoComponent, name: tagName, contexts, props } = docs || {};
        const selectedCtxName = selectedContext || (contexts?.length > 0 ? contexts[0].name : undefined);
        const isDocUnsupportedForSkin = isLoaded && !docs;

        return (
            <ComponentEditorView
                contexts={ contexts }
                componentKey={ componentKey }
                DemoComponent={ DemoComponent }
                generatedFromType={ generatedFromType }
                inputData={ inputData }
                onGetInputValues={ this.getInputValues }
                isDocUnsupportedForSkin={ isDocUnsupportedForSkin }
                isInited={ isLoaded && isInited }
                propContext={ this.propSamplesCreationContext }
                propDoc={ props }
                selectedCtxName={ selectedCtxName }
                showCode={ showCode }
                tagName={ tagName }
                title={ title }
                onChangeSelectedCtx={ this.handleChangeContext }
                onPropExampleIdChange={ this.handlePropExampleIdChange }
                onPropValueChange={ this.handlePropValueChange }
                onRedirectBackToDocs={ onRedirectBackToDocs }
                onReset={ this.handleReset }
                onResetProp={ this.handleResetProp }
                onToggleShowCode={ this.handleToggleShowCode }
            />
        );
    }
}
