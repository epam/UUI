import { Badge, BadgeMods, BadgeProps } from '@epam/loveship';
import {
    basicPickerTogglerDoc, DocBuilder, dropdownTogglerDoc, onClickDoc,
} from '@epam/uui-docs';
import {
    badgeColorDoc, DefaultContext, FormContext, iconDoc, iconOptionsDoc, ResizableContext,
} from '../../docs';
import { allBorderStyles } from '@epam/loveship';

const badgeDoc = new DocBuilder<BadgeProps & BadgeMods>({ name: 'Badge', component: Badge })
    .implements([
        badgeColorDoc,
        iconDoc,
        iconOptionsDoc,
        dropdownTogglerDoc,
        onClickDoc,
        basicPickerTogglerDoc,
    ])
    .prop('caption', {
        examples: [
            { value: 'Badge', isDefault: true }, { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' }, { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .prop('count', {
        examples: [
            0, 1, 5, 88, 123,
        ],
    })
    .prop('fill', {
        examples: [
            'solid', 'white', 'semitransparent', 'transparent', 'none',
        ],
        defaultValue: 'solid',
    })
    .prop('shape', { examples: allBorderStyles, defaultValue: 'square' })
    .prop('size', {
        examples: [
            '12', '18', '24', '30', '36', '42', '48',
        ],
        defaultValue: '18',
    })
    .withContexts(DefaultContext, FormContext, ResizableContext);

export default badgeDoc;
