import { Tag, allFillStyles, TagMods } from '@epam/loveship';
import { DocBuilder, dropdownTogglerDoc } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import { DefaultContext, FormContext, ResizableContext } from '../../docs';
import { iconDoc, iconOptionsDoc, basicPickerTogglerDoc } from '../../docs';

const tagDoc = new DocBuilder<ButtonProps & TagMods>({ name: 'Tag', component: Tag })
    .implements([iconDoc, basicPickerTogglerDoc, dropdownTogglerDoc, iconOptionsDoc])
    .prop('caption', {
        examples: [
            { value: 'Tag', isDefault: true },
            { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
            { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .prop('fill', { examples: allFillStyles.filter((fill) => fill !== 'light'), defaultValue: 'solid' })
    .prop('count', { examples: [0, 1, 5, 88, 123] })
    .prop('size', { examples: ['18', '24', '30', '36', '42', '48'], defaultValue: '18' })
    .withContexts(DefaultContext, FormContext, ResizableContext);

export default tagDoc;
