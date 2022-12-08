import { Badge, BadgeMods } from '../../../components/index';
import { basicPickerTogglerDoc, DocBuilder, dropdownTogglerDoc, onClickDoc } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import { colorDoc, DefaultContext, FormContext, iconDoc, iconOptionsDoc, ResizableContext } from '../../../docs/index';
import { allBorderStyles } from '../../../components/types';

const badgeDoc = new DocBuilder<ButtonProps & BadgeMods>({ name: 'Badge', component: Badge })
    .implements([colorDoc, iconDoc, iconOptionsDoc, dropdownTogglerDoc, onClickDoc, basicPickerTogglerDoc])
    .prop('caption', { examples: [
        { value: 'Badge', isDefault: true },
        { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
        { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    ], type: 'string' })
    .prop('count', { examples: [0, 1, 5, 88, 123] })
    .prop('fill', { examples: ['solid', 'white', 'semitransparent', 'transparent', 'none'], defaultValue: 'solid' })
    .prop('shape', { examples: allBorderStyles, defaultValue: 'square' })
    .prop('size', { examples : ['12', '18', '24', '30', '36', '42', '48'], defaultValue: '18' })
    .withContexts(DefaultContext, FormContext, ResizableContext);

export default badgeDoc;
