import { DocItem } from '../_types/docItem';

export const InternationalizationDocItem: DocItem = {
    id: 'internationalization',
    name: 'Internationalization',
    parentId: 'advanced',
    examples: [
        { descriptionPath: 'internationalization-intro' },
        { name: 'Right-to-left support(RTL)', componentPath: './_examples/i18n/Rtl.example.tsx' },
    ],
};
