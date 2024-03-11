export const editorValueMock = [
    {
        data: {},
        type: 'uui-richTextEditor-header-1',
        children: [
            {
                text: 'Rich Text Editor',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        data: {},
        type: 'uui-richTextEditor-header-3',
        children: [
            {
                text: 'Introduction',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        data: {},
        type: 'paragraph',
        children: [
            {
                text: '@epam/uui-editor package contains a full-featured Rich Text Editor, based on open-source ',
                'uui-richTextEditor-span-mark': true,
            },
            {
                data: {
                    url: 'https://www.slatejs.org/',
                },
                type: 'link',
                url: 'https://www.slatejs.org/',
                children: [
                    {
                        text: 'slate.js',
                        'uui-richTextEditor-span-mark': true,
                    },
                ],
            },
            {
                text: " library. Slate.JS is a framework to build editors, and it's highly configurable with plugins. In UUI, we picked and tuned dozen of plugins, build several plugins ourselves, added common styles and UX on top of it. One can pick from our default set of plugins, or even introduce new, app-specific plugins, on top.",
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        data: {},
        type: 'paragraph',
        children: [
            {
                text: 'Unlikely to most Rich-Text editors, Slate uses JSON data model instead of HTML, which allows it to embed any entities, like arbitrary React components. For example, this checkbox, is a custom react component (check ',
                'uui-richTextEditor-span-mark': true,
            },
            {
                data: {
                    url: 'https://github.com/epam/UUI/blob/main/uui-editor/src/plugins/toDoListPlugin/ToDoItem.tsx',
                },
                type: 'link',
                url: 'https://github.com/epam/UUI/blob/main/uui-editor/src/plugins/toDoListPlugin/ToDoItem.tsx',
                children: [
                    {
                        text: 'source here',
                        'uui-richTextEditor-span-mark': true,
                    },
                ],
            },
            {
                text: '):',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        data: {
            checked: false,
        },
        type: 'toDoItem',
        children: [
            {
                text: ' An item',
                'uui-richTextEditor-span-mark': true,
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
                text: 'We include HTML to Slate JSON converter, which is also used to convert pasted HTML.',
                'uui-richTextEditor-span-mark': true,
                'uui-richTextEditor-code': true,
            },
        ],
    },
    {
        align: 'left',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tfGVufDB8fDB8fHww',
        children: [
            {
                text: '',
            },
        ],
        width: 503,
        data: {
            imageSize: {
                width: 503,
                height: '100%',
            },
            align: 'align-left',
        },
        caption: [
            {
                text: 'some image name',
            },
        ],
    },
    {
        data: {
            checked: false,
        },
        type: 'uui-richTextEditor-header-2',
        children: [
            {
                text: 'Out of the box components',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        data: {
            checked: false,
        },
        type: 'uui-richTextEditor-header-3',
        children: [
            {
                text: 'Basic layout',
                'uui-richTextEditor-span-mark': true,
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
                text: 'We support inline text styles: ',
                'uui-richTextEditor-span-mark': true,
            },
            {
                text: 'bold',
                'uui-richTextEditor-span-mark': true,
                'uui-richTextEditor-bold': true,
            },
            {
                text: ', ',
                'uui-richTextEditor-span-mark': true,
            },
            {
                text: 'italic',
                'uui-richTextEditor-span-mark': true,
                'uui-richTextEditor-italic': true,
            },
            {
                text: ', ',
                'uui-richTextEditor-span-mark': true,
            },
            {
                text: 'underlined,',
                'uui-richTextEditor-span-mark': true,
                'uui-richTextEditor-underlined': true,
            },
            {
                text: ' several UUI-friendly text colors: ',
                'uui-richTextEditor-span-mark': true,
            },
            {
                text: 'red',
                color: '#FF4E33',
                'uui-richTextEditor-span-mark': true,
            },
            {
                text: ', ',
                'uui-richTextEditor-span-mark': true,
            },
            {
                text: 'yellow',
                color: '#FFA21D',
                'uui-richTextEditor-span-mark': true,
            },
            {
                text: ', and ',
                'uui-richTextEditor-span-mark': true,
            },
            {
                text: 'green.',
                color: '#9BC837',
                'uui-richTextEditor-span-mark': true,
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
                text: 'Numbered lists:',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        data: {},
        type: 'ordered-list',
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
                                text: "In edit mode, we detect  '1.' and start list automatically",
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
                                text: "You can use 'tab' / 'shift/tab' to indent the list",
                                'uui-richTextEditor-span-mark': true,
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
                text: 'Splitter:',
            },
        ],
    },
    {
        data: {},
        type: 'separatorBLock',
        children: [
            {
                text: '',
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
