import React from 'react';
import { IModal, useUuiContext } from '@epam/uui-core';
import { demoData } from '@epam/uui-docs';
import {
    ModalBlocker, ModalFooter, ModalHeader, ModalWindow, FlexRow, FlexSpacer, Panel, ScrollBars, Text, Button,
} from '@epam/promo';

function ModalWithDisabledClickOutsideAndCross(props: IModal<string>) {
    return (
        <ModalBlocker disallowClickOutside { ...props } disableCloseByEsc={ true }>
            <ModalWindow>
                <Panel background="white">
                    <ModalHeader title="Simple modal example " />
                    <ScrollBars hasTopShadow hasBottomShadow>
                        <FlexRow padding="24" vPadding="12">
                            <Text size="36">
                                {' '}
                                {demoData.loremIpsum}
                                {' '}
                            </Text>
                        </FlexRow>
                    </ScrollBars>
                    <ModalFooter>
                        <FlexSpacer />
                        <Button color="gray" fill="white" caption="Cancel" onClick={ () => props.abort() } />
                        <Button color="green" caption="Ok" onClick={ () => props.success('Success action') } />
                    </ModalFooter>
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    );
}

export default function DisableClickOutsideAndCrossExampleToggler() {
    const { uuiModals } = useUuiContext();
    return (
        <Button
            caption="Show modal"
            onClick={
                () => uuiModals
                    .show((props) => <ModalWithDisabledClickOutsideAndCross { ...props } />)
                    .catch(() => {})
            }
        />
    );
}
