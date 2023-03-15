import React from 'react';
import { IModal, useUuiContext } from '@epam/uui-core';
import { demoData } from '@epam/uui-docs';
import {
    ModalBlocker, ModalFooter, ModalHeader, ModalWindow, FlexRow, FlexSpacer, Panel, ScrollBars, Text, Button,
    SuccessNotification, WarningNotification,
} from '@epam/promo';

export default function BasicModalExampleToggler() {
    const { uuiModals, uuiNotifications } = useUuiContext();
    return (
        <Button
            caption='Show modal'
            onClick={ () => uuiModals.show<string>((props) => <BasicModalExample { ...props }/>)
                .then(result => {
                    uuiNotifications.show((props) => (
                        <SuccessNotification { ...props }>
                            <FlexRow alignItems='center'>
                                <Text>{ result }</Text>
                            </FlexRow>
                        </SuccessNotification>
                    )).catch(() => null);
                })
                .catch(() => {
                    uuiNotifications.show((props) => (
                        <WarningNotification { ...props }>
                            <FlexRow alignItems='center'>
                                <Text>Close action</Text>
                            </FlexRow>
                        </WarningNotification>
                    )).catch(() => null);
                }) }
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