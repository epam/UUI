import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class SpinnerDoc extends BaseDocsBlock {
    title = 'Spinner';

    override config: TDocConfig = {
        name: 'Spinner',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:SpinnerProps', component: uui.Spinner },
            [TSkin.UUI3_loveship]: { type: '@epam/uui:SpinnerProps', component: loveship.Spinner },
            [TSkin.UUI4_promo]: { type: '@epam/uui:SpinnerProps', component: promo.Spinner },
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="spinner-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/spinner/Basic.example.tsx" />
            </>
        );
    }
}
