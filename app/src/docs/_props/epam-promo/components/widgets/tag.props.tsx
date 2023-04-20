import { Tag } from '@epam/promo';
import { TagMods } from '@epam/uui';
import { basicPickerTogglerDoc, DocBuilder, dropdownTogglerDoc, onClickDoc } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import { FormContext, ResizableContext, DefaultContext } from '../../docs';
import { iconDoc, iconOptionsDoc } from '../../docs';

const tagDoc = new DocBuilder<ButtonProps & TagMods>({ name: 'Tag', component: Tag })
    .implements([iconDoc, iconOptionsDoc, dropdownTogglerDoc, onClickDoc, basicPickerTogglerDoc])
    .prop('caption', {
        examples: [
            { value: 'Simple Tag', isDefault: true },
            { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
            { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .prop('count', { examples: [0, 1, 5, 88, 123], defaultValue: 123 })
    .prop('size', { examples: ['18', '24', '30', '36', '42', '48'], defaultValue: '36' })
    .withContexts(DefaultContext, FormContext, ResizableContext);

export default tagDoc;
