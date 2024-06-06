export const initialValue = [
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
                children: [
                    {
                        text: 'slate.js',
                        'uui-richTextEditor-span-mark': true,
                    },
                ],
                url: 'https://www.slatejs.org/',
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
                children: [
                    {
                        text: 'source here',
                        'uui-richTextEditor-span-mark': true,
                    },
                ],
                url: 'https://github.com/epam/UUI/blob/main/uui-editor/src/plugins/toDoListPlugin/ToDoItem.tsx',
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
        data: {
            checked: false,
        },
        type: 'uui-richTextEditor-header-3',
        children: [
            {
                text: 'Embedded content',
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
                text: 'Files can be dropped directly into the editor. You can embed images (align and resizing is supported):',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        data: {
            size: 77236,
            src: '/static/uploads/blue-orange.jpg',
            path: '/static/uploads/blue-orange.jpg',
            align: 'align-center',
            fileName: 'blue-orange.jpg',
            name: 'blue-orange.jpg',
            type: 'image',
            id: '100500',
            imageSize: {
                width: 800,
                height: 417,
            },
        },
        type: 'image',
        children: [
            {
                text: '',
                'uui-richTextEditor-span-mark': true,
            },
        ],
        url: '/static/uploads/blue-orange.jpg',
    },
    {
        data: {
            checked: false,
        },
        type: 'paragraph',
        children: [
            {
                text: 'Video:',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        data: {
            src: 'https://www.youtube.com/embed/5qap5aO4i9A',
        },
        type: 'iframe',
        children: [
            {
                text: '',
                'uui-richTextEditor-span-mark': true,
            },
        ],
        url: 'https://www.youtube.com/embed/5qap5aO4i9A',
    },
    {
        data: {
            checked: false,
        },
        type: 'paragraph',
        children: [
            {
                text: 'Arbitrary attachments:',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        data: {
            path: '/static/uploads/DemoExcelAttachment.xlsx',
            name: 'DemoExcelAttachment.xlsx',
            size: 8669,
            id: '100500',
            type: 'attachment',
            src: '/static/uploads/DemoExcelAttachment.xlsx',
            fileName: 'DemoExcelAttachment.xlsx',
            extension: 'xlsx',
        },
        type: 'attachment',
        children: [
            {
                text: '',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        data: {},
        type: 'paragraph',
        children: [
            {
                text: 'You can also embed any arbitrary content, like PDF files, directly into the document, inside IFrame.',
            },
        ],
    },
    {
        data: {},
        type: 'uui-richTextEditor-header-3',
        children: [
            {
                text: 'Tables',
            },
        ],
    },
    {
        data: {},
        type: 'paragraph',
        children: [
            {
                text: 'We provide a powerful tables plugin:',
            },
        ],
    },
    {
        data: {
            cellSizes: [
                130,
                200,
                200,
                183,
                161,
            ],
        },
        type: 'table',
        children: [
            {
                data: {},
                type: 'table_row',
                children: [
                    {
                        type: 'table_header_cell',
                        children: [
                            {
                                data: {},
                                type: 'paragraph',
                                children: [
                                    {
                                        text: 'Department',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'table_header_cell',
                        children: [
                            {
                                data: {},
                                type: 'paragraph',
                                children: [
                                    {
                                        text: 'Name',
                                    },
                                    {
                                        text: ' & ',
                                    },
                                    {
                                        text: 'Title',
                                    },
                                ],
                            },
                        ],
                        colSpan: 2,
                    },
                    {
                        type: 'table_header_cell',
                        children: [
                            {
                                data: {},
                                type: 'paragraph',
                                children: [
                                    {
                                        text: 'Tasks',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                data: {},
                type: 'table_row',
                children: [
                    {
                        type: 'table_cell',
                        children: [
                            {
                                data: {},
                                type: 'paragraph',
                                children: [
                                    {
                                        text: 'RnD',
                                    },
                                ],
                            },
                        ],
                        rowSpan: 2,
                    },
                    {
                        type: 'table_cell',
                        children: [
                            {
                                data: {},
                                type: 'paragraph',
                                children: [
                                    {
                                        text: 'Alice Green',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'table_cell',
                        children: [
                            {
                                data: {},
                                type: 'paragraph',
                                children: [
                                    {
                                        text: 'Design',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'table_cell',
                        children: [
                            {
                                data: {},
                                type: 'paragraph',
                                children: [
                                    {
                                        text: 'Ok',
                                        color: '#9BC837',
                                        'uui-richTextEditor-span-mark': true,
                                        'uui-richTextEditor-bold': true,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                data: {},
                type: 'table_row',
                children: [
                    {
                        type: 'table_cell',
                        children: [
                            {
                                data: {},
                                type: 'paragraph',
                                children: [
                                    {
                                        text: 'Bob Blue',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'table_cell',
                        children: [
                            {
                                data: {},
                                type: 'paragraph',
                                children: [
                                    {
                                        text: 'Developer',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'table_cell',
                        children: [
                            {
                                data: {},
                                type: 'paragraph',
                                children: [
                                    {
                                        text: 'Ok',
                                        color: '#9BC837',
                                        'uui-richTextEditor-span-mark': true,
                                        'uui-richTextEditor-bold': true,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                data: {},
                type: 'table_row',
                children: [
                    {
                        type: 'table_cell',
                        children: [
                            {
                                data: {},
                                type: 'paragraph',
                                children: [
                                    {
                                        text: 'People',
                                    },
                                ],
                            },
                        ],
                        rowSpan: 1,
                    },
                    {
                        type: 'table_cell',
                        children: [
                            {
                                data: {},
                                type: 'paragraph',
                                children: [
                                    {
                                        text: 'Ann Chovey',
                                    },
                                ],
                            },
                        ],
                        rowSpan: 1,
                    },
                    {
                        type: 'table_cell',
                        children: [
                            {
                                data: {},
                                type: 'paragraph',
                                children: [
                                    {
                                        text: 'Primary HR',
                                    },
                                ],
                            },
                        ],
                        rowSpan: 1,
                    },
                    {
                        type: 'table_cell',
                        children: [
                            {
                                data: {},
                                type: 'paragraph',
                                children: [
                                    {
                                        text: 'In progress',
                                        color: '#8A7CBB',
                                        'uui-richTextEditor-span-mark': true,
                                        'uui-richTextEditor-bold': true,
                                    },
                                ],
                            },
                        ],
                        rowSpan: 1,
                    },
                ],
            },
            {
                data: {},
                type: 'table_row',
                children: [
                    {
                        type: 'table_cell',
                        children: [
                            {
                                data: {},
                                type: 'paragraph',
                                children: [
                                    {
                                        text: '',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'table_cell',
                        children: [
                            {
                                data: {},
                                type: 'paragraph',
                                children: [
                                    {
                                        text: 'Footer',
                                    },
                                ],
                            },
                        ],
                        colSpan: 3,
                    },
                ],
            },
        ],
    },
    {
        data: {},
        type: 'uui-richTextEditor-header-3',
        children: [
            {
                text: 'Placeholders:',
            },
        ],
    },
    {
        data: {},
        type: 'paragraph',
        children: [
            {
                text: 'Allows to insert ',
            },
            {
                data: {
                    name: 'Placeholder',
                    field: 'placeholder',
                },
                type: 'placeholder',
                children: [
                    {
                        text: '',
                    },
                ],
            },
            {
                text: " into text. Can be used for editing templates, for example for emails. Placeholders can be then replaced with real values programmatically (currently that's done by some apps in back-end code).",
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
    {
        data: {},
        type: 'uui-richTextEditor-header-2',
        children: [
            {
                text: 'Misc features',
            },
        ],
    },
    {
        data: {},
        type: 'paragraph',
        children: [
            {
                text: 'Highlighted blocks:',
            },
        ],
    },
    {
        data: {},
        type: 'note-error',
        children: [
            {
                text: 'Danger!',
                'uui-richTextEditor-bold': true,
            },
        ],
    },
    {
        data: {},
        type: 'note-link',
        children: [
            {
                text: 'Info',
            },
        ],
    },
    {
        data: {},
        type: 'note-warning',
        children: [
            {
                text: 'Warning',
            },
        ],
    },
    {
        data: {},
        type: 'note-quote',
        children: [
            {
                text: 'Side note',
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
