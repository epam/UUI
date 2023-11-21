import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class MultiSwitchDoc extends BaseDocsBlock {
    title = 'MultiSwitch';

    override config: TDocConfig = {
        name: 'MultiSwitch',
        contexts: [TDocContext.Default, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:MultiSwitchProps', component: uui.MultiSwitch },
            [TSkin.UUI3_loveship]: { type: '@epam/loveship:MultiSwitchProps', component: loveship.MultiSwitch },
            [TSkin.UUI4_promo]: { type: '@epam/promo:MultiSwitchProps', component: promo.MultiSwitch },
        },
        doc: (doc: DocBuilder<uui.MultiSwitchProps<any>>) => {
            doc.merge('size', { defaultValue: '36' });
            doc.merge('value', { editorType: 'JsonView', examples: [] });

            const contextSwitch = [{ id: 1, caption: 'Form' }, { id: 2, caption: 'Default' }, { id: 3, caption: 'Resizable' }];
            const toggleSwitch = [{ id: 1, caption: 'On' }, { id: 2, caption: 'Off' }];
            doc.merge('items', {
                examples: [
                    { name: JSON.stringify(contextSwitch), value: contextSwitch, isDefault: true },
                    { name: JSON.stringify(toggleSwitch), value: toggleSwitch },
                ],
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="multiSwitch-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/multiSwitch/Basic.example.tsx" />
            </>
        );
    }
}
