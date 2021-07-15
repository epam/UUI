import React from 'react';
import { IModal } from '@epam/uui';
import { svc, loremIpsum } from '@epam/uui-docs';
import { ModalBlocker, ModalFooter, ModalHeader, ModalWindow, FlexRow, FlexSpacer, Panel, ScrollBars, Text, Button } from '@epam/promo';

function ModalWithDisabledClickOutsideAndCross(props: IModal<string>) {
    return (
        <ModalBlocker disallowClickOutside blockerShadow='dark' { ...props }>
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
                        <Button color='gray50' fill='white' caption='Cancel' onClick={ () => props.abort() } />
                        <Button color='green' caption='Ok' onClick={ () => props.success('Success action') } />
                    </ModalFooter>
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    );
}

export default function DisableClickOutsideAndCrossExampleToggler() {
    return (
        <Button
            caption='Show modal'
            onClick={ () => svc.uuiModals.show((props) => <ModalWithDisabledClickOutsideAndCross { ...props }/>) }
        />
    );
}