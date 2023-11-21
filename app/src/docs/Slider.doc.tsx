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
            [TSkin.UUI]: { type: '@epam/uui:SliderProps', component: uui.Slider },
            [TSkin.UUI4_promo]: { type: '@epam/uui:SliderProps', component: promo.Slider },
            [TSkin.UUI3_loveship]: { type: '@epam/uui:SliderProps', component: loveship.Slider },
        },
        doc: (doc: DocBuilder<uui.SliderProps>) => {
            doc.merge('min', { examples: [{ value: 0, isDefault: true }, 1, 50] });
            doc.merge('max', { examples: [{ value: 100, isDefault: true }, 200, 300] });
            doc.merge('step', { examples: [{ value: 1, isDefault: true }, 5, 10, 25, 50] });
            doc.merge('splitAt', { examples: [2, 10, 20, { value: 25, isDefault: true }, 50] });
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
