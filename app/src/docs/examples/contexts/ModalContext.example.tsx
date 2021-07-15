import React from 'react';
import { Button, RichTextView, SuccessNotification, WarningNotification } from '@epam/promo';
import { BasicModalExample } from '../modals/Basic.example';
import { useUuiContext } from 'uui';


export default function ModalContextExample() {
    const { uuiModals, uuiNotifications } = useUuiContext();

    return (
        <Button
            caption='Show modal'
            onClick={ () => uuiModals.show((props) => <BasicModalExample { ...props }/>)
                .then(result => uuiNotifications.show((props) => <SuccessNotification { ...props }><RichTextView>{ result }</RichTextView></SuccessNotification>))
                .catch(() => uuiNotifications.show((props) => <WarningNotification { ...props }><RichTextView>Close action</RichTextView></WarningNotification>))
            }
        />
    );
}