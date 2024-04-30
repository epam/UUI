import * as React from 'react';
import * as uui from '@epam/uui';
import * as electric from '@epam/electric';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, DocPreviewBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

enum TAlertPreview {
    Colors = 'Colors',
    'Layout with icon' = 'Layout with icon',
    'Layout without icon' = 'Layout without icon'
}

export class AlertDoc extends BaseDocsBlock {
    title = 'Alert';

    static override config: TDocConfig = {
        name: 'Alert',
        contexts: [TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:AlertProps', component: uui.Alert },
            [TSkin.Electric]: { type: '@epam/uui:AlertProps', component: electric.Alert },
            [TSkin.Loveship]: { type: '@epam/loveship:AlertProps', component: loveship.Alert },
            [TSkin.Promo]: { type: '@epam/promo:AlertProps', component: promo.Alert },
        },
        doc: (doc: DocBuilder<loveship.AlertProps | promo.AlertProps>) => {
            doc.setDefaultPropExample('color', (_, index) => index === 0);
            doc.merge('children', {
                examples: [
                    { name: 'Short', value: <uui.Text size="30">Notification Text</uui.Text>, isDefault: true },
                    { name: 'Long', value: <uui.Text size="30">Notification with some buttons and long long long long long long long long long long long text</uui.Text> },
                ],
            });
            doc.merge('actions', {
                examples: [
                    { name: '1 action', value: [{ name: 'ACTION 1', action: () => {} }] },
                    { name: '2 actions', value: [{ name: 'ACTION 1', action: () => {} }, { name: 'ACTION 2', action: () => {} }] },
                ],
            });
        },
        preview: (docPreview: DocPreviewBuilder<uui.AlertProps | loveship.AlertProps | promo.AlertProps>) => {
            const TEST_DATA = {
                icon: 'action-account-fill.svg',
                actions1: '1 action',
                actions2: '2 actions',
                children1line: <uui.Text size="30">Test Test</uui.Text>,
                // eslint-disable-next-line
                children2lines: (<uui.Text size="30">{'Test Test'}<br/>{'Test Test'}</uui.Text>),
            };
            docPreview.add({
                id: TAlertPreview.Colors,
                matrix: {
                    icon: { examples: [TEST_DATA.icon] },
                    onClose: { examples: ['callback'] },
                    actions: { examples: [TEST_DATA.actions2] },
                    size: { values: ['36'] },
                    color: { examples: '*' },
                    children: { values: [TEST_DATA.children1line] },
                },
                cellSize: '220-80',
            });
            docPreview.add({
                id: TAlertPreview['Layout with icon'],
                matrix: {
                    children: { values: [TEST_DATA.children1line, TEST_DATA.children2lines] },
                    actions: { examples: [undefined, TEST_DATA.actions1, TEST_DATA.actions2] },
                    size: { examples: '*' },
                    color: { examples: ['info'] },
                    icon: { examples: [TEST_DATA.icon] },
                    onClose: { examples: [undefined, 'callback'] },
                },
                cellSize: '260-120',
            });
            docPreview.add({
                id: TAlertPreview['Layout without icon'],
                matrix: {
                    children: { values: [TEST_DATA.children1line, TEST_DATA.children2lines] },
                    actions: { examples: [undefined, TEST_DATA.actions1, TEST_DATA.actions2] },
                    size: { examples: '*' },
                    color: { examples: ['info'] },
                    icon: { examples: [undefined] },
                    onClose: { examples: [undefined, 'callback'] },
                },
                cellSize: '260-120',
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="alert-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/alert/Basic.example.tsx" />
                <DocExample title="Sizes" path="./_examples/alert/Sizes.example.tsx" />
            </>
        );
    }
}
