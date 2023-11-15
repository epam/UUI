import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TSkin,
} from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';

export class CheckboxDoc extends BaseDocsBlock {
    title = 'Checkbox';

    override config: TDocConfig = {
        name: 'Checkbox',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:CheckboxProps', component: uui.Checkbox },
            [TSkin.UUI3_loveship]: {
                type: '@epam/uui:CheckboxProps',
                component: loveship.Checkbox,
                doc: (doc: DocBuilder<uui.CheckboxProps>) => doc.withContexts(loveshipDocs.FormContext, loveshipDocs.TableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:CheckboxProps',
                component: promo.Checkbox,
                doc: (doc: DocBuilder<uui.CheckboxProps>) => doc.withContexts(promoDocs.FormContext, promoDocs.TableContext),
            },
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
