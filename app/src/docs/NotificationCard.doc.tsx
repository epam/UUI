import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TSkin } from '@epam/uui-docs';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';

export class NotificationCardDoc extends BaseDocsBlock {
    title = 'Notification Card';

    static override config: TDocConfig = {
        name: 'NotificationCard',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:NotificationCardProps', component: uui.NotificationCard },
            [TSkin.Electric]: { type: '@epam/uui:NotificationCardProps', component: electric.NotificationCard },
            [TSkin.Loveship]: { type: '@epam/loveship:NotificationCardProps', component: loveship.NotificationCard },
            [TSkin.Promo]: { type: '@epam/promo:NotificationCardProps', component: promo.NotificationCard },
        },
        doc: (doc: DocBuilder<uui.NotificationCardProps | loveship.NotificationCardProps| promo.NotificationCardProps>) => {
            doc.merge('clearTimer', { remountOnChange: true });
            doc.merge('refreshTimer', { remountOnChange: true });
            const getChild = (text: string) => (<uui.Text size="36">{text}</uui.Text>);
            doc.merge('children', {
                examples: [
                    { value: getChild('Warning notification'), name: 'Short', isDefault: true },
                    { value: getChild('Warning notification with some buttons and long long long long long text with blaaaaaa blaaaaaaaaaa'), name: 'Long' },
                ],
            });
            const getAction = (name: string) => ({ name, action: () => {} });
            doc.merge('actions', {
                examples: [
                    { value: [getAction('ACTION 1')], name: '1 action' },
                    { value: [getAction('ACTION 1'), getAction('ACTION 2')], name: '2 actions' },
                ],
            });
            doc.setDefaultPropExample('color', ({ value }) => value === 'info');
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
