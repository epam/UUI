import * as React from 'react';
import { DemoComponentProps } from '@epam/uui-docs';
import { Panel, FlexRow, Text, MultiSwitch, FlexSpacer, Button, TextInput, LabeledInput, NumericInput, DatePicker } from '@epam/promo';
import css from './RelativePanelContext.scss';

interface DemoComponentState {
    activeContent: 'form' | 'text';
}

export class RelativePanelContext extends React.Component<DemoComponentProps, DemoComponentState> {
    public static displayName = 'Relative panel';

    state: DemoComponentState = {
        activeContent: 'form',
    };

    renderForm() {
        return (
            <React.Fragment>
                <FlexRow spacing="12" padding="24" vPadding="24">
                    <LabeledInput label="Name">
                        <TextInput value={'Alex'} onValueChange={null} />
                    </LabeledInput>
                    <LabeledInput label="Country">
                        <TextInput value={'Belarus'} onValueChange={null} />
                    </LabeledInput>
                </FlexRow>
                <FlexRow spacing="12" padding="24" vPadding="24">
                    <LabeledInput label="Age">
                        <NumericInput max={100} min={0} value={20} onValueChange={null} />
                    </LabeledInput>
                    <LabeledInput label="Country">
                        <DatePicker format={'DD/MM/YYYY'} value={'2021-08-08'} onValueChange={null} />
                    </LabeledInput>
                </FlexRow>
                <FlexRow spacing="12" padding="24" vPadding="24">
                    <FlexSpacer />
                    <Button color="green" caption="Submit" />
                    <Button color="blue" fill="none" caption="Cancel" />
                </FlexRow>
            </React.Fragment>
        );
    }

    renderText() {
        return (
            <FlexRow padding="24" vPadding="24">
                <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse hendrerit consequat velit, eget convallis metus. Ut euismod elit felis, </Text>
            </FlexRow>
        );
    }

    render() {
        const { DemoComponent, props } = this.props;
        return (
            <Panel cx={css.container} margin="24">
                <FlexRow padding="12">
                    <Text>Relative Panel</Text>
                    <FlexSpacer />
                    <MultiSwitch<DemoComponentState['activeContent']>
                        size="24"
                        items={[
                            { id: 'form', caption: 'form' },
                            { id: 'text', caption: 'text' },
                        ]}
                        value={this.state.activeContent}
                        onValueChange={(newValue) => {
                            this.setState({ activeContent: newValue });
                        }}
                    />
                </FlexRow>
                <Panel background="white" cx={css.demo}>
                    {this.state.activeContent === 'form' ? this.renderForm() : this.renderText()}
                    <DemoComponent {...props} />
                </Panel>
            </Panel>
        );
    }
}
