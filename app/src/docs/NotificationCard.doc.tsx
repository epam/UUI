import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class NotificationCardDoc extends BaseDocsBlock {
    title = 'Notification Card';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docProps/loveship/components/overlays/notificationCard.doc.tsx',
            [UUI4]: './app/src/docProps/epam-promo/components/overlays/notificationCard.doc.tsx',
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
