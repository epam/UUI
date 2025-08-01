import React from 'react';
import { IModal, useUuiContext } from '@epam/uui-core';

import {
    ModalBlocker,
    ModalFooter,
    ModalHeader,
    ModalWindow,
    FlexRow,
    Panel,
    ScrollBars,
    Text,
    Button,
    WarningNotification,
} from '@epam/uui';
import css from './styles.module.scss';

function FirstModal(props: IModal<string>) {
    const { uuiModals, uuiNotifications } = useUuiContext();

    const showSecondModal = () => uuiModals
        .show((secondModalProps) => <SecondModal { ...secondModalProps } />)
        .catch(() => uuiNotifications.show((notificationProps) => (
            <WarningNotification { ...notificationProps }>
                <FlexRow alignItems="center">
                    <Text>Second modal was closed</Text>
                </FlexRow>
            </WarningNotification>
        )).catch(() => null));

    return (
        <ModalBlocker
            { ...props }
            abort={ () => {
                uuiNotifications
                    .show((notificationProps) => (
                        <WarningNotification { ...notificationProps }>
                            <FlexRow alignItems="center">
                                <Text>First modal was closed by ESC</Text>
                            </FlexRow>
                        </WarningNotification>
                    ))
                    .catch(() => null);
                props.abort();
            } }
        >
            <ModalWindow>
                <Panel background="surface-main">
                    <ModalHeader title="First Modal" onClose={ props.abort } />
                    <ScrollBars hasTopShadow hasBottomShadow>
                        <FlexRow padding="24" vPadding="12">
                            <Text size="36">
                                This is the first modal. When you open a second modal from this one,
                                pressing ESC will only close the topmost (second) modal, not this one.
                                You'll see a notification showing which modal was closed.
                            </Text>
                        </FlexRow>
                    </ScrollBars>
                    <ModalFooter cx={ css.footer }>
                        <Button
                            color="primary"
                            caption="Open Second Modal"
                            onClick={ showSecondModal }
                        />
                        <Button
                            color="secondary"
                            fill="outline"
                            caption="Close First Modal"
                            onClick={ props.abort }
                        />
                    </ModalFooter>
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    );
}

function SecondModal(props: IModal<string>) {
    const { uuiNotifications } = useUuiContext();

    return (
        <ModalBlocker
            { ...props }
            abort={ () => {
                uuiNotifications
                    .show((notificationProps) => (
                        <WarningNotification { ...notificationProps }>
                            <FlexRow alignItems="center">
                                <Text>Second modal was closed by ESC</Text>
                            </FlexRow>
                        </WarningNotification>
                    ))
                    .catch(() => null);
                props.abort();
            } }
        >
            <ModalWindow>
                <Panel background="surface-main">
                    <ModalHeader title="Second Modal" onClose={ props.abort } />
                    <ScrollBars hasTopShadow hasBottomShadow>
                        <FlexRow padding="24" vPadding="12">
                            <Text size="36">
                                This is the second modal (topmost). When you press ESC,
                                only this modal will close, and the first modal will remain open.
                                You'll see a notification showing which modal was closed.
                            </Text>
                        </FlexRow>
                    </ScrollBars>
                    <ModalFooter cx={ css.footer }>
                        <Button
                            color="secondary"
                            fill="outline"
                            caption="Close Second Modal"
                            onClick={ props.abort }
                        />
                    </ModalFooter>
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    );
}

export default function NestedModalsExampleToggler() {
    const { uuiModals, uuiNotifications } = useUuiContext();

    const showFirstModal = (modalProps: IModal<unknown, any>) => (<FirstModal { ...modalProps } />);
    const handleClose = () =>
        uuiNotifications
            .show((notificationProps) => (
                <WarningNotification { ...notificationProps }>
                    <FlexRow alignItems="center">
                        <Text>First modal was closed</Text>
                    </FlexRow>
                </WarningNotification>
            ))
            .catch(() => null);

    return (
        <Button
            caption="Open Nested Modals Example"
            onClick={ () =>
                uuiModals
                    .show(showFirstModal)
                    .catch(handleClose) }
        />
    );
}
