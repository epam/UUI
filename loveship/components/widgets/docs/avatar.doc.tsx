import { Avatar, AvatarProps } from '@epam/uui-components';
import { DocBuilder } from '@epam/uui-docs';
import { FormContext, GridContext, ResizableContext, DefaultContext } from '../../../docs/index';

const AvatarDoc = new DocBuilder<AvatarProps>({ name: 'Avatar', component: Avatar })
    .prop('img', {
        examples: [
            {
                name: 'Olivia',
                value: 'https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50',
                isDefault: true,
            },
        ],
        isRequired: true,
    })
    .prop('size', {
        examples: ['24', '36', { name: '48', value: '48', isDefault: true }, '144'],
    })
    .prop('isLoading', {
        examples: [true],
    })
    .withContexts(DefaultContext);

export = AvatarDoc;