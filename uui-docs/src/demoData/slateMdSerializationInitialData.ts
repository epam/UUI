export const slateMdSerializationInitialData = [
    {
        data: {
            checked: false,
        },
        type: 'paragraph',
        children: [
            {
                text: 'Bullet lists:',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        data: {},
        type: 'unordered-list',
        children: [
            {
                data: {},
                type: 'list-item',
                children: [
                    {
                        data: {
                            checked: false,
                        },
                        type: 'list-item-child',
                        children: [
                            {
                                text: "Type '- ' to start the list",
                                'uui-richTextEditor-span-mark': true,
                            },
                        ],
                    },
                ],
            },
            {
                data: {},
                type: 'list-item',
                children: [
                    {
                        data: {
                            checked: false,
                        },
                        type: 'list-item-child',
                        children: [
                            {
                                text: "You can create multi-level lists with 'tab' / 'shift+tab'. Example:",
                                'uui-richTextEditor-span-mark': true,
                            },
                        ],
                    },
                    {
                        data: {},
                        type: 'unordered-list',
                        children: [
                            {
                                data: {},
                                type: 'list-item',
                                children: [
                                    {
                                        data: {
                                            checked: false,
                                        },
                                        type: 'list-item-child',
                                        children: [
                                            {
                                                text: 'Level 2',
                                                'uui-richTextEditor-span-mark': true,
                                            },
                                        ],
                                    },
                                    {
                                        data: {},
                                        type: 'unordered-list',
                                        children: [
                                            {
                                                data: {},
                                                type: 'list-item',
                                                children: [
                                                    {
                                                        data: {
                                                            checked: false,
                                                        },
                                                        type: 'list-item-child',
                                                        children: [
                                                            {
                                                                text: 'Level 3',
                                                                'uui-richTextEditor-span-mark': true,
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        data: {
            checked: false,
        },
        type: 'paragraph',
        children: [
            {
                text: "There's also support 3 levels of headers, hyperlinks, superscript, and more.",
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        data: {},
        type: 'paragraph',
        children: [
            {
                text: '',
            },
        ],
    },
];
