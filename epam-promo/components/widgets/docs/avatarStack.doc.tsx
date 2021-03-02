import { DocBuilder } from '@epam/uui-docs';
import { FormContext, GridContext, ResizableContext, DefaultContext } from '../../../docs/index';
import { AvatarStack, AvatarStackProps } from '../';

const AvatarStackDoc = new DocBuilder<AvatarStackProps>({ name: 'AvatarStack', component: AvatarStack })
    .prop('urlArray', {
        examples: [
            {
                name: 'Olivia',
                value: [
                    "https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50",
                    "https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50",
                    "https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50",
                ],
                isDefault: true,
            },
        ],
        isRequired: true,
    })
    .prop('avatarSize', {
        examples: ['24', '36', { name: '48', value: '48', isDefault: true }, '144'],
        isRequired: true,
    })
    .prop('direction', {
        examples: [{ name: 'left', value: 'left', isDefault: true }, 'right'],
        isRequired: true,
    })
    .withContexts(DefaultContext);

export = AvatarStackDoc;