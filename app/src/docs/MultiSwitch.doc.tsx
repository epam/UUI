import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { COLOR_MAP, DocBuilder, getColorPickerComponent, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';
import { getCurrentTheme } from '../helpers';

export class MultiSwitchDoc extends BaseDocsBlock {
    title = 'MultiSwitch';

    static override config: TDocConfig = {
        name: 'MultiSwitch',
        contexts: [TDocContext.Default, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:MultiSwitchProps', component: uui.MultiSwitch },
            [TSkin.Loveship]: { type: '@epam/loveship:MultiSwitchProps', component: loveship.MultiSwitch },
            [TSkin.Promo]: { type: '@epam/promo:MultiSwitchProps', component: promo.MultiSwitch },
            [TSkin.Electric]: { type: '@epam/uui:MultiSwitchProps', component: electric.MultiSwitch },
        },
        doc: (doc: DocBuilder<uui.MultiSwitchProps<any>>) => {
            doc.merge('size', { defaultValue: '36' });
            doc.merge('value', { examples: [1, 2, 3] });
            const contextSwitch = [{ id: 1, caption: 'Form' }, { id: 2, caption: 'Default' }, { id: 3, caption: 'Resizable' }];
            const toggleSwitch = [{ id: 1, caption: 'On' }, { id: 2, caption: 'Off' }];
            doc.merge('items', {
                examples: [
                    { name: JSON.stringify(contextSwitch), value: contextSwitch, isDefault: true },
                    { name: JSON.stringify(toggleSwitch), value: toggleSwitch },
                ],
            });
            doc.merge('color', {
                editorType: getColorPickerComponent({
                    ...COLOR_MAP,
                    gray: `var(--uui-${getCurrentTheme() === 'loveship_dark' ? 'neutral-50' : 'neutral-60'})`,
                    gray50: 'var(--uui-neutral-60)',
                }),
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
