import * as React from 'react';
import { Panel, FlexRow, LabeledInput, TextInput, Button } from '@epam/loveship';
import { IEditable, Lens, Stateful } from '@epam/uui';

interface FormState {
    text1?: string;
    text2?: string;
}

const initialState: FormState = {
    text1: 'Text 1',
    text2: 'Text 2',
};

class PureTextEditor extends React.PureComponent<IEditable<string>> {
    render() {
        return (
            <LabeledInput label='Text' { ...this.props } >
                <TextInput { ...this.props } />
            </LabeledInput>
        );
    }
}

class Editor extends React.Component<IEditable<FormState>> {
    lens = Lens.onEditableComponent<FormState>(this);
    text1Lens = this.lens.prop('text1');
    text2Lens = this.lens.prop('text2');
    handleReset = () => this.lens.set(initialState);
    handleClear = () => this.lens.set(null);

    render() {
        return (
            <Panel margin='24' background='white' shadow>
                <FlexRow type='form' padding='24'>
                    <PureTextEditor { ...this.text1Lens.toProps() } />
                    <PureTextEditor { ...this.text1Lens.toProps() } />
                </FlexRow>
                <FlexRow type='form' padding='24'>
                    <PureTextEditor { ...this.text2Lens.toProps() } />
                    <PureTextEditor { ...this.text2Lens.toProps() } />
                </FlexRow>
                <FlexRow type='form' padding='24'>
                    <Button caption='Reset' onClick={ this.handleReset } />
                    <Button caption='Clear' onClick={ this.handleClear } />
                </FlexRow>
            </Panel>
        );
    }
}

export const LensTestForm = () => <Stateful
    initialState={ initialState }
    render={ props => <Editor { ...props } /> }
/>;