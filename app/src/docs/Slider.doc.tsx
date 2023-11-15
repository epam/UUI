import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TSkin,
} from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';
import * as uuiDocs from './_props/uui/docs';
import * as promo from '@epam/promo';
import * as loveship from '@epam/loveship';
import * as uui from '@epam/uui';

export class SliderDoc extends BaseDocsBlock {
    title = 'Slider';

    override config: TDocConfig = {
        name: 'Slider',
        bySkin: {
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:SliderProps',
                component: uui.Slider,
                doc: (doc: DocBuilder<uui.SliderProps>) => {
                    doc.withContexts(uuiDocs.ResizableContext);
                },
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:SliderProps',
                component: promo.Slider,
                doc: (doc: DocBuilder<uui.SliderProps>) => {
                    doc.withContexts(promoDocs.ResizableContext, promoDocs.FormContext);
                },
            },
            [TSkin.UUI3_loveship]: {
                type: '@epam/uui:SliderProps',
                component: loveship.Slider,
                doc: (doc: DocBuilder<uui.SliderProps>) => {
                    doc.withContexts(loveshipDocs.ResizableContext, loveshipDocs.FormContext);
                },
            },
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
