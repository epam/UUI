import { VerticalTabButton, TabButtonMods } from '@epam/loveship';
import { DocBuilder } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import {
    onClickDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iCanRedirectDoc, iconDoc, iconOptionsDoc,
} from '../../docs';
import { VerticalTabButtonContext } from '../../docs';

const TabButtonDoc = new DocBuilder<TabButtonMods & ButtonProps>({ name: 'TabButton', component: VerticalTabButton })
    .implements([
        onClickDoc,
        dropdownTogglerDoc,
        isDisabledDoc,
        basicPickerTogglerDoc,
        iCanRedirectDoc,
        iconDoc,
        iconOptionsDoc,
    ])
    .prop('caption', {
        examples: [
            { value: 'Click me', isDefault: true },
            { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
            { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .prop('size', {
        examples: [
            '60',
            '48',
            '36',
        ],
        defaultValue: '48',
    })
    .prop('withNotify', { examples: [true, false] })
    .prop('count', {
        examples: [
            0,
            1,
            5,
            88,
            123,
        ],
    })
    .prop('theme', { examples: ['light', 'dark'], defaultValue: 'light' })
    .withContexts(VerticalTabButtonContext);

export default TabButtonDoc;
