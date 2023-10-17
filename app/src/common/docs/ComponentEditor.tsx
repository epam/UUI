import * as React from 'react';
import { ArrayDataSource, cx, IHasCX, INotification } from '@epam/uui-core';
import { PropDoc, PropSamplesCreationContext, IComponentDocs, PropExample, DemoContext } from '@epam/uui-docs';
import { FlexCell, FlexRow, FlexSpacer, RadioInput, Switch, Text, Tooltip, TextInput, MultiSwitch, Panel, ScrollBars, PickerInput, Spinner, NotificationCard } from '@epam/promo';
import { IconButton } from '@epam/uui';
import { svc } from '../../services';
import { copyTextToClipboard } from '../../helpers';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/notification-help-fill-18.svg';
import { ReactComponent as CopyIcon } from '../../icons/icon-copy.svg';
import { ReactComponent as ResetIcon } from '../../icons/reset-icon.svg';
import { ReactComponent as NotificationIcon } from '../../icons/notification-check-fill-24.svg';
import css from './ComponentEditor.module.scss';

declare let require: any;

const PATH_PREFIX = './app/src/docs/_props'; // Keep it in sync with "uui-build/getComponentsPropsSet.ts"
// narrow down the context base path to speed up lookup.
const requireContext = require.context('../../../../app/src/docs/_props', true, /\/(loveship|epam-promo|uui)\/.*\.props.(ts|tsx)$/, 'lazy');

interface ComponentEditorProps extends IHasCX {
    propsDocPath: string;
    title: string;
}

interface ComponentEditorState {
    docs: IComponentDocs<any>;
    isLoading: boolean;
    code?: string;
    showCode: boolean;
    selectedContext?: string;
    selectedPropsIds: { [name: string]: string };
    inputValues: { [name: string]: string };
    componentKey?: string;
}

export class ComponentEditor extends React.Component<ComponentEditorProps, ComponentEditorState> {
    propSamplesCreationContext: PropSamplesCreationContext<any> = {
        getCallback: (name: string) => {
            const callback = (...args: any[]) => {
                svc.uuiNotifications
                    .show(
                        () => (
                            <Panel background="white" shadow={ true }>
                                <FlexRow padding="12" borderBottom={ true }>
                                    <pre>
                                        {name}
                                        (
                                        {args.length}
                                        {' '}
                                        args)
                                    </pre>
                                </FlexRow>
                            </Panel>
                        ),
                        { position: 'bot-right' },
                    )
                    .catch(() => null);
                // tslint:disable-next-line:no-console
                console.log(`${name} (`, args, ')');
            };
            callback.displayName = 'callback';
            return callback;
        },
        getChangeHandler: () => {
            const cb: any = (newValue: string) =>
                this.setState({
                    ...this.state,
                    inputValues: { ...this.state.inputValues, value: newValue },
                    selectedPropsIds: { ...this.state.selectedPropsIds, value: newValue },
                });
            cb.displayName = '(newValue) => { ... }';
            return cb;
        },
        getSelectedProps: () => this.getProps(),
        forceUpdate: () => this.forceUpdate(),
        demoApi: svc.api.demo,
    };

    constructor(props: ComponentEditorProps) {
        super(props);

        this.state = {
            docs: null,
            isLoading: true,
            showCode: false,
            selectedPropsIds: {},
            inputValues: {},
            componentKey: undefined,
        };
    }

    componentDidMount() {
        const { propsDocPath } = this.props;
        const selectedPropsIds = { ...this.state.selectedPropsIds };
        const inputValues = { ...this.state.inputValues };

        if (propsDocPath) {
            const propsDocPathRelative = `.${propsDocPath.substring(PATH_PREFIX.length)}`;
            requireContext(propsDocPathRelative).then((m: any) => {
                const module = m.default;
                module.props.forEach((prop: any) => {
                    if (typeof prop.examples === 'function') {
                        this.propExamples[prop.name] = prop.examples(this.propSamplesCreationContext);
                    } else if (prop.examples.length) {
                        this.propExamples[prop.name] = prop.examples;
                    }

                    let defaultExample = this.propExamples[prop.name].find((i) => i.isDefault);
                    if (!defaultExample && prop.isRequired) {
                        defaultExample = this.propExamples[prop.name][0];
                    }

                    if (defaultExample) {
                        selectedPropsIds[prop.name] = defaultExample.id;
                    }

                    if (prop.type === 'string') {
                        inputValues[prop.name] = defaultExample?.value;
                    }
                });
                this.initialProps = selectedPropsIds;
                this.setState({ docs: module, selectedPropsIds: selectedPropsIds, inputValues: inputValues, isLoading: false });
            });
        }
    }

