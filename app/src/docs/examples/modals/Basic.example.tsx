import React from 'react';
import { IModal, useUuiContext } from '@epam/uui';
import { demoData } from '@epam/uui-docs';
import { ModalBlocker, ModalFooter, ModalHeader, ModalWindow, FlexRow, FlexSpacer, Panel, ScrollBars, Text, Button } from '@epam/promo';

export default function BasicModalExampleToggler() {
    const svc = useUuiContext();
    return (
        <Button
            caption='Show modal'
            onClick={ () => svc.uuiModals.show((props) => <BasicModalExample { ...props }/>) }
        />
    );
}

export function BasicModalExample(modalProps: IModal<string>) {
    return (
        <ModalBlocker blockerShadow='dark' { ...modalProps }>
            <ModalWindow>
                <Panel background="white">
                    <ModalHeader title="Simple modal example " onClose={ () => modalProps.abort() } />
                    <ScrollBars hasTopShadow hasBottomShadow >
                        <FlexRow padding='24'>
                            <Text size='36'> { demoData.loremIpsum.repeat(3) } </Text>
                        </FlexRow>
                    </ScrollBars>
                    <ModalFooter>
                        <FlexSpacer />
                        <Button color='gray50' fill='white' caption='Cancel' onClick={ () => modalProps.abort() } />
                        <Button color='green' caption='Ok' onClick={ () => modalProps.success('Success action') } />
                    </ModalFooter>
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    );
}