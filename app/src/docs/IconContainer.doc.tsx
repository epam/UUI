import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { ReactComponent as ActionIcon } from '@epam/assets/icons/action-account-fill.svg';
import { DocItem } from '../documents/structure';

export const iconContainerExplorerConfig: TDocConfig = {
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
        doc.merge('size', { editorType: 'StringEditor' });
        doc.setDefaultPropExample('icon', ({ value }) => value === ActionIcon);
        doc.setDefaultPropExample('onClick', () => true);
    },
};

export const IconContainerDocItem: DocItem = {
    id: 'iconContainer',
    name: 'Icon Container',
    parentId: 'components',
    examples: [
        { descriptionPath: 'iconContainer-descriptions' },
        { name: 'Basic', componentPath: './_examples/iconContainer/Basic.example.tsx' },
    ],
    explorerConfig: iconContainerExplorerConfig,
};
