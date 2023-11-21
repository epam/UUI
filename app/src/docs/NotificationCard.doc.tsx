import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TSkin } from '@epam/uui-docs';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';

export class NotificationCardDoc extends BaseDocsBlock {
    title = 'Notification Card';

    override config: TDocConfig = {
        name: 'NotificationCard',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:NotificationCardProps', component: uui.NotificationCard },
            [TSkin.UUI3_loveship]: { type: '@epam/loveship:NotificationCardProps', component: loveship.NotificationCard },
            [TSkin.UUI4_promo]: { type: '@epam/promo:NotificationCardProps', component: promo.NotificationCard },
        },
        doc: (doc: DocBuilder<uui.NotificationCardProps | loveship.NotificationCardProps| promo.NotificationCardProps>) => {
            const getChild = (text: string) => (<uui.Text size="36">{text}</uui.Text>);
            doc.merge('children', {
                examples: [
                    { value: getChild('Warning notification'), name: 'Short', isDefault: true },
                    { value: getChild('Warning notification with some buttons and long long text with blaaaaaa blaaaaaaaaaa'), name: 'Long' },
                ],
            });
            const getAction = (name: string) => ({ name, action: () => {} });
            doc.merge('actions', {
                examples: [
                    { value: [getAction('ACTION 1')], name: '1 action' },
                    { value: [getAction('ACTION 1'), getAction('ACTION 2')], name: '2 actions' },
                ],
            });
        },
    };

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
