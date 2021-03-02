import * as React from 'react';
import { Button, RichTextView, SuccessNotification, WarningNotification } from '@epam/promo';
import { svc } from '../../../services';
import { BasicModalExample } from '../modals/Basic.example';


export class ModalContextExample extends React.Component {
    render() {
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
}