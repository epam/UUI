import React from 'react';
import { Button, RichTextView, SuccessNotification, WarningNotification } from '@epam/promo';
import { BasicModalExample } from '../modals/Basic.example';
import { svc } from '@epam/uui-docs';


export default function ModalContextExample() {
    return (
        <Button
            caption='Show modal'
            onClick={ () => svc.uuiModals.show((props) => <BasicModalExample { ...props }/>)
                .then(result => svc.uuiNotifications.show((props) => <SuccessNotification { ...props }><RichTextView>{ result }</RichTextView></SuccessNotification>))
                .catch(() => svc.uuiNotifications.show((props) => <WarningNotification { ...props }><RichTextView>Close action</RichTextView></WarningNotification>))
            }
        />
    );
}