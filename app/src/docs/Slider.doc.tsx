import * as React from 'react';
import * as promo from '@epam/promo';
import * as loveship from '@epam/loveship';
import * as uui from '@epam/uui';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class SliderDoc extends BaseDocsBlock {
    title = 'Slider';

    override config: TDocConfig = {
        name: 'Slider',
        contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
        bySkin: {
            [TSkin.UUI4_promo]: { type: '@epam/uui:SliderProps', component: uui.Slider },
            [TSkin.UUI4_promo]: { type: '@epam/uui:SliderProps', component: promo.Slider },
            [TSkin.UUI3_loveship]: { type: '@epam/uui:SliderProps', component: loveship.Slider },
        },
        doc: (doc: DocBuilder<uui.SliderProps>) => {
            doc.merge('min', { examples: [{ value: 0, isDefault: true }] });
            doc.merge('max', { examples: [{ value: 100, isDefault: true }] });
            doc.merge('step', { examples: [{ value: 1, isDefault: true }] });
            doc.merge('splitAt', { examples: [{ value: 25, isDefault: true }] });
            doc.merge('value', { examples: [{ value: 10, isDefault: true }] });
            doc.merge('renderLabel', { examples: [{ name: 'Label', value: (value: number) => (value + '%') }] });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="slider-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/slider/Basic.example.tsx" />
            </>
        );
    }
}