    propExamples: { [propName: string]: PropExample<any>[] } = {};
    initialProps: any;

    getPropValue(prop: PropDoc<any, any>) {
        if (typeof prop.examples === 'function') {
            const result = prop.examples(this.propSamplesCreationContext);
            this.propExamples[prop.name] = result;
            return result;
        } else if (prop.examples.length) {
            const result = prop.examples;
            this.propExamples[prop.name] = prop.examples;
            return result;
        }
        return this.propExamples[prop.name];
    }

    renderPropEditor(prop: PropDoc<any, any>) {
        const propValue = this.getPropValue(prop);
        const items = propValue.map((example) => ({
            caption: example.name,
            id: example.id,
        }));

        const onExampleClick = (selectedProp: string, inputValue?: string) => {
            const newStateValues: ComponentEditorState = {
                ...this.state,
                selectedPropsIds: { ...this.state.selectedPropsIds, [prop.name]: selectedProp },
                inputValues: { ...this.state.inputValues, [prop.name]: inputValue },
            };

            if (prop.remountOnChange) {
                newStateValues.componentKey = new Date().getTime().toString();
            }

            this.setState(newStateValues);
        };

        const getPropsDataSource = (exampleItems: any[] | any) => new ArrayDataSource({ items: exampleItems, getId: (i) => i.id });

        if (prop.renderEditor) {
            return prop.renderEditor(
                {
                    value: this.state.selectedPropsIds && this.state.selectedPropsIds[prop.name],
                    onValueChange: onExampleClick,
                },
                this.propExamples[prop.name] && this.propExamples[prop.name].map((ex) => ex.value),
                this.state.selectedPropsIds,
            );
        } else if (this.propExamples[prop.name].length > 1) {
            if (prop.type === 'string') {
                return (
                    <>
                        <FlexCell minWidth={ 150 }>
                            <PickerInput
                                size="24"
                                dataSource={ getPropsDataSource(this.propExamples[prop.name]) }
                                selectionMode="single"
                                value={ this.propExamples[prop.name].find((i) => i.value === this.state.inputValues[prop.name])?.id }
                                onValueChange={ (inputValue) => onExampleClick(inputValue, this.propExamples[prop.name][Number(inputValue)]?.value) }
                                valueType="id"
                                entityName={ prop.name }
                                placeholder={ this.state.inputValues?.[prop.name] }
                            />
                        </FlexCell>
                        <FlexCell minWidth={ 150 }>
                            <TextInput
                                onCancel={ () => onExampleClick('', '') }
                                size="24"
                                onValueChange={ (inputValue) => onExampleClick(undefined, inputValue) }
                                value={ this.state.inputValues[prop.name] }
                            />
                        </FlexCell>
                        {prop.description && (
                            <Tooltip placement="top" content={ prop.description }>
                                <IconButton icon={ InfoIcon } color="default" />
                            </Tooltip>
                        )}
                    </>
                );
            } else {
                return (
                    <React.Fragment>
                        <MultiSwitch
                            items={ items }
                            onValueChange={ onExampleClick }
                            value={ this.state.selectedPropsIds[prop.name] }
                            size="24"
                            rawProps={ { style: { flexWrap: 'wrap' } } }
                        />
                        {prop.description && (
                            <Tooltip placement="top" content={ prop.description }>
                                <IconButton icon={ InfoIcon } color="default" />
                            </Tooltip>
                        )}
                    </React.Fragment>
                );
            }
        } else if (this.propExamples[prop.name].length === 1) {
            return (
                <React.Fragment>
                    <RadioInput
                        value={ !!this.state.selectedPropsIds[prop.name] }
                        onValueChange={ () => onExampleClick(this.propExamples[prop.name][0].id) }
                        size="18"
                        label={ this.propExamples[prop.name][0].name }
                    />
                    {prop.description && (
                        <Tooltip placement="top" content={ prop.description }>
                            <IconButton icon={ InfoIcon } color="default" />
                        </Tooltip>
                    )}
                </React.Fragment>
            );
        } else {
            return null;
        }
    }

    renderPropertyRow(prop: any) {
        return (
            <FlexRow key={ prop.name } size="36" borderBottom padding="12" spacing="6">
                <FlexCell key="name" width={ 130 }>
                    <Text>{prop.name}</Text>
                </FlexCell>
                <FlexCell key="default" width={ 110 }>
                    {!prop.isRequired && (
                        <RadioInput
                            label={ prop.defaultValue == null ? 'none' : prop.defaultValue + '' }
                            size="18"
                            value={ !this.state.selectedPropsIds[prop.name] }
                            onValueChange={ () => this.setState({ ...this.state, selectedPropsIds: { ...this.state.selectedPropsIds, [prop.name]: undefined } }) }
                        />
                    )}
                </FlexCell>
                <FlexCell key="examples" grow={ 1 }>
                    <FlexRow size="36" spacing="6">
                        {this.renderPropEditor(prop)}
                    </FlexRow>
                </FlexCell>
            </FlexRow>
        );
    }

    renderSettings(contexts: DemoContext[]) {
        const contextPicker = (
            <MultiSwitch
                key="multi-switch"
                items={ [...contexts.map((i) => ({ caption: i.name, id: i.name }))] }
                value={ this.state.selectedContext || contexts[0].name }
                onValueChange={ (val: any) => this.setState({ ...this.state, selectedContext: val }) }
                size="24"
            />
        );

        return contextPicker;
    }

    getProps() {
        const props = { ...this.state.inputValues };
        for (const key in this.state.selectedPropsIds) {
            const docComponent = this.state.docs.props.find((doc) => doc.name === key);
            if (!docComponent) continue;
            if (docComponent.type === 'string') {
                props[key] = this.state.inputValues[key];
                continue;
            }
            props[key] = this.propExamples[key].find(({ id }) => id === this.state.selectedPropsIds[key])?.value ?? this.state.selectedPropsIds[key];
        }
        props.key = this.state.componentKey;
        return props;
    }

    renderDemo() {
        const { component: DemoComponent } = this.state.docs;
        const defaultContext = this.state.docs.contexts[0];
        const props = this.getProps();
        let SelectedDemoContext = null;

        if (!this.state.selectedContext) {
            SelectedDemoContext = defaultContext.context;
        } else {
            SelectedDemoContext = this.state.docs.contexts.filter((ctx) => ctx.name === this.state.selectedContext)[0].context;
        }

        return <SelectedDemoContext DemoComponent={ DemoComponent } props={ props } />;
    }

    renderCode(selectedProps: { [name: string]: any }) {
        const tagName = this.state?.docs?.name;
        const props: string[] = [];
        let children: string = null;
        Object.keys(selectedProps).forEach((name) => {
            const val = selectedProps[name];

            if (val) {
                if (name === 'children') {
                    children = '{/* ' + (val.displayName || 'children') + ' */}';
                } else if (val === true) {
                    props.push(name);
                } else if (typeof val === 'string') {
                    props.push(`${name}="${val}"`);
                } else if (typeof val === 'number') {
                    props.push(`${name}={${val}}`);
                } else if (val.displayName) {
                    props.push(`${name}={${val.displayName}}`);
                } else if (typeof val === 'function') {
                    props.push(`${name}={() => { /* code */ }`);
                } else if (name === 'dataSource') {
                    props.push(`${name}={() => { /* code */ }`);
                } else {
                    props.push(`${name}={${JSON.stringify(val)}}`);
                }
            }
        });

        let propsStr = props.join(' ');
        if (propsStr.length > 0) {
            propsStr = ' ' + propsStr;
        }
        if (propsStr.length > 80) {
            propsStr = '\n' + props.map((p) => '    ' + p).join('\n') + '\n';
        }

        if (children) {
            return `<${tagName}${propsStr}>${children}</${tagName}>`;
        } else {
            return `<${tagName}${propsStr}/>`;
        }
    }

