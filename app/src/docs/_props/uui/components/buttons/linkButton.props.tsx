import { allLinkButtonColors, LinkButton, LinkButtonProps } from '@epam/uui';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { DefaultContext } from '../../docs';
import { onClickDoc, sizeDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iconOptionsDoc, iCanRedirectDoc,
} from '../../docs';
import * as React from 'react';

const LinkButtonDoc = new DocBuilder<LinkButtonProps>({ name: 'LinkButton', component: LinkButton })
    .implements([
        onClickDoc, sizeDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iconOptionsDoc, iCanRedirectDoc,
    ] as any)
    .prop('caption', {
        examples: [
            { value: 'Click Me', isDefault: true }, { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' }, { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .prop('color', { renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i })) } { ...editable } />, examples: allLinkButtonColors })
    .withContexts(DefaultContext);

export default LinkButtonDoc;
