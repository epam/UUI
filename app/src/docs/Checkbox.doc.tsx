import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class CheckboxDoc extends BaseDocsBlock {
    title = 'Checkbox';

    static override config: TDocConfig = {
        name: 'Checkbox',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Table],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:CheckboxProps', component: uui.Checkbox },
            [TSkin.Loveship]: { type: '@epam/uui:CheckboxProps', component: loveship.Checkbox },
            [TSkin.Promo]: { type: '@epam/uui:CheckboxProps', component: promo.Checkbox },
            [TSkin.Electric]: { type: '@epam/uui:CheckboxProps', component: electric.Checkbox },
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="checkbox-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/checkbox/Basic.example.tsx" />
                <DocExample title="Checkbox Group" path="./_examples/checkbox/Group.example.tsx" />
            </>
        );
    }
}
