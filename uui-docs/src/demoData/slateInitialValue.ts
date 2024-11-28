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
        type: 'uui-richTextEditor-header-2',
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
                text: 'The ',
            },
            {
                text: '@epam/uui-editor',
                'uui-richTextEditor-span-mark': true,
                'uui-richTextEditor-code': true,
            },
            {
                'uui-richTextEditor-span-mark': true,
                text: ' package contains a full-featured Rich Text Editor, based on open-source ',
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
        data: {},
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
                text: ' align with several UUI-friendly text colors: ',
                'uui-richTextEditor-span-mark': true,
            },
            {
                text: 'red',
                'uui-richTextEditor-span-mark': true,
                color: 'var(--uui-text-critical)',
            },
            {
                text: ', ',
                'uui-richTextEditor-span-mark': true,
            },
            {
                text: 'yellow',
                'uui-richTextEditor-span-mark': true,
                color: 'var(--uui-text-warning)',
            },
            {
                text: ', and ',
                'uui-richTextEditor-span-mark': true,
            },
            {
                text: 'green',
                'uui-richTextEditor-span-mark': true,
                color: 'var(--uui-text-success)',
            },
            {
                color: '#9BC837',
                'uui-richTextEditor-span-mark': true,
                text: '.',
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
                text: 'Numbered lists',
                'uui-richTextEditor-span-mark': true,
                'uui-richTextEditor-bold': true,
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
                                text: 'In edit mode, ',
                                'uui-richTextEditor-span-mark': true,
                            },
                            {
                                text: "typing '1.' automatically starts a numbered list.",
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
                                text: "You can use 'Tab' / 'Shift+Tab' to ",
                                'uui-richTextEditor-span-mark': true,
                            },
                            {
                                text: "adjust the list's indentation level.",
                            },
                        ],
                    },
                ],
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
                text: 'Bullet lists',
                'uui-richTextEditor-span-mark': true,
                'uui-richTextEditor-bold': true,
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
                                text: "Type '- ' ",
                                'uui-richTextEditor-span-mark': true,
                            },
                            {
                                text: 'to start a bullet list.',
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
                                text: 'Create multi-level lists using',
                            },
                            {
                                text: " 'Tab' / 'Shift+Tab'. Example:",
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
        type: 'h5',
        children: [
            {
                text: 'Headers and Links',
                'uui-richTextEditor-bold': true,
            },
        ],
    },
    {
        type: 'paragraph',
        children: [
            {
                text: 'We also support three levels of headers, ',
            },
            {
                type: 'link',
                url: 'https://uui.epam.com/',
                target: '_blank',
                children: [
                    {
                        text: 'hyperlinks',
                    },
                ],
            },
            {
                text: ', ',
            },
            {
                text: 'superscript',
                'uui-richTextEditor-superscript': true,
            },
            {
                text: ', and more.',
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
                text: 'You can embed various types of content into the editor:',
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
                text: 'Images',
                'uui-richTextEditor-bold': true,
            },
        ],
    },
    {
        type: 'unordered-list',
        children: [
            {
                type: 'list-item',
                children: [
                    {
                        type: 'list-item-child',
                        children: [
                            {
                                text: 'Embed images via the ',
                            },
                            {
                                text: '"Add Image"',
                                'uui-richTextEditor-bold': true,
                            },
                            {
                                text: ' icon, drag-and-drop from your computer, or insert a direct internet address link.',
                            },
                        ],
                    },
                ],
            },
            {
                type: 'list-item',
                children: [
                    {
                        type: 'list-item-child',
                        children: [
                            {
                                text: 'Images support alignment and resizing.',
                            },
                        ],
                    },
                ],
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
        width: 862,
        height: 417,
        children: [
            {
                text: '',
                'uui-richTextEditor-span-mark': true,
            },
        ],
        caption: [
            {
                text: 'Picture from a file',
            },
        ],
    },
    {
        type: 'paragraph',
        children: [
            {
                text: '',
            },
        ],
    },
    {
        align: 'center',
        url: 'https://c.files.bbci.co.uk/D8CD/production/_117310555_16.jpg',
        width: 862,
        type: 'image',
        children: [
            {
                text: '',
            },
        ],
        caption: [
            {
                text: 'Picture from the internet',
            },
        ],
    },
    {
        type: 'uui-richTextEditor-header-3',
        children: [
            {
                text: 'PDFs',
                'uui-richTextEditor-bold': true,
            },
        ],
    },
    {
        type: 'paragraph',
        children: [
            {
                text: 'Embed PDFs via the ',
            },
            {
                text: '"Add PDF" ',
                'uui-richTextEditor-bold': true,
            },
            {
                text: 'icon or drag-and-drop.',
            },
        ],
    },
    {
        type: 'iframe',
        children: [
            {
                text: '',
            },
        ],
        data: {},
        url: 'https://pdfobject.com/pdf/sample.pdf',
    },
    {
        type: 'uui-richTextEditor-header-3',
        children: [
            {
                text: 'Files',
                'uui-richTextEditor-bold': true,
            },
        ],
    },
    {
        type: 'paragraph',
        children: [
            {
                text: 'Upload arbitrary files using the ',
            },
            {
                text: '"Add Attachment"',
                'uui-richTextEditor-bold': true,
            },
            {
                text: ' icon. Files appear as downloadable links.',
            },
        ],
    },
    {
        type: 'attachment',
        data: {
            path: '/static/uploads/blue-orange.jpg',
            name: 'Excel.xlsx',
            size: 8710,
            id: 1,
            type: 'attachment',
            extension: 'xlsx',
            fileName: 'DemoExcelAttachment.xlsx',
        },
        children: [
            {
                text: '',
            },
        ],
    },
    {
        type: 'attachment',
        data: {
            path: '/static/uploads/blue-orange.jpg',
            name: 'Word.docx',
            size: 11943,
            id: 2,
            type: 'attachment',
            extension: 'docx',
            fileName: 'DemoWordAttachment.docx',
        },
        children: [
            {
                text: '',
            },
        ],
    },
    {
        type: 'attachment',
        data: {
            path: '/static/uploads/blue-orange.jpg',
            name: '5mb-file.txt',
            size: 5000000,
            id: 4,
            type: 'attachment',
            extension: 'txt',
            fileName: 'DemoTxtAttachment.txt',
        },
        children: [
            {
                text: '',
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
                text: 'Videos',
                'uui-richTextEditor-bold': true,
            },
        ],
    },
    {
        type: 'paragraph',
        children: [
            {
                text: 'Embed videos via the ',
            },
            {
                text: '"Add Video"',
                'uui-richTextEditor-bold': true,
            },
            {
                text: ' icon.',
            },
        ],
    },
    {
        type: 'iframe',
        children: [
            {
                text: '',
                'uui-richTextEditor-span-mark': true,
            },
        ],
        data: {},
        url: 'https://www.youtube.com/embed/jfKfPfyJRdk',
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
        children: [
            {
                type: 'table_row',
                children: [
                    {
                        type: 'table_header_cell',
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
                        colSpan: 2,
                        rowSpan: 1,
                    },
                    {
                        type: 'table_header_cell',
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
                children: [
                    {
                        type: 'table_cell',
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
                        colSpan: 1,
                        rowSpan: 2,
                    },
                    {
                        type: 'table_cell',
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
                        rowSpan: 1,
                        colSpan: 1,
                    },
                    {
                        type: 'table_cell',
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
                        rowSpan: 1,
                        colSpan: 1,
                    },
                    {
                        type: 'table_cell',
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
                size: 47,
            },
            {
                type: 'table_row',
                children: [
                    {
                        type: 'table_cell',
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
                        colSpan: 1,
                        rowSpan: 1,
                    },
                    {
                        type: 'table_cell',
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
                        colSpan: 1,
                        rowSpan: 1,
                    },
                    {
                        type: 'table_cell',
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
                        colSpan: 1,
                        rowSpan: 1,
                    },
                ],
            },
            {
                type: 'table_row',
                children: [
                    {
                        type: 'table_cell',
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
                        colSpan: 1,
                        rowSpan: 1,
                    },
                    {
                        type: 'table_cell',
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
                        colSpan: 1,
                        rowSpan: 1,
                    },
                    {
                        type: 'table_cell',
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
                        colSpan: 1,
                        rowSpan: 1,
                    },
                    {
                        type: 'table_cell',
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
                        colSpan: 1,
                        rowSpan: 1,
                    },
                ],
                size: 47,
            },
            {
                type: 'table_row',
                children: [
                    {
                        type: 'table_cell',
                        children: [
                            {
                                type: 'paragraph',
                                children: [
                                    {
                                        text: '',
                                    },
                                ],
                            },
                        ],
                        colSpan: 1,
                        rowSpan: 1,
                    },
                    {
                        type: 'table_cell',
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
                        colSpan: 3,
                        rowSpan: 1,
                    },
                ],
            },
        ],
        data: {},
        colSizes: [
            200,
            154,
            150,
            189,
        ],
    },
    {
        type: 'uui-richTextEditor-header-3',
        data: {},
        children: [
            {
                text: '',
            },
        ],
    },
    {
        type: 'uui-richTextEditor-header-3',
        data: {},
        children: [
            {
                text: 'Placeholders',
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
                text: ' can be inserted into text and are useful for creating editable templates, such as emails. These placeholders can be programmatically replaced with real values (currently handled by some apps in back-end code).',
            },
        ],
    },
    {
        type: 'uui-richTextEditor-header-2',
        data: {},
        children: [
            {
                text: 'Miscellaneous Features',
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
];
