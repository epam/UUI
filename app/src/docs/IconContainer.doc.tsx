import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';

export class IconContainerDoc extends BaseDocsBlock {
    title = 'Icon Container';

    override config: TDocConfig = {
        name: 'IconContainer',
        contexts: [TDocContext.Default, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui-components:ControlIconProps', component: uui.IconContainer },
            [TSkin.UUI3_loveship]: { type: '@epam/loveship:IconContainerProps', component: loveship.IconContainer },
            [TSkin.UUI4_promo]: { type: '@epam/promo:IconContainerProps', component: promo.IconContainer },
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
