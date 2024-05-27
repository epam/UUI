import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, DocPreviewBuilder, TDocConfig, TPreviewCellSize, TSkin } from '@epam/uui-docs';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';
import { TNotificationCardPreview } from './_types/previewIds';

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

        preview: (docPreview: DocPreviewBuilder<uui.NotificationCardProps | loveship.NotificationCardProps| promo.NotificationCardProps>) => {
            const w430_h110: TPreviewCellSize = '430-110';
            const w430_h75: TPreviewCellSize = '430-75';
            const getChild = (text: string) => (<uui.Text size="36">{text}</uui.Text>);
            const TEST_DATA = {
                valueLong: getChild('Test Test Test Test Test Test Test Test'),
                valueShort: getChild('Test'),
                callbackExample: 'callback',
                icon: 'action-account-fill.svg',
                actions1: [{ name: 'Action 1', action: () => {} }],
                actions2: [{ name: 'Action 1', action: () => {} }, { name: 'Action 2', action: () => {} }],
            };
            docPreview.add({
                id: TNotificationCardPreview['Size Variants'],
                matrix: {
                    actions: { values: [undefined, TEST_DATA.actions2] },
                    children: { values: [TEST_DATA.valueShort, TEST_DATA.valueLong] },
                    icon: { examples: [undefined, TEST_DATA.icon] },
                    onClose: { examples: [undefined, TEST_DATA.callbackExample] },
                },
                cellSize: w430_h110,
            });
            docPreview.add({
                id: TNotificationCardPreview['Color Variants'],
                matrix: {
                    children: { values: [TEST_DATA.valueShort] },
                    actions: { values: [TEST_DATA.actions1] },
                    icon: { examples: [TEST_DATA.icon] },
                    onClose: { examples: [TEST_DATA.callbackExample] },
                    color: { examples: '*' },
                },
                cellSize: w430_h75,
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
