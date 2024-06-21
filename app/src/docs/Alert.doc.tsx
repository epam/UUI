import * as React from 'react';
import * as uui from '@epam/uui';
import * as electric from '@epam/electric';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, DocPreviewBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';
import { TAlertPreview } from './_types/previewIds';
import { ReactComponent as ActionIcon } from '@epam/assets/icons/action-account-fill.svg';

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
                    { name: '1 action', value: [{ name: 'ACTION 1', action: () => alert('Action 1') }] },
                    { name: '2 actions', value: [{ name: 'ACTION 1', action: () => alert('Action 1') }, { name: 'ACTION 2', action: () => alert('Action 2') }], isDefault: true },
                ],
            });
            doc.setDefaultPropExample('onClose', () => true);
            doc.setDefaultPropExample('icon', ({ value }) => value === ActionIcon);
        },
        preview: (docPreview: DocPreviewBuilder<uui.AlertProps | loveship.AlertProps | promo.AlertProps>) => {
            const TEST_DATA = {
                icon: 'action-account-fill.svg',
                actions1: '1 action',
                actions2: '2 actions',
                children1line: <uui.Text size="30">Test Test</uui.Text>,
                children2lines: (<uui.Text size="30">Notification with some buttons and long text</uui.Text>),
            };
            docPreview.add({
                id: TAlertPreview['Color Variants'],
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
                id: TAlertPreview['Layout'],
                matrix: [
                    {
                        children: { values: [TEST_DATA.children2lines] },
                        actions: { examples: [TEST_DATA.actions2] },
                        size: { examples: '*' },
                        color: { examples: ['info'] },
                        icon: { examples: [TEST_DATA.icon] },
                        onClose: { examples: ['callback', undefined] },
                    },
                    {
                        children: { values: [TEST_DATA.children1line] },
                        actions: { examples: [TEST_DATA.actions1] },
                        size: { examples: '*' },
                        color: { examples: ['info'] },
                        icon: { examples: [TEST_DATA.icon, undefined] },
                        onClose: { examples: ['callback', undefined] },
                    },
                ],
                context: TDocContext.Block,
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
