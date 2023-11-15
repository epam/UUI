import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder } from '@epam/uui-docs';
import { EditableDocContent, DocExample, BaseDocsBlock, TSkin } from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';

export class AlertDoc extends BaseDocsBlock {
    title = 'Alert';

    override config: TDocConfig = {
        name: 'Alert',
        bySkin: {
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:AlertProps',
                component: loveship.Alert,
                doc: (doc: DocBuilder<loveship.AlertProps>) => doc.withContextsReplace(loveshipDocs.ResizableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/promo:AlertProps',
                component: promo.Alert,
                doc: (doc: DocBuilder<promo.AlertProps>) => doc.withContextsReplace(promoDocs.ResizableContext),
            },
            [TSkin.UUI]: {
                type: '@epam/uui:AlertProps',
                component: uui.Alert,
            },
        },
        doc: (doc: DocBuilder<loveship.AlertProps | promo.AlertProps>) => {
            doc.merge('children', {
                examples: [
                    { name: 'Short', value: <uui.Text size="30">Notification Text</uui.Text>, isDefault: true },
                    { name: 'Long', value: <uui.Text size="30">Notification with some buttons and long long text</uui.Text> },
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
