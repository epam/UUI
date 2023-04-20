import { LinkButton, LinkButtonMods } from '@epam/promo';
import { DocBuilder } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import {
    onClickDoc,
    sizeDoc,
    dropdownTogglerDoc,
    isDisabledDoc,
    basicPickerTogglerDoc,
    iconWithInfoDoc,
    iconOptionsDoc,
    iCanRedirectDoc,
    DefaultContext,
    FormContext,
} from '../../docs';

const LinkButtonDoc = new DocBuilder<ButtonProps & LinkButtonMods>({ name: 'LinkButton', component: LinkButton })
    .implements([onClickDoc, sizeDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iconWithInfoDoc, iconOptionsDoc, iCanRedirectDoc])
    .prop('caption', {
        examples: [
            { value: 'Click Me', isDefault: true },
            { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
            { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .withContexts(DefaultContext, FormContext);

export default LinkButtonDoc;
