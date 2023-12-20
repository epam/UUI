import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';

export class LinkButtonDoc extends BaseDocsBlock {
    title = 'Link Button';

    override config: TDocConfig = {
        name: 'LinkButton',
        contexts: [TDocContext.Default, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:LinkButtonProps', component: uui.LinkButton },
            [TSkin.Electric]: { type: '@epam/uui:LinkButtonProps', component: electric.LinkButton },
            [TSkin.Loveship]: { type: '@epam/loveship:LinkButtonProps', component: loveship.LinkButton },
            [TSkin.Promo]: { type: '@epam/promo:LinkButtonProps', component: promo.LinkButton },
        },
        doc: (doc: DocBuilder<promo.LinkButtonProps | loveship.LinkButtonProps | uui.LinkButtonProps>) => {
            doc.merge('iconPosition', { defaultValue: 'left' });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="link-button-descriptions" />
                {this.renderSectionTitle('Overview')}
                <DocExample title="Link Button" path="./_examples/linkButton/Default.example.tsx" />

                <DocExample title="Sizes" path="./_examples/linkButton/Size.example.tsx" />

                <DocExample title="Icon Positions" path="./_examples/linkButton/IconPosition.example.tsx" />

                {this.renderSectionTitle('Examples')}
                <DocExample title="Secondary action in small footer" path="./_examples/common/Card.example.tsx" />

                <DocExample title="Sorting" path="./_examples/linkButton/Sorting.example.tsx" />
            </>
        );
    }
}
