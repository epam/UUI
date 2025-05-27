import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocPreviewBuilder, TDocConfig, TDocContext, TPreviewMatrix, TSkin } from '@epam/uui-docs';
import { TSwitchPreview } from './_types/previewIds';
import { DocItem } from '../documents/structure';

export const switchExplorerConfig: TDocConfig = {
    name: 'Switch',
    contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:SwitchProps', component: uui.Switch },
        [TSkin.Electric]: { type: '@epam/uui:SwitchProps', component: electric.Switch },
        [TSkin.Loveship]: { type: '@epam/uui:SwitchProps', component: loveship.Switch },
        [TSkin.Promo]: { type: '@epam/uui:SwitchProps', component: promo.Switch },
    },
    preview: (docPreview: DocPreviewBuilder<uui.SwitchProps>) => {
        const TEST_DATA = {
            label: 'Test',
        };
        type TMatrixLocal = TPreviewMatrix<uui.SwitchProps>;
        const statesBaseMatrix: TMatrixLocal = {
            isDisabled: { values: [false, true] },
            isReadonly: { values: [false, true], condition: (props) => !props.isDisabled },
        };
        docPreview.add({
            id: TSwitchPreview['Size Variants'],
            matrix: {
                value: { values: [true, false] },
                size: { examples: '*' },
                label: { values: [TEST_DATA.label, undefined] },
            },
            cellSize: '100-40',
        });
        docPreview.add({
            id: TSwitchPreview['States'],
            matrix: {
                value: { values: [true, false] },
                size: { values: ['24'] },
                label: { values: [TEST_DATA.label] },
                ...statesBaseMatrix,
            },
            cellSize: '100-40',
        });
    },
};

export const SwitchDocItem: DocItem = {
    id: 'switch',
    name: 'Switch',
    parentId: 'components',
    examples: [
        { descriptionPath: 'switch-descriptions' },
        { name: 'Basic', componentPath: './_examples/switch/Basic.example.tsx' },
    ],
    explorerConfig: switchExplorerConfig,
};
