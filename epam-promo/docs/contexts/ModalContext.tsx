import * as React from 'react';
import { UuiContext, UuiContexts } from '@epam/uui';
import { DemoComponentProps } from '@epam/uui-docs';
import { Panel, Button, LabeledInput, TextArea, FlexRow } from '../../components';

export class ModalContext extends React.Component<DemoComponentProps, any> {
    public static displayName = "Modal";
    static contextType = UuiContext;
    context: UuiContexts;
    state = { result: '' };

    handleOnClick = () => {
        const { DemoComponent, props } = this.props;
        this.context.uuiModals.show(modalProps =>
                <DemoComponent { ...props } { ...modalProps }/>,
            )
            .then(result => this.setState({ result }))
            .catch(() => null);
    }

    render() {

        return (
            <Panel margin='24' shadow background='white'>
                <FlexRow size='36' spacing='12' alignItems='top' vPadding='18' padding='24' >
                    <Button
                        caption="Show Modal"
                        onClick={ this.handleOnClick }
                    />
                </FlexRow>
                <FlexRow size='36' spacing='12' alignItems='top' vPadding='18' padding='24' >
                    <LabeledInput label='Last result'>
                        <TextArea value={ JSON.stringify(this.state.result, null, 2) } onValueChange={ () => {} } rows={ 10 }/>
                    </LabeledInput>
                </FlexRow>
            </Panel>
        );
    }
}