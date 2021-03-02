import * as React from 'react';
import { uuiContextTypes, UuiContexts } from '@epam/uui';
import { DemoComponentProps } from '@epam/uui-docs';
import { Panel, Button, LabeledInput, TextArea, FlexRow } from '../../components';

export class ModalContext extends React.Component<DemoComponentProps, any> {
    public static displayName = "Modal";
    static contextTypes = uuiContextTypes;
    context: UuiContexts;
    state = { result: '' };

    handleOnClick = () => {
        const { DemoComponent, props } = this.props;
        this.context.uuiModals.show(modalProps =>
                <DemoComponent { ...props } { ...modalProps }/>,
            ).then(result => this.setState({ result }));
    }

    render() {

        return (
            <Panel margin='24' shadow background='white'>
                <FlexRow type='form'>
                    <Button
                        caption="Show Modal"
                        onClick={ this.handleOnClick }
                    />
                </FlexRow>
                <FlexRow type='form'>
                    <LabeledInput label='Last result'>
                        <TextArea value={ JSON.stringify(this.state.result, null, 2) } onValueChange={ () => null } rows={ 10 }/>
                    </LabeledInput>
                </FlexRow>
            </Panel>
        );
    }
}