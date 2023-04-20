import { LinkButton, LinkButtonMods } from '@epam/uui';
import { DocBuilder } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import { DefaultContext } from '../../docs';
import {
    onClickDoc, sizeDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iconOptionsDoc, iCanRedirectDoc,
} from '../../docs';

const LinkButtonDoc = new DocBuilder<ButtonProps & LinkButtonMods>({ name: 'LinkButton', component: LinkButton })
    .implements([
        onClickDoc,
        sizeDoc,
        dropdownTogglerDoc,
        isDisabledDoc,
        basicPickerTogglerDoc,
        iconOptionsDoc,
        iCanRedirectDoc,
    ] as any)
    .prop('caption', {
        examples: [
            { value: 'Click Me', isDefault: true },
            { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
            { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .withContexts(DefaultContext);

export default LinkButtonDoc;
