import React from 'react';
import { IModal, useUuiContext } from '@epam/uui-core';
import { demoData } from '@epam/uui-docs';
import { ModalBlocker, ModalFooter, ModalHeader, ModalWindow, FlexRow, FlexSpacer, Panel, ScrollBars, Text, Button } from '@epam/uui';

function ModalWithDisabledClickOutsideAndCross(props: IModal<string>) {
    return (
        <ModalBlocker disallowClickOutside { ...props } disableCloseByEsc={ true }>
            <ModalWindow>
                <Panel background="surface-main">
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
                        <Button color="secondary" fill="outline" caption="Cancel" onClick={ () => props.abort() } />
                        <Button color="accent" caption="Ok" onClick={ () => props.success('Success action') } />
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
