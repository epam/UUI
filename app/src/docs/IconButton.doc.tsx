import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, TSkin,
} from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';

export class IconButtonDoc extends BaseDocsBlock {
    title = 'Icon Button';

    override config: TDocConfig = {
        name: 'IconButton',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:IconButtonProps', component: uui.IconButton },
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:IconButtonProps',
                component: loveship.IconButton,
                doc: (doc: DocBuilder<loveship.IconButtonProps>) => doc.withContexts(loveshipDocs.FormContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/promo:IconButtonProps',
                component: promo.IconButton,
                doc: (doc: DocBuilder<promo.IconButtonProps>) => doc.withContexts(promoDocs.FormContext),
            },
        },
        doc: (doc: DocBuilder<promo.IconButtonProps | loveship.IconButtonProps>) => {
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
