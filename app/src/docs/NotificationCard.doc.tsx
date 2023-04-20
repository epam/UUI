import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4, UUI } from '../common';

export class NotificationCardDoc extends BaseDocsBlock {
    title = 'Notification Card';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/overlays/notificationCard.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/overlays/notificationCard.props.tsx',
            [UUI]: './app/src/docs/_props/uui/components/overlays/notificationCard.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="notificationCard-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/notificationCard/Basic.example.tsx" />
                <DocExample title="Advanced" path="./_examples/notificationCard/Advanced.example.tsx" />
            </>
        );
    }
}
