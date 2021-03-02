import { Tag, allFillStyles, TagMods } from '../../../components/index';
import { DocBuilder } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import { DefaultContext, FormContext, GridContext, ResizableContext  } from '../../../docs/index';
import { fontDoc, iconDoc, iconOptionsDoc, basicPickerTogglerDoc, colorDoc } from '../../../docs/index';

const tagDoc = new DocBuilder<ButtonProps & TagMods>({ name: 'Tag', component: Tag })
    .implements([fontDoc, colorDoc, iconDoc, basicPickerTogglerDoc, iconOptionsDoc] as any)
    .prop('caption', { examples: [
        { value: 'Tag', isDefault: true },
        { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
        { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    ], type: 'string' })
    .prop('size', { examples : ['18', '24', '30', '36'], defaultValue: '18' })
    .prop('fill', { examples: allFillStyles.filter(fill => fill !== 'light'), defaultValue: 'solid' })
    .prop('count', { examples: [0, 1, 5, 88, 123] })
    .withContexts(DefaultContext, FormContext, ResizableContext, GridContext);

export = tagDoc;