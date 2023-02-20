import { LinkButton, LinkButtonMods } from '@epam/loveship';
import { DocBuilder } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import { DefaultContext, FormContext } from '../../docs';
import {
    onClickDoc,
    sizeDoc,
    textSettingsDoc,
    fontDoc,
    dropdownTogglerDoc,
    isDisabledDoc,
    basicPickerTogglerDoc,
    iconWithInfoDoc,
    iconOptionsDoc,
    colorDoc,
    iCanRedirectDoc,
} from '../../docs';

const LinkButtonDoc = new DocBuilder<ButtonProps & LinkButtonMods>({ name: 'LinkButton', component: LinkButton })
    .implements([
        onClickDoc,
        sizeDoc,
        textSettingsDoc,
        fontDoc,
        dropdownTogglerDoc,
        isDisabledDoc,
        basicPickerTogglerDoc,
        iconWithInfoDoc,
        iconOptionsDoc,
        colorDoc,
        iCanRedirectDoc,
    ])
    .prop('caption', {
        examples: [
            { value: 'Click Me', isDefault: true },
            {
                name: 'long text',
                value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa',
            },
            { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .withContexts(DefaultContext, FormContext);

export default LinkButtonDoc;
