import { SlateSchema } from '../../migrations/types';

export const slateInitialValue: SlateSchema = {
    object: 'value',
    document: {
        object: 'document',
        data: {},
        nodes: [
            {
                object: 'block',
                type: 'uui-richTextEditor-header-1',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: 'Rich Text Editor',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'uui-richTextEditor-header-3',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: 'Introduction',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'paragraph',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: '@epam/uui-editor package contains a full-featured Rich Text Editor, based on open-source ',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    }, {
                        object: 'inline',
                        type: 'link',
                        data: {
                            url: 'https://www.slatejs.org/',
                        },
                        nodes: [
                            {
                                object: 'text',
                                text: 'slate.js',
                                marks: [
                                    {
                                        object: 'mark',
                                        type: 'uui-richTextEditor-span-mark',
                                        data: {},
                                    },
                                ],
                            },
                        ],
                    }, {
                        object: 'text',
                        text: " library. Slate.JS is a framework to build editors, and it's highly configurable with plugins. In UUI, we picked and tuned dozen of plugins, build several plugins ourselves, added common styles and UX on top of it. One can pick from our default set of plugins, or even introduce new, app-specific plugins, on top.",
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'paragraph',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: 'Unlikely to most Rich-Text editors, Slate uses JSON data model instead of HTML, which allows it to embed any entities, like arbitrary React components. For example, this checkbox, is a custom react component (check ',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    }, {
                        object: 'inline',
                        type: 'link',
                        data: {
                            url: 'https://github.com/epam/UUI/blob/main/uui-editor/src/plugins/toDoListPlugin/ToDoItem.tsx',
                        },
                        nodes: [
                            {
                                object: 'text',
                                text: 'source here',
                                marks: [
                                    {
                                        object: 'mark',
                                        type: 'uui-richTextEditor-span-mark',
                                        data: {},
                                    },
                                ],
                            },
                        ],
                    }, {
                        object: 'text',
                        text: '):',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'toDoItem',
                data: {
                    checked: false,
                },
                nodes: [
                    {
                        object: 'text',
                        text: ' An item',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'paragraph',
                data: {
                    checked: false,
                },
                nodes: [
                    {
                        object: 'text',
                        text: 'We include HTML to Slate JSON converter, which is also used to convert pasted HTML.',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'uui-richTextEditor-header-2',
                data: {
                    checked: false,
                },
                nodes: [
                    {
                        object: 'text',
                        text: 'Out of the box components',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'uui-richTextEditor-header-3',
                data: {
                    checked: false,
                },
                nodes: [
                    {
                        object: 'text',
                        text: 'Basic layout',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'paragraph',
                data: {
                    checked: false,
                },
                nodes: [
                    {
                        object: 'text',
                        text: 'We support inline text styles: ',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    }, {
                        object: 'text',
                        text: 'bold',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            }, {
                                object: 'mark',
                                type: 'uui-richTextEditor-bold',
                                data: {},
                            },
                        ],
                    }, {
                        object: 'text',
                        text: ', ',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    }, {
                        object: 'text',
                        text: 'italic',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            }, {
                                object: 'mark',
                                type: 'uui-richTextEditor-italic',
                                data: {},
                            },
                        ],
                    }, {
                        object: 'text',
                        text: ', ',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    }, {
                        object: 'text',
                        text: 'underlined,',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            }, {
                                object: 'mark',
                                type: 'uui-richTextEditor-underlined',
                                data: {},
                            },
                        ],
                    }, {
                        object: 'text',
                        text: ' several UUI-friendly text colors: ',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    }, {
                        object: 'text',
                        text: 'red',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {
                                    style: {
                                        color: '#FF4E33',
                                    },
                                },
                            },
                        ],
                    }, {
                        object: 'text',
                        text: ', ',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    }, {
                        object: 'text',
                        text: 'yellow',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {
                                    style: {
                                        color: '#FFA21D',
                                    },
                                },
                            },
                        ],
                    }, {
                        object: 'text',
                        text: ', and ',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    }, {
                        object: 'text',
                        text: 'green.',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {
                                    style: {
                                        color: '#9BC837',
                                    },
                                },
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'paragraph',
                data: {
                    checked: false,
                },
                nodes: [
                    {
                        object: 'text',
                        text: 'Numbered lists:',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'ordered-list',
                data: {},
                nodes: [
                    {
                        object: 'block',
                        type: 'list-item',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'list-item-child',
                                data: {
                                    checked: false,
                                },
                                nodes: [
                                    {
                                        object: 'text',
                                        text: "In edit mode, we detect  '1.' and start list automatically",
                                        marks: [
                                            {
                                                object: 'mark',
                                                type: 'uui-richTextEditor-span-mark',
                                                data: {},
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    }, {
                        object: 'block',
                        type: 'list-item',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'list-item-child',
                                data: {
                                    checked: false,
                                },
                                nodes: [
                                    {
                                        object: 'text',
                                        text: "You can use 'tab' / 'shift/tab' to indent the list",
                                        marks: [
                                            {
                                                object: 'mark',
                                                type: 'uui-richTextEditor-span-mark',
                                                data: {},
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'paragraph',
                data: {
                    checked: false,
                },
                nodes: [
                    {
                        object: 'text',
                        text: 'Bullet lists:',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'unordered-list',
                data: {},
                nodes: [
                    {
                        object: 'block',
                        type: 'list-item',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'list-item-child',
                                data: {
                                    checked: false,
                                },
                                nodes: [
                                    {
                                        object: 'text',
                                        text: "Type '- ' to start the list",
                                        marks: [
                                            {
                                                object: 'mark',
                                                type: 'uui-richTextEditor-span-mark',
                                                data: {},
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    }, {
                        object: 'block',
                        type: 'list-item',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'list-item-child',
                                data: {
                                    checked: false,
                                },
                                nodes: [
                                    {
                                        object: 'text',
                                        text: "You can create multi-level lists with 'tab' / 'shift+tab'. Example:",
                                        marks: [
                                            {
                                                object: 'mark',
                                                type: 'uui-richTextEditor-span-mark',
                                                data: {},
                                            },
                                        ],
                                    },
                                ],
                            }, {
                                object: 'block',
                                type: 'unordered-list',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'list-item',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'block',
                                                type: 'list-item-child',
                                                data: {
                                                    checked: false,
                                                },
                                                nodes: [
                                                    {
                                                        object: 'text',
                                                        text: 'Level 2',
                                                        marks: [
                                                            {
                                                                object: 'mark',
                                                                type: 'uui-richTextEditor-span-mark',
                                                                data: {},
                                                            },
                                                        ],
                                                    },
                                                ],
                                            }, {
                                                object: 'block',
                                                type: 'unordered-list',
                                                data: {},
                                                nodes: [
                                                    {
                                                        object: 'block',
                                                        type: 'list-item',
                                                        data: {},
                                                        nodes: [
                                                            {
                                                                object: 'block',
                                                                type: 'list-item-child',
                                                                data: {
                                                                    checked: false,
                                                                },
                                                                nodes: [
                                                                    {
                                                                        object: 'text',
                                                                        text: 'Level 3',
                                                                        marks: [
                                                                            {
                                                                                object: 'mark',
                                                                                type: 'uui-richTextEditor-span-mark',
                                                                                data: {},
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
                ],
            }, {
                object: 'block',
                type: 'paragraph',
                data: {
                    checked: false,
                },
                nodes: [
                    {
                        object: 'text',
                        text: "There's also support 3 levels of headers, hyperlinks, superscript, and more.",
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'uui-richTextEditor-header-3',
                data: {
                    checked: false,
                },
                nodes: [
                    {
                        object: 'text',
                        text: 'Embedded content',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'paragraph',
                data: {
                    checked: false,
                },
                nodes: [
                    {
                        object: 'text',
                        text: 'Files can be dropped directly into the editor. You can embed images (align and resizing is supported):',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'image',
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
                nodes: [
                    {
                        object: 'text',
                        text: '',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'paragraph',
                data: {
                    checked: false,
                },
                nodes: [
                    {
                        object: 'text',
                        text: 'Video:',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'iframe',
                data: {
                    src: 'https://www.youtube.com/embed/5qap5aO4i9A',
                },
                nodes: [
                    {
                        object: 'text',
                        text: '',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'paragraph',
                data: {
                    checked: false,
                },
                nodes: [
                    {
                        object: 'text',
                        text: 'Arbitrary attachments:',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'attachment',
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
                nodes: [
                    {
                        object: 'text',
                        text: '',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-span-mark',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'paragraph',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: 'You can also embed any arbitrary content, like PDF files, directly into the document, inside IFrame.',
                        marks: [],
                    },
                ],
            }, {
                object: 'block',
                type: 'uui-richTextEditor-header-3',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: 'Tables',
                        marks: [],
                    },
                ],
            }, {
                object: 'block',
                type: 'paragraph',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: 'We provide a powerful tables plugin:',
                        marks: [],
                    },
                ],
            }, {
                object: 'block',
                type: 'paragraph',
                data: {},
                nodes: [
                    {
                        object: 'block',
                        type: 'table',
                        data: {
                            cellSizes: [
                                130, 200, 200, 183, 161,
                            ],
                        },
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_row',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'table_header_cell',
                                        data: { },
                                        nodes: [
                                            {
                                                object: 'block',
                                                type: 'paragraph',
                                                data: {},
                                                nodes: [
                                                    {
                                                        object: 'text',
                                                        text: 'Department',
                                                        marks: [],
                                                    },

                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        object: 'block',
                                        type: 'table_header_cell',
                                        data: { colSpan: 2 },
                                        nodes: [
                                            {
                                                object: 'block',
                                                type: 'paragraph',
                                                data: {},
                                                nodes: [
                                                    {
                                                        object: 'text',
                                                        text: 'Name',
                                                        marks: [],
                                                    },
                                                    {
                                                        object: 'text',
                                                        text: ' & ',
                                                        marks: [],
                                                    },
                                                    {
                                                        object: 'text',
                                                        text: 'Title',
                                                        marks: [],
                                                    },
                                                ],
                                            },
                                        ],
                                    },

                                    {
                                        object: 'block',
                                        type: 'table_header_cell',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'block',
                                                type: 'paragraph',
                                                data: {},
                                                nodes: [
                                                    {
                                                        object: 'text',
                                                        text: 'Tasks',
                                                        marks: [],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_row',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'table_cell',
                                        data: { rowSpan: 2 },
                                        nodes: [
                                            {
                                                object: 'block',
                                                type: 'paragraph',
                                                data: {},
                                                nodes: [
                                                    {
                                                        object: 'text',
                                                        text: 'RnD',
                                                        marks: [],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        object: 'block',
                                        type: 'table_cell',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'block',
                                                type: 'paragraph',
                                                data: {},
                                                nodes: [
                                                    {
                                                        object: 'text',
                                                        text: 'Alice Green',
                                                        marks: [],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        object: 'block',
                                        type: 'table_cell',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'block',
                                                type: 'paragraph',
                                                data: {},
                                                nodes: [
                                                    {
                                                        object: 'text',
                                                        text: 'Design',
                                                        marks: [],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        object: 'block',
                                        type: 'table_cell',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'block',
                                                type: 'paragraph',
                                                data: {},
                                                nodes: [
                                                    {
                                                        object: 'text',
                                                        text: 'Ok',
                                                        marks: [
                                                            {
                                                                object: 'mark',
                                                                type: 'uui-richTextEditor-span-mark',
                                                                data: {
                                                                    style: {
                                                                        color: '#9BC837',
                                                                    },
                                                                },
                                                            }, {
                                                                object: 'mark',
                                                                type: 'uui-richTextEditor-bold',
                                                                data: {},
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
                                object: 'block',
                                type: 'table_row',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'table_cell',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'block',
                                                type: 'paragraph',
                                                data: {},
                                                nodes: [
                                                    {
                                                        object: 'text',
                                                        text: 'Bob Blue',
                                                        marks: [],
                                                    },
                                                ],
                                            },
                                        ],
                                    }, {
                                        object: 'block',
                                        type: 'table_cell',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'block',
                                                type: 'paragraph',
                                                data: {},
                                                nodes: [
                                                    {
                                                        object: 'text',
                                                        text: 'Developer',
                                                        marks: [],
                                                    },
                                                ],
                                            },
                                        ],
                                    }, {
                                        object: 'block',
                                        type: 'table_cell',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'block',
                                                type: 'paragraph',
                                                data: {},
                                                nodes: [
                                                    {
                                                        object: 'text',
                                                        text: 'Ok',
                                                        marks: [
                                                            {
                                                                object: 'mark',
                                                                type: 'uui-richTextEditor-span-mark',
                                                                data: {
                                                                    style: {
                                                                        color: '#9BC837',
                                                                    },
                                                                },
                                                            }, {
                                                                object: 'mark',
                                                                type: 'uui-richTextEditor-bold',
                                                                data: {},
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
                                object: 'block',
                                type: 'table_row',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'table_cell',
                                        data: { rowSpan: 1 },
                                        nodes: [
                                            {
                                                object: 'block',
                                                type: 'paragraph',
                                                data: {},
                                                nodes: [
                                                    {
                                                        object: 'text',
                                                        text: 'People',
                                                        marks: [],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        object: 'block',
                                        type: 'table_cell',
                                        data: { rowSpan: 1 },
                                        nodes: [
                                            {
                                                object: 'block',
                                                type: 'paragraph',
                                                data: {},
                                                nodes: [
                                                    {
                                                        object: 'text',
                                                        text: 'Ann Chovey',
                                                        marks: [],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        object: 'block',
                                        type: 'table_cell',
                                        data: { rowSpan: 1 },
                                        nodes: [
                                            {
                                                object: 'block',
                                                type: 'paragraph',
                                                data: {},
                                                nodes: [
                                                    {
                                                        object: 'text',
                                                        text: 'Primary HR',
                                                        marks: [],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        object: 'block',
                                        type: 'table_cell',
                                        data: { rowSpan: 1 },
                                        nodes: [
                                            {
                                                object: 'block',
                                                type: 'paragraph',
                                                data: {},
                                                nodes: [
                                                    {
                                                        object: 'text',
                                                        text: 'In progress',
                                                        marks: [
                                                            {
                                                                object: 'mark',
                                                                type: 'uui-richTextEditor-span-mark',
                                                                data: {
                                                                    style: {
                                                                        color: '#8A7CBB',
                                                                    },
                                                                },
                                                            }, {
                                                                object: 'mark',
                                                                type: 'uui-richTextEditor-bold',
                                                                data: {},
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
                                object: 'block',
                                type: 'table_row',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'table_cell',
                                        data: { },
                                        nodes: [
                                            {
                                                object: 'block',
                                                type: 'paragraph',
                                                data: {},
                                                nodes: [
                                                    {
                                                        object: 'text',
                                                        text: '',
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        object: 'block',
                                        type: 'table_cell',
                                        data: { colSpan: 3 },
                                        nodes: [
                                            {
                                                object: 'block',
                                                type: 'paragraph',
                                                data: {},
                                                nodes: [
                                                    {
                                                        object: 'text',
                                                        text: 'Footer',
                                                        marks: [],
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
            }, {
                object: 'block',
                type: 'uui-richTextEditor-header-3',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: 'Placeholders:',
                        marks: [],
                    },
                ],
            }, {
                object: 'block',
                type: 'paragraph',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: 'Allows to insert ',
                        marks: [],
                    }, {
                        object: 'inline',
                        type: 'placeholder',
                        data: {
                            name: 'Placeholder',
                            field: 'placeholder',
                        },
                        nodes: [
                            {
                                object: 'text',
                                text: '',
                                marks: [],
                            },
                        ],
                    }, {
                        object: 'text',
                        text: " into text. Can be used for editing templates, for example for emails. Placeholders can be then replaced with real values programmatically (currently that's done by some apps in back-end code).",
                        marks: [],
                    },
                ],
            }, {
                object: 'block',
                type: 'paragraph',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: '',
                        marks: [],
                    },
                ],
            }, {
                object: 'block',
                type: 'uui-richTextEditor-header-2',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: 'Misc features',
                        marks: [],
                    },
                ],
            }, {
                object: 'block',
                type: 'paragraph',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: 'Highlighted blocks:',
                        marks: [],
                    },
                ],
            }, {
                object: 'block',
                type: 'note-error',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: 'Danger!',
                        marks: [
                            {
                                object: 'mark',
                                type: 'uui-richTextEditor-bold',
                                data: {},
                            },
                        ],
                    },
                ],
            }, {
                object: 'block',
                type: 'note-link',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: 'Info',
                        marks: [],
                    },
                ],
            }, {
                object: 'block',
                type: 'note-warning',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: 'Warning',
                        marks: [],
                    },
                ],
            }, {
                object: 'block',
                type: 'note-quote',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: 'Side note',
                        marks: [],
                    },
                ],
            }, {
                object: 'block',
                type: 'paragraph',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: 'Splitter:',
                        marks: [],
                    },
                ],
            }, {
                object: 'block',
                type: 'separatorBLock',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: '',
                        marks: [],
                    },
                ],
            }, {
                object: 'block',
                type: 'paragraph',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: '',
                        marks: [],
                    },
                ],
            },
        ],
    },
};
