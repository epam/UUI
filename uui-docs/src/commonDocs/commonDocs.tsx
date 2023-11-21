import {
    ICanRedirect,
    IHasLabel,
    IEditable,
} from '@epam/uui-core';
import { DocBuilder } from '../DocBuilder';

export const iCanRedirectDoc = new DocBuilder<ICanRedirect>({ name: 'Icon' })
    .prop('link', { examples: [{ name: '/home', value: { pathname: '/home' } }] })
    .prop('isLinkActive', { examples: [true] })
    .prop('href', { examples: ['https://uui.epam.com/', 'https://google.com'] })
    .prop('target', { examples: ['_blank'] });

export const iHasLabelDoc = new DocBuilder<IHasLabel>({ name: 'Label' }).prop('label', {
    examples: [
        { value: 'Some label', isDefault: true }, { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' }, { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    ],
    editorType: 'StringWithExamplesEditor',
});

export const iEditable = new DocBuilder<IEditable<any>>({ name: 'onValueChange' }).prop('onValueChange', {
    examples: (ctx) => [{ value: ctx.getChangeHandler('onValueChange'), name: '(newValue) => { ... }', isDefault: true }],
    isRequired: true,
});
