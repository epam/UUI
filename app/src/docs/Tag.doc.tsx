import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { COLOR_MAP, DocBuilder, getColorPickerComponent, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';
import { getCurrentTheme } from '../helpers';

export class TagDoc extends BaseDocsBlock {
    title = 'Tag';

    static override config: TDocConfig = {
        name: 'Tag',
        contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:TagProps', component: uui.Tag },
            [TSkin.Promo]: { type: '@epam/promo:TagProps', component: promo.Tag },
            [TSkin.Loveship]: { type: '@epam/loveship:TagProps', component: loveship.Tag },
            [TSkin.Electric]: { type: '@epam/electric:TagProps', component: electric.Tag },
        },
        doc: (doc: DocBuilder<loveship.TagProps | uui.TagProps | promo.TagProps | electric.TagProps >) => {
            doc.merge('iconPosition', { defaultValue: 'left' });
            doc.merge('color', {
                editorType: getColorPickerComponent({
                    ...COLOR_MAP,
                    neutral: `var(--uui-${getCurrentTheme() === 'loveship_dark' ? 'neutral-40' : 'neutral-30'})`,
                }),
            });
            doc.setDefaultPropExample('onClick', () => true);
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="tag-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/tag/Basic.example.tsx" />
                <DocExample title="Size" path="./_examples/tag/Size.example.tsx" />
                <DocExample title="Color variants" path="./_examples/tag/Colors.example.tsx" />
            </>
        );
    }
}
