import { Avatar, AvatarProps } from '@epam/uui-components';
import { DocBuilder } from '@epam/uui-docs';
import { DefaultContext } from '../../docs';

const AvatarDoc = new DocBuilder<AvatarProps>({ name: 'Avatar', component: Avatar })
    .prop('img', {
        examples: [
            {
                name: 'Olivia',
                value: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4',
                isDefault: true,
            },
        ],
        isRequired: true,
    })
    .prop('size', {
        examples: [
            '12', '18', '24', '36', { name: '48', value: '48', isDefault: true }, '54', '60', '72', '78', '90', '144',
        ],
        isRequired: true,
        defaultValue: '48',
    })
    .prop('isLoading', {
        examples: [true],
    })
    .withContexts(DefaultContext);

export default AvatarDoc;
