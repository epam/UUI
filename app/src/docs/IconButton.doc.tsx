import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class IconButtonDoc extends BaseDocsBlock {
    title = 'Icon Button';

    override config: TDocConfig = {
        name: 'IconButton',
        contexts: [TDocContext.Default, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:IconButtonProps', component: uui.IconButton },
            [TSkin.Loveship]: { type: '@epam/loveship:IconButtonProps', component: loveship.IconButton },
            [TSkin.Promo]: { type: '@epam/promo:IconButtonProps', component: promo.IconButton },
        },
        doc: (doc: DocBuilder<promo.IconButtonProps | loveship.IconButtonProps| uui.IconButtonProps>) => {
            doc.merge('iconPosition', { defaultValue: 'left' });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="icon-button-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/iconButton/Basic.example.tsx" />
            </>
        );
    }
}
