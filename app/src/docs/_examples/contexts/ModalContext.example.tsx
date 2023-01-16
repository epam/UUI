import React from 'react';
import { FlexRow, useUuiContext } from '@epam/uui';
import { Button, RichTextView, SuccessNotification, WarningNotification } from '@epam/promo';
import { BasicModalExample } from '../modals/Basic.example';

export default function ModalContextExample() {
    const { uuiModals, uuiNotifications } = useUuiContext();

    return (
        <Button
            caption='Show modal'
            onClick={ () => uuiModals.show<React.ReactNode>((props) => <BasicModalExample { ...props } />)
                .then(result => uuiNotifications.show((props) => (
                    <SuccessNotification { ...props }>
                        <FlexRow alignItems='center'>
                            <RichTextView >{ result }</RichTextView>
                        </FlexRow>
                    </SuccessNotification>
                )))
                .catch(() => uuiNotifications.show((props) => (
                    <WarningNotification { ...props }>
                        <FlexRow alignItems='center'>
                            <RichTextView>Close action</RichTextView>
                        </FlexRow>
                    </WarningNotification>
                )))
            }
        />
    );
}