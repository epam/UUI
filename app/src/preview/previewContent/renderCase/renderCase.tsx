import * as React from 'react';
import { DocBuilder, PropDocPropsUnknown, TDocContext, uuiDocContextsMap } from '@epam/uui-docs';
import { formatPropsForNativeTooltip } from './renderCaseUtils';
import { buildNormalizedInputValuesMap, buildPropInputDataAll, TPropInputDataAll } from '../../../common/docs/componentEditor/propDocUtils';
import { PropSamplesCreationContext } from '../../../common/docs/componentEditor/view/PropSamplesCreationContext';

import css from './renderCase.module.scss';

interface ISingleRenderCaseView {
    docs: DocBuilder<PropDocPropsUnknown>;
    renderCaseProps: Record<string, unknown>;
    context: TDocContext;
}

interface ISingleRenderCaseViewState {
    inputData: TPropInputDataAll;
    isInited: boolean
}

export class RenderCase extends React.PureComponent<ISingleRenderCaseView, ISingleRenderCaseViewState> {
    state = { inputData: {}, isInited: false };

    private propExamplesCtx = new PropSamplesCreationContext({
        forceUpdate: () => this.forceUpdate(),
        getInputValues: () => this.getInputValues(),
        handleChangeValueOfPropertyValue: (newValue) => this.setState((prev) => {
            return {
                ...prev,
                inputData: {
                    ...prev.inputData,
                    value: {
                        ...prev.inputData.value,
                        value: newValue,
                    },
                },
            };
        }),
    });

    private getCtx = () => {
        return this.propExamplesCtx;
    };

    componentDidMount() {
        this.initProps();
    }

    initProps() {
        const { docs, renderCaseProps } = this.props;
        const inputData = buildPropInputDataAll({ docs, ctx: this.getCtx() });
        const renderCasePropsNorm = Object.keys(renderCaseProps).reduce<TPropInputDataAll>((acc, name) => {
            acc[name] = { value: renderCaseProps[name] };
            return acc;
        }, {});
        this.setState({
            inputData: {
                ...inputData,
                ...renderCasePropsNorm, // props from render cases have higher priority
            },
            isInited: true,
        });
    }

    getInputValues = () => {
        return buildNormalizedInputValuesMap(this.state.inputData);
    };

    render = () => {
        const { context, docs } = this.props;
        const { isInited } = this.state;

        if (!isInited) {
            return null;
        }

        let SelectedDemoContext;
        if (context === TDocContext.Default) {
            // Assumption: all components support Default context, so we never report error when Default context is selected.
            SelectedDemoContext = uuiDocContextsMap[TDocContext.Default];
        } else {
            SelectedDemoContext = docs.contexts.find(({ name }) => name === context).context;
        }
        const inputValues = this.getInputValues();
        const { propsForTooltip, propsForDataAttr } = formatPropsForNativeTooltip(inputValues);
        const DemoComponent = docs.component;
        return (
            <div className={ css.root } data-props={ propsForDataAttr } title={ propsForTooltip }>
                <SelectedDemoContext
                    DemoComponent={ DemoComponent }
                    props={ inputValues }
                    isPreview={ true }
                />
            </div>
        );
    };
}
