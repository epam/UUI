export const inputMarkdowValue = `# Rich Text Editor
### Introduction
@epam/uui-editor package contains a full-featured Rich Text Editor, based on open-source [slate.js](https://www.slatejs.org/) library. Slate.JS is a framework to build editors, and it&#39;s highly configurable with plugins. In UUI, we picked and tuned dozen of plugins, build several plugins ourselves, added common styles and UX on top of it. One can pick from our default set of plugins, or even introduce new, app-specific plugins, on top.
Unlikely to most Rich-Text editors, Slate uses JSON data model instead of HTML, which allows it to embed any entities, like arbitrary React components. For example, this checkbox, is a custom react component (check [source here](https://github.com/epam/UUI/blob/main/uui-editor/src/plugins/toDoListPlugin/ToDoItem.tsx)):
 An item\`We include HTML to Slate JSON converter, which is also used to convert pasted HTML.\`
![some image name](https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tfGVufDB8fDB8fHww)## Out of the box components
### Basic layout
We support inline text styles: **bold**, _italic_, underlined, several UUI-friendly text colors: red, yellow, and green.
Numbered lists:

1. In edit mode, we detect  &amp;#39;1.&amp;#39; and start list automatically1. You can use &amp;#39;tab&amp;#39; / &amp;#39;shift/tab&amp;#39; to indent the list
Bullet lists:

- Type &amp;#39;- &amp;#39; to start the list- You can create multi-level lists with &amp;#39;tab&amp;#39; / &amp;#39;shift+tab&amp;#39;. Example:
  - Level 2
    - Level 3


There&#39;s also support 3 levels of headers, hyperlinks, superscript, and more.
Splitter:

---
`;

export const expectedSlateValue = [
    {
        type: 'uui-richTextEditor-header-1',
        children: [{ text: 'Rich Text Editor' }],
    }, {
        type: 'uui-richTextEditor-header-3',
        children: [{ text: 'Introduction' }],
    }, {
        type: 'paragraph',
        children: [{ text: '@epam/uui-editor package contains a full-featured Rich Text Editor, based on open-source ' }, {
            type: 'link',
            url: 'https://www.slatejs.org/',
            children: [{ text: 'slate.js' }],
        }, { text: " library. Slate.JS is a framework to build editors, and it's highly configurable with plugins. In UUI, we picked and tuned dozen of plugins, build several plugins ourselves, added common styles and UX on top of it. One can pick from our default set of plugins, or even introduce new, app-specific plugins, on top.\nUnlikely to most Rich-Text editors, Slate uses JSON data model instead of HTML, which allows it to embed any entities, like arbitrary React components. For example, this checkbox, is a custom react component (check " }, {
            type: 'link',
            url: 'https://github.com/epam/UUI/blob/main/uui-editor/src/plugins/toDoListPlugin/ToDoItem.tsx',
            children: [{ text: 'source here' }],
        }, { text: '):\nAn item' }, {
            text: 'We include HTML to Slate JSON converter, which is also used to convert pasted HTML.',
            code: true,
        }, { text: '\n' }],
    }, {
        type: 'img',
        children: [{ text: '' }],
        url: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tfGVufDB8fDB8fHww',
        caption: [{ text: 'some image name' }],
    }, {
        type: 'paragraph',
        children: [{ text: '## Out of the box components' }],
    }, {
        type: 'uui-richTextEditor-header-3',
        children: [{ text: 'Basic layout' }],
    }, {
        type: 'paragraph',
        children: [{ text: 'We support inline text styles: ' }, {
            text: 'bold',
            'uui-richTextEditor-bold': true,
        }, { text: ', ' }, {
            text: 'italic',
            'uui-richTextEditor-italic': true,
        }, { text: ', underlined, several UUI-friendly text colors: red, yellow, and green.\nNumbered lists:' }],
    }, {
        type: 'ordered-list',
        children: [{
            type: 'list-item',
            children: [{
                type: 'list-item-child',
                children: [{ text: 'In edit mode, we detect  &#39;1.&#39; and start list automatically1. You can use &#39;tab&#39; / &#39;shift/tab&#39; to indent the list\nBullet lists:' }],
            }],
        }],
    }, {
        type: 'unordered-list',
        children: [{
            type: 'list-item',
            children: [{
                type: 'list-item-child',
                children: [{ text: 'Type &#39;- &#39; to start the list- You can create multi-level lists with &#39;tab&#39; / &#39;shift+tab&#39;. Example:' }],
            }, {
                type: 'unordered-list',
                children: [{
                    type: 'list-item',
                    children: [{
                        type: 'list-item-child',
                        children: [{ text: 'Level 2' }],
                    }, {
                        type: 'unordered-list',
                        children: [{
                            type: 'list-item',
                            children: [{
                                type: 'list-item-child',
                                children: [{ text: 'Level 3' }],
                            }],
                        }],
                    }],
                }],
            }],
        }],
    }, {
        type: 'paragraph',
        children: [{ text: "There's also support 3 levels of headers, hyperlinks, superscript, and more.\nSplitter:" }],
    }, {
        type: 'hr',
        children: [{ text: '' }],
    },
];
