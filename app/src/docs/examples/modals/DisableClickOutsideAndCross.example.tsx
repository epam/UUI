import * as React from 'react';
import { IModal } from '@epam/uui';
import { ModalBlocker, ModalFooter, ModalHeader, ModalWindow, FlexRow, FlexSpacer, Panel, ScrollBars, Text, Button } from '@epam/promo';
import { loremIpsum } from '../../../helpers/loremIpsum';
import { svc } from '../../../services';

class ModalWithDisabledClickOutsideAndCross extends React.Component<IModal<string>, any> {
    render() {
        return (
            <ModalBlocker disallowClickOutside={ true } blockerShadow='dark' { ...this.props }>
                <ModalWindow>
                    <Panel background="white">
                        <ModalHeader title="Simple modal example " />
                        <ScrollBars hasTopShadow hasBottomShadow >
                            <FlexRow padding='24' vPadding='12' >
                                <Text size='36'> { loremIpsum } { loremIpsum } { loremIpsum } </Text>
                            </FlexRow>
                        </ScrollBars>
                        <ModalFooter>
                            <FlexSpacer />
                            <Button color='gray50' fill='white' caption='Cancel' onClick={ () => this.props.abort() } />
                            <Button color='green' caption='Ok' onClick={ () => this.props.success('Success action') } />
                        </ModalFooter>
                    </Panel>
                </ModalWindow>
            </ModalBlocker>
        );
    }
}

export class DisableClickOutsideAndCrossExampleToggler extends React.Component<any, any> {
    render() {
        return (
            <Button
                caption='Show modal'
                onClick={ () => svc.uuiModals.show((props) => <ModalWithDisabledClickOutsideAndCross { ...props }/>) }
            />
        );
    }
}