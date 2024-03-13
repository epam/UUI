import * as React from 'react';
import { DemoContext, DocBuilder, PropDocPropsUnknown } from '@epam/uui-docs';
import { FlexCell, Text } from '@epam/uui';
import {
    buildNormalizedInputValuesMap,
    buildPropInputDataAll,
    TPropInputDataAll,
} from '../../../common/docs/componentEditor/propDocUtils';
import { PropSamplesCreationContext } from '../../../common/docs/componentEditor/view/PropSamplesCreationContext';
//
import css from './useCaseView.module.scss';
import { TEST_AUTOMATION_MASK } from '../constants';

interface ISingleUseCaseView {
    docs: DocBuilder<PropDocPropsUnknown>;
    DemoComponent: React.ComponentType<PropDocPropsUnknown>;
    currentUseCaseProps: Record<string, unknown>;
    context: DemoContext<PropDocPropsUnknown>;
    id: string;
}

interface ISingleUseCaseViewState {
    inputData: TPropInputDataAll;
    isInited: boolean
}

export class UseCaseView extends React.PureComponent<ISingleUseCaseView, ISingleUseCaseViewState> {
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
        const { docs, currentUseCaseProps } = this.props;
        const inputData = buildPropInputDataAll({ docs, ctx: this.getCtx() });
        const currentUseCasePropsNorm = Object.keys(currentUseCaseProps).reduce<TPropInputDataAll>((acc, name) => {
            acc[name] = { value: currentUseCaseProps[name] };
            return acc;
        }, {});
        this.setState({
            inputData: {
                ...inputData,
                ...currentUseCasePropsNorm, // props from use cases have higher priority
            },
            isInited: true,
        });
    }

    getInputValues = () => {
        return buildNormalizedInputValuesMap(this.state.inputData);
    };

    render = () => {
        const { isInited } = this.state;
        if (!isInited) {
            return null;
        }

        const { DemoComponent, context, currentUseCaseProps, id } = this.props;
        const SelectedDemoContext = context.context;
        const inputValues = this.getInputValues();

        let tooltip = '';
        try {
            tooltip = JSON.stringify(currentUseCaseProps, undefined, 1);
        } catch (err) {}

        return (
            <>
                <FlexCell cx={ [css.label, TEST_AUTOMATION_MASK] }>
                    <div>
                        <Text fontSize="12" lineHeight="12" rawProps={ { title: tooltip } }>{ `${id}` }</Text>
                    </div>
                </FlexCell>
                <FlexCell>
                    <SelectedDemoContext
                        DemoComponent={ DemoComponent }
                        props={ inputValues }
                        isPreview={ true }
                    />
                </FlexCell>
            </>

        );
    };
}
