import * as React from 'react';
import { IHasRawProps, IModal } from '@epam/uui-core';
import { ModalBlocker, ModalWindow, FlexSpacer, ModalHeader, Button, ModalFooter, Panel, ScrollBars } from '../';
import { i18n } from '../../i18n';

export interface ConfirmationModalWindowProps extends IModal<any>, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    caption: string;
    bodyContent?: any;
    hideCancelButton?: boolean;
    width?: '300' | '420' | '600' | '900';
}

export const ConfirmationModal = React.forwardRef<HTMLDivElement, ConfirmationModalWindowProps>((props, ref) => (
    <ModalBlocker ref={ ref } blockerShadow='dark' { ...props }>
        <ModalWindow width={ props.width || '420' }>
            <ModalHeader borderBottom title={ props.caption } onClose={ () => props.abort() } background='white' />
            <ScrollBars>
            { props.bodyContent && (
                <Panel margin='24'>
                    { props.bodyContent }
                </Panel>
            ) }
            </ScrollBars>
            <ModalFooter background='white' borderTop>
                <FlexSpacer />
                { props.hideCancelButton || <Button caption={ i18n.confirmationModal.discardButton } onClick={ () => props.success(false) } color='night400'/> }
                <Button caption={ i18n.confirmationModal.saveButton } onClick={ () => props.success(true) } color='grass'/>
            </ModalFooter>
        </ModalWindow>
    </ModalBlocker>
));