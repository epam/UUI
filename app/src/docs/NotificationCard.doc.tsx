import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class NotificationCardDoc extends BaseDocsBlock {
    title = 'Notification Card';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/overlays/docs/notificationCard.doc.tsx',
            [UUI4]: './epam-promo/components/overlays/docs/notificationCard.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='notificationCard-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/notificationCard/Basic.example.tsx'
                />
                <DocExample
                    title='Advanced'
                    path='./examples/notificationCard/Advanced.example.tsx'
                />
            </>
        );
    }
}