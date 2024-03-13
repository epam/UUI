import * as React from 'react';
import * as uui from '@epam/uui';
import * as electric from '@epam/electric';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

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
