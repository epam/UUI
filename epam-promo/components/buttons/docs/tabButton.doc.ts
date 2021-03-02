import { TabButton, TabButtonMods } from '../TabButton';
import { DocBuilder } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import { onClickDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iCanRedirectDoc, iconDoc, iconOptionsDoc } from '../../../docs';
import { TabButtonContext } from '../../../docs';

const TabButtonDoc = new DocBuilder<TabButtonMods & ButtonProps>({ name: 'TabButton', component: TabButton as React.ComponentClass<any> })
    .implements([onClickDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iCanRedirectDoc, iconDoc, iconOptionsDoc] as any)
    .prop('caption', { examples:  [
        { value: 'Click me', isDefault: true },
        { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
        { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    ], type: 'string' })
    .prop('size', { examples: (['36', '48', '60']), defaultValue: '48' })
    .prop('withNotify', { examples: ([true, false]) })
    .prop('count', { examples: [0, 1, 5, 88, 123] })
    .withContexts(TabButtonContext);

export = TabButtonDoc;