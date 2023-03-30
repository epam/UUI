import { LinkButton, LinkButtonMods } from '@epam/loveship';
import { DocBuilder } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import { DefaultContext, FormContext } from '../../docs';
import { onClickDoc, sizeDoc, fontDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iconWithInfoDoc, iconOptionsDoc, iCanRedirectDoc } from '../../docs';

const LinkButtonDoc = new DocBuilder<ButtonProps & LinkButtonMods>({ name: 'LinkButton', component: LinkButton })
    .implements([onClickDoc, sizeDoc, fontDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iconWithInfoDoc, iconOptionsDoc, iCanRedirectDoc])
    .prop('caption', { examples: [
        { value: 'Click Me', isDefault: true },
        { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
        { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    ], type: 'string' })
    .withContexts(DefaultContext, FormContext);

export default LinkButtonDoc;
