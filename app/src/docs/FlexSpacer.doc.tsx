import { DocItem } from '../documents/structure';

export const FlexSpacerDocItem: DocItem = {
    id: 'flexSpacer',
    name: 'Flex Spacer',
    parentId: 'flexItems',
    order: 4,
    examples: [
        { descriptionPath: 'flexSpacer-description' },
        { componentPath: './_examples/flexItems/FlexSpacer.example.tsx' },
    ],
};
