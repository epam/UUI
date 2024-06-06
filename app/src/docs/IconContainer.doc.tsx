import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';
import { ReactComponent as ActionIcon } from '@epam/assets/icons/action-account-fill.svg';

export class IconContainerDoc extends BaseDocsBlock {
    title = 'Icon Container';

    static override config: TDocConfig = {
        name: 'IconContainer',
        contexts: [TDocContext.Default, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui-components:ControlIconProps', component: uui.IconContainer },
            [TSkin.Electric]: { type: '@epam/uui-components:ControlIconProps', component: electric.IconContainer },
            [TSkin.Loveship]: { type: '@epam/uui-components:ControlIconProps', component: loveship.IconContainer },
            [TSkin.Promo]: { type: '@epam/uui-components:ControlIconProps', component: promo.IconContainer },
        },
        doc: (doc: DocBuilder<uui.IconContainerProps>) => {
            doc.merge('style', { examples: [
                { value: { fill: 'tomato' }, name: '{ fill: \'tomato\' }' },
                { value: { fill: 'green' }, name: '{ fill: \'green\' }' },
            ] });
            doc.setDefaultPropExample('icon', ({ value }) => value === ActionIcon);
            doc.setDefaultPropExample('onClick', () => true);
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="iconContainer-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/iconContainer/Basic.example.tsx" />
            </>
        );
    }
}
