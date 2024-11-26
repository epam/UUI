export const slateInitialValue = [
    {
        type: 'uui-richTextEditor-header-1',
        data: {},
        children: [
            {
                text: 'Rich Text Editor',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        type: 'uui-richTextEditor-header-3',
        data: {},
        children: [
            {
                text: 'Introduction',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        type: 'paragraph',
        data: {},
        children: [
            {
                text: '@epam/uui-editor package contains a full-featured Rich Text Editor, based on open-source ',
                'uui-richTextEditor-span-mark': true,
            },
            {
                type: 'link',
                data: {},
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
        type: 'paragraph',
        data: {},
        children: [
            {
                text: 'Unlikely to most Rich-Text editors, Slate uses JSON data model instead of HTML, which allows it to embed any entities, like arbitrary React components. For example, this checkbox, is a custom react component (check ',
                'uui-richTextEditor-span-mark': true,
            },
            {
                type: 'link',
                data: {},
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
        type: 'toDoItem',
        data: {
            checked: false,
        },
        children: [
            {
                text: ' An item',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        type: 'paragraph',
        data: {
            checked: false,
        },
        children: [
            {
                text: 'We include HTML to Slate JSON converter, which is also used to convert pasted HTML.',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        type: 'uui-richTextEditor-header-2',
        data: {
            checked: false,
        },
        children: [
            {
                text: 'Out of the box components',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        type: 'uui-richTextEditor-header-3',
        data: {
            checked: false,
        },
        children: [
            {
                text: 'Basic layout',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        type: 'paragraph',
        data: {
            checked: false,
        },
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
        type: 'paragraph',
        data: {
            checked: false,
        },
        children: [
            {
                text: 'Numbered lists:',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        type: 'ordered-list',
        data: {},
        children: [
            {
                type: 'list-item',
                data: {},
                children: [
                    {
                        type: 'list-item-child',
                        data: {
                            checked: false,
                        },
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
                type: 'list-item',
                data: {},
                children: [
                    {
                        type: 'list-item-child',
                        data: {
                            checked: false,
                        },
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
        type: 'paragraph',
        data: {
            checked: false,
        },
        children: [
            {
                text: 'Bullet lists:',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        type: 'unordered-list',
        data: {},
        children: [
            {
                type: 'list-item',
                data: {},
                children: [
                    {
                        type: 'list-item-child',
                        data: {
                            checked: false,
                        },
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
                type: 'list-item',
                data: {},
                children: [
                    {
                        type: 'list-item-child',
                        data: {
                            checked: false,
                        },
                        children: [
                            {
                                text: "You can create multi-level lists with 'tab' / 'shift+tab'. Example:",
                                'uui-richTextEditor-span-mark': true,
                            },
                        ],
                    },
                    {
                        type: 'unordered-list',
                        data: {},
                        children: [
                            {
                                type: 'list-item',
                                data: {},
                                children: [
                                    {
                                        type: 'list-item-child',
                                        data: {
                                            checked: false,
                                        },
                                        children: [
                                            {
                                                text: 'Level 2',
                                                'uui-richTextEditor-span-mark': true,
                                            },
                                        ],
                                    },
                                    {
                                        type: 'unordered-list',
                                        data: {},
                                        children: [
                                            {
                                                type: 'list-item',
                                                data: {},
                                                children: [
                                                    {
                                                        type: 'list-item-child',
                                                        data: {
                                                            checked: false,
                                                        },
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
        type: 'paragraph',
        data: {
            checked: false,
        },
        children: [
            {
                text: "There's also support 3 levels of headers, hyperlinks, superscript, and more.",
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        type: 'uui-richTextEditor-header-3',
        data: {
            checked: false,
        },
        children: [
            {
                text: 'Embedded content',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        type: 'paragraph',
        data: {
            checked: false,
        },
        children: [
            {
                text: 'Files can be dropped directly into the editor. You can embed images (align and resizing is supported):',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        type: 'image',
        data: {
            size: 77236,
            path: '/static/uploads/blue-orange.jpg',
            fileName: 'blue-orange.jpg',
            name: 'blue-orange.jpg',
            type: 'image',
            id: '100500',
        },
        url: '/static/uploads/blue-orange.jpg',
        align: 'center',
        width: 800,
        height: 417,
        children: [
            {
                text: '',
                'uui-richTextEditor-span-mark': true,
            },
        ],
        caption: [
            {
                text: 'Image caption',
            },
        ],
    },
    {
        type: 'paragraph',
        data: {
            checked: false,
        },
        children: [
            {
                text: 'Video:',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        type: 'iframe',
        data: {},
        url: 'https://www.youtube.com/embed/5qap5aO4i9A',
        children: [
            {
                text: '',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        type: 'paragraph',
        data: {
            checked: false,
        },
        children: [
            {
                text: 'Arbitrary attachments:',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        type: 'attachment',
        data: {
            path: '/static/uploads/DemoExcelAttachment.xlsx',
            name: 'DemoExcelAttachment.xlsx',
            size: 8669,
            id: '100500',
            type: 'attachment',
            fileName: 'DemoExcelAttachment.xlsx',
            extension: 'xlsx',
        },
        url: '/static/uploads/DemoExcelAttachment.xlsx',
        children: [
            {
                text: '',
                'uui-richTextEditor-span-mark': true,
            },
        ],
    },
    {
        type: 'paragraph',
        data: {},
        children: [
            {
                text: 'You can also embed any arbitrary content, like PDF files, directly into the document, inside IFrame.',
            },
        ],
    },
    {
        type: 'uui-richTextEditor-header-3',
        data: {},
        children: [
            {
                text: 'Tables',
            },
        ],
    },
    {
        type: 'paragraph',
        data: {},
        children: [
            {
                text: 'We provide a powerful tables plugin:',
            },
        ],
    },
    {
        type: 'table',
        data: {},
        colSizes: [
            130,
            200,
            200,
            183,
            161,
        ],
        children: [
            {
                type: 'table_row',
                data: {},
                children: [
                    {
                        type: 'table_header_cell',
                        data: {},
                        children: [
                            {
                                type: 'paragraph',
                                data: {},
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
                        data: {},
                        colSpan: 2,
                        children: [
                            {
                                type: 'paragraph',
                                data: {},
                                children: [
                                    {
                                        text: 'Name & Title',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'table_header_cell',
                        data: {},
                        children: [
                            {
                                type: 'paragraph',
                                data: {},
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
                type: 'table_row',
                data: {},
                children: [
                    {
                        type: 'table_cell',
                        data: {},
                        rowSpan: 2,
                        children: [
                            {
                                type: 'paragraph',
                                data: {},
                                children: [
                                    {
                                        text: 'RnD',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'table_cell',
                        data: {},
                        children: [
                            {
                                type: 'paragraph',
                                data: {},
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
                        data: {},
                        children: [
                            {
                                type: 'paragraph',
                                data: {},
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
                        data: {},
                        children: [
                            {
                                type: 'paragraph',
                                data: {},
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
                type: 'table_row',
                data: {},
                children: [
                    {
                        type: 'table_cell',
                        data: {},
                        children: [
                            {
                                type: 'paragraph',
                                data: {},
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
                        data: {},
                        children: [
                            {
                                type: 'paragraph',
                                data: {},
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
                        data: {},
                        children: [
                            {
                                type: 'paragraph',
                                data: {},
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
                type: 'table_row',
                data: {},
                children: [
                    {
                        type: 'table_cell',
                        data: {},
                        rowSpan: 1,
                        children: [
                            {
                                type: 'paragraph',
                                data: {},
                                children: [
                                    {
                                        text: 'People',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'table_cell',
                        data: {},
                        rowSpan: 1,
                        children: [
                            {
                                type: 'paragraph',
                                data: {},
                                children: [
                                    {
                                        text: 'Ann Chovey',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'table_cell',
                        data: {},
                        rowSpan: 1,
                        children: [
                            {
                                type: 'paragraph',
                                data: {},
                                children: [
                                    {
                                        text: 'Primary HR',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'table_cell',
                        data: {},
                        rowSpan: 1,
                        children: [
                            {
                                type: 'paragraph',
                                data: {},
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
                    },
                ],
            },
            {
                type: 'table_row',
                data: {},
                children: [
                    {
                        type: 'table_cell',
                        data: {},
                        children: [
                            {
                                type: 'paragraph',
                                data: {},
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
                        data: {},
                        colSpan: 3,
                        children: [
                            {
                                type: 'paragraph',
                                data: {},
                                children: [
                                    {
                                        text: 'Footer',
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
        type: 'uui-richTextEditor-header-3',
        data: {},
        children: [
            {
                text: 'Placeholders:',
            },
        ],
    },
    {
        type: 'paragraph',
        data: {},
        children: [
            {
                text: 'Allows to insert ',
            },
            {
                type: 'placeholder',
                data: {
                    name: 'Placeholder',
                    field: 'placeholder',
                },
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
        type: 'paragraph',
        data: {},
        children: [
            {
                text: '',
            },
        ],
    },
    {
        type: 'uui-richTextEditor-header-2',
        data: {},
        children: [
            {
                text: 'Misc features',
            },
        ],
    },
    {
        type: 'paragraph',
        data: {},
        children: [
            {
                text: 'Highlighted blocks:',
            },
        ],
    },
    {
        type: 'note-error',
        data: {},
        children: [
            {
                text: 'Danger!',
                'uui-richTextEditor-bold': true,
            },
        ],
    },
    {
        type: 'note-link',
        data: {},
        children: [
            {
                text: 'Info',
            },
        ],
    },
    {
        type: 'note-warning',
        data: {},
        children: [
            {
                text: 'Warning',
            },
        ],
    },
    {
        type: 'note-quote',
        data: {},
        children: [
            {
                text: 'Side note',
            },
        ],
    },
    {
        type: 'paragraph',
        data: {},
        children: [
            {
                text: 'Splitter:',
            },
        ],
    },
    {
        type: 'separatorBLock',
        data: {},
        children: [
            {
                text: '',
            },
        ],
    },
    {
        type: 'paragraph',
        data: {},
        children: [
            {
                text: '',
            },
        ],
    },
] as any;
