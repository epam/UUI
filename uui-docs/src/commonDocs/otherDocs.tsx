import {
    ICanRedirect,
    IHasLabel,
    IEditable,
    ICanBeActive,
} from '@epam/uui-core';
import { DocBuilder } from '../DocBuilder';

export const iCanRedirectDoc = new DocBuilder<ICanRedirect>({ name: 'Icon' })
    .prop('link', {
        examples: [
            { name: '/home', value: { pathname: '/home' } },
            { name: '/demo', value: { pathname: '/demo', query: { id: 'form' } } },
        ],
        editorType: 'LinkEditor',
    })
    .prop('href', {
        examples: [
            { name: 'EPAM', value: 'https://www.epam.com' }, { name: 'Google', value: 'https://google.com' },
        ],
        editorType: 'StringWithExamplesEditor',
    })
    .prop('target', { examples: ['_blank'] });

export const iCanBeActiveDoc = new DocBuilder<ICanBeActive>({ name: '' })
    .prop('isActive', { examples: [true] })
    .prop('isLinkActive', { examples: [true], description: 'Depricated' });

export const iHasLabelDoc = new DocBuilder<IHasLabel>({ name: 'Label' }).prop('label', {
    examples: [
        { value: 'Some label', isDefault: true }, { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' }, { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    ],
    editorType: 'StringWithExamplesEditor',
});

export const IControlled = new DocBuilder<IEditable<unknown>>({ name: 'onValueChange' })
    .prop('onValueChange', { examples: (ctx) => [{ value: ctx.getChangeHandler('onValueChange'), name: '(newValue) => { ... }', isDefault: true }], isRequired: true,
    });
