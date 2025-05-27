import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, DocPreviewBuilder, TDocConfig, TSkin } from '@epam/uui-docs';
import { TCountIndicatorPreview } from './_types/previewIds';
import { DocItem } from '../documents/structure';

export const countIndicatorExplorerConfig: TDocConfig = {
    name: 'CountIndicator',
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:CountIndicatorProps', component: uui.CountIndicator },
        [TSkin.Loveship]: { type: '@epam/loveship:CountIndicatorProps', component: loveship.CountIndicator },
        [TSkin.Promo]: { type: '@epam/promo:CountIndicatorProps', component: promo.CountIndicator },
        [TSkin.Electric]: { type: '@epam/uui:CountIndicatorProps', component: electric.CountIndicator },
    },
    doc: (doc: DocBuilder<uui.CountIndicatorProps | promo.CountIndicatorProps | loveship.CountIndicatorProps>) => {
        doc.setDefaultPropExample('color', ({ value }) => value === 'neutral');
        doc.merge('caption', {
            examples: [
                { name: 'Number 99', value: '99', isDefault: true },
                { name: 'Number 1', value: '1' },
                { name: 'Number 999', value: '999+' },
            ],
        });
    },
    preview: (docPreview: DocPreviewBuilder<uui.CountIndicatorProps | promo.CountIndicatorProps | loveship.CountIndicatorProps>) => {
        docPreview.add({
            id: TCountIndicatorPreview['Color Variants'],
            matrix: {
                caption: { values: ['9'] },
                color: { examples: '*' },
            },
            cellSize: '50-40',
        });
        docPreview.add({
            id: TCountIndicatorPreview['Size Variants'],
            matrix: {
                caption: { values: ['9', '99', '+99'] },
                size: { examples: '*' },
            },
            cellSize: '60-40',
        });
    },
};

export const CountIndicatorDocItem: DocItem = {
    id: 'countIndicator',
    name: 'Count Indicator',
    parentId: 'components',
    examples: [
        { descriptionPath: 'countIndicator-descriptions' },
        { name: 'Basic', componentPath: './_examples/countIndicator/Basic.example.tsx' },
    ],
    explorerConfig: countIndicatorExplorerConfig,
};