    renderCodeBlock() {
        return <pre className={ css.code }>{this.renderCode(this.getProps())}</pre>;
    }

    showNotification() {
        svc.uuiNotifications.show(
            (props: INotification) => (
                <NotificationCard { ...props } icon={ NotificationIcon } color="gray60" onClose={ null }>
                    <Text size="36" font="sans">
                        Code was copied to the clipboard
                    </Text>
                </NotificationCard>
            ),
            { duration: 3 },
        ).catch(() => {});
    }

    getTheme(route: string) {
        const routeArray = route?.split('/');
        const id = routeArray?.indexOf('_props');
        if (!id) return '';
        switch (routeArray[id + 1]) {
            case 'uui':
                return 'uui-theme-vanilla_thunder';
            case 'epam-promo':
                return 'uui-theme-promo';
            case 'loveship':
                return 'uui-theme-loveship';
            default:
                return '';
        }
    }

    render() {
        const { title } = this.props;
        const { isLoading, docs } = this.state;
        const currentTheme = this.getTheme(this.props.propsDocPath);

        return (
            <>
                {isLoading ? (
                    <Spinner cx={ css.spinner } />
                ) : (
                    <div className={ cx(css.root, this.props.cx) }>
                        <div className={ css.container }>
                            <FlexRow key="head" size="36" padding="12" borderBottom spacing="6" cx={ css.boxSizing }>
                                <Text fontSize="16" lineHeight="24" cx={ css.vPadding } font="sans-semibold">
                                    {title}
                                </Text>
                                <FlexSpacer />
                                <Tooltip placement="auto" content={ Object.keys(this.state.selectedPropsIds).length > 0 && 'Reset setting' }>
                                    <IconButton
                                        isDisabled={ !(Object.keys(this.state.selectedPropsIds).length > 0) }
                                        icon={ ResetIcon }
                                        onClick={ () =>
                                            this.setState({
                                                ...this.state,
                                                selectedPropsIds: { ...this.initialProps },
                                                selectedContext: docs.contexts[0].name,
                                            }) }
                                        color="info"
                                    />
                                </Tooltip>
                            </FlexRow>
                            <FlexRow key="table-head" size="36" background="gray5" padding="12" spacing="6" borderBottom cx={ css.boxSizing }>
                                <FlexCell key="name" width={ 130 }>
                                    <Text size="24" font="sans-semibold">
                                        NAME
                                    </Text>
                                </FlexCell>
                                <FlexCell key="default" width={ 100 }>
                                    <Text size="24" font="sans-semibold">
                                        DEFAULT
                                    </Text>
                                </FlexCell>
                                <FlexCell key="examples" grow={ 1 }>
                                    <Text size="24" font="sans-semibold">
                                        PRESET
                                    </Text>
                                </FlexCell>
                            </FlexRow>
                            <div className={ css.rowProps }>
                                <ScrollBars cx={ css.lastBorder }>{docs.props.map((i: any) => this.renderPropertyRow(i))}</ScrollBars>
                            </div>
                            <FlexRow key="code-head" size="36" padding="12" spacing="6" borderBottom={ this.state.showCode }>
                                <Switch label="View Code" value={ this.state.showCode } onValueChange={ () => this.setState({ showCode: !this.state.showCode }) } />
                                <FlexSpacer />
                                <Tooltip content="Copy code" placement="top">
                                    <IconButton icon={ CopyIcon } onClick={ () => copyTextToClipboard(this.renderCode(this.getProps()), this.showNotification) } />
                                </Tooltip>
                            </FlexRow>
                            {this.state.showCode && (
                                <FlexRow key="code" size="36" padding="12">
                                    {this.renderCodeBlock()}
                                </FlexRow>
                            )}
                        </div>
                        <div className={ css.demoContext }>
                            <FlexRow key="head" size="36" padding="12" spacing="6" borderBottom background="white" cx={ css.contextSettingRow }>
                                {this.renderSettings(docs.contexts)}
                            </FlexRow>
                            <div className={ cx(css.demoContainer, currentTheme) }>
                                <ScrollBars>{this.renderDemo()}</ScrollBars>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
}
