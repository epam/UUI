import React, { useMemo } from 'react';
import { Editable, withReact, Slate } from 'slate-react';
import {
    createEditor,
} from 'slate';
import { withHistory } from 'slate-history';

import SoftBreak from "slate-soft-break";

import { paragraphPlugin, colorPlugin, baseMarksPlugin } from "./plugins";
import { Toolbar } from "./implementation/Toolbar";

// @ts-ignore
const data: any = {
    "object": "value",
    "document": {
        "object": "document",
        "data": {},
        "nodes": [
            {
                "object": "block",
                "type": "paragraph",
                "data": {},
                "nodes": [
                    {
                        "object": "text",
                        "text": "A powerful content editor, styled to match UI, and extensible to host any React component.",
                        "marks": ['uui-richTextEditor-bold'],
                    },
                ],
            },
            {
                "object": "block",
                "type": "paragraph",
                "data": {},
                "nodes": [
                    {
                        "object": "text",
                        "text": "Based on Slate.JS, which is the framework to build such editors. Read more on ",
                        "marks": [],
                    },
                    {
                        "object": "inline",
                        "type": "link",
                        "data": {
                            "url": "https://docs.slatejs.org/",
                        },
                        "nodes": [
                            {
                                "object": "text",
                                "text": "Slate.JS",
                                "marks": [],
                            },
                        ],
                    },
                    {
                        "object": "text",
                        "text": " documentation site.",
                        "marks": [],
                    },
                ],
            },
            {
                "object": "block",
                "type": "paragraph",
                "data": {},
                "nodes": [
                    {
                        "object": "text",
                        "text": "UUI RichTextEditor is built on top of Slate to bring UUI styles, add our extensions, panels to interact with, and to wrap this with convenient API.",
                        "marks": [],
                    },
                ],
            },
            {
                "object": "block",
                "type": "note-error",
                "data": {},
                "nodes": [
                    {
                        "object": "text",
                        "text": "This component does't have dependencies on skin packages and uses skinManager approach to get components from your app skin. So it's required to pass ",
                        "marks": [],
                    },
                    {
                        "object": "text",
                        "text": "skinContexsdft",
                        "marks": [
                            {
                                "object": "mark",
                                "type": "uui-richTextEditor-code",
                                "data": {},
                            },
                        ],
                    },
                    {
                        "object": "text",
                        "text": " propsdf into ",
                        "marks": [],
                    },
                    {
                        "object": "inline",
                        "type": "link",
                        "data": {
                            "url": "/documents?category=contexts&id=contextProvider&",
                        },
                        "nodes": [
                            {
                                "object": "text",
                                "text": "ContextProvider",
                                "marks": [],
                            },
                        ],
                    },
                    {
                        "object": "text",
                        "text": ". You can import skinContext object from your skin package.\n\nAlso it required to import css from editor package, pleasesdf add the following code into you app entry file: \n",
                        "marks": [],
                    },
                    {
                        "object": "text",
                        "text": "import '@epam/uui-editor/styles.css';",
                        "marks": [
                            {
                                "object": "mark",
                                "type": "uui-richTextEditor-code",
                                "data": {},
                            },
                        ],
                    },
                ],
            },
            {
                "object": "block",
                "type": "note-warning",
                "data": {},
                "nodes": [
                    {
                        "object": "text",
                        "text": "Slate works with it's own JSON-based content format. That's allows it to be robust and flexible, but apps need to carefully consider that before using it.",
                        "marks": [],
                    },
                ],
            },
            {
                "object": "block",
                "type": "paragraph",
                "data": {},
                "nodes": [
                    {
                        "object": "text",
                        "text": "When you manipulate with server-side use ",
                        "marks": [],
                    },
                    {
                        "object": "text",
                        "text": "Value.toJSON(value)",
                        "marks": [
                            {
                                "object": "mark",
                                "type": "uui-richTextEditor-code",
                                "data": {},
                            },
                        ],
                    },
                    {
                        "object": "text",
                        "text": " and ",
                        "marks": [],
                    },
                    {
                        "object": "text",
                        "text": "Value.fromJSON(value)",
                        "marks": [
                            {
                                "object": "mark",
                                "type": "uui-richTextEditor-code",
                                "data": {},
                            },
                        ],
                    },
                    {
                        "object": "text",
                        "text": " functions from ",
                        "marks": [],
                    },
                    {
                        "object": "text",
                        "text": "slate",
                        "marks": [
                            {
                                "object": "mark",
                                "type": "uui-richTextEditor-code",
                                "data": {},
                            },
                        ],
                    },
                    {
                        "object": "text",
                        "text": " package, to convert slate state to JSON model and vice versa.",
                        "marks": [],
                    },
                ],
            },
        ],
    },
};

export const defaultPlugins = [
    SoftBreak({ shift: true }),
    paragraphPlugin(),
    colorPlugin(),
    //utilsPlugin(),
];

export const basePlugins = [
    baseMarksPlugin(),
    ...defaultPlugins,
];

/**
 * Slate's schema has changed vastly under 2 years. The text editor is still
 * a better candidate than the other OSS editors out there, so we must live
 * with the major changes.
 *
 * Migrate a schema from the old version 0.33 to current version 0.6x
 * Inspiration taken wholly from
 * https://github.com/react-page/react-page/blob/b6c83a8650cfe9089e0c3eaf471ab58a0f7db761/packages/plugins/content/slate/src/migrations/v004.ts
 */

const migrateTextNode = (oldNode: any) => {
    return {
        text: oldNode.text,
        ...oldNode.marks?.reduce(
            (acc: any, mark: any) => ({
                ...acc,
                bold: true,
                [mark.type]: true,
            }),
            {},
        ),
    };
};

const migrateElementNode = (node: any) => {
    return {
        data: node.data ?? {},
        type: node.type,
        children: node.nodes?.map(migrateNode).flat() ?? [],
    };
};

const migrateNode = (oldNode: any) => {
    if (oldNode.object === 'text') {
        return migrateTextNode(oldNode);
    } else {
        return migrateElementNode(oldNode);
    }
};

export const migrateSchema = (oldSchema: any) => {
    return oldSchema.document.nodes.map(migrateNode);
};

export function SlateEditor() {
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);
    const renderMark = (props: any) => {

        if (props.leaf['uui-richTextEditor-bold']) {
            return <strong { ...props.attributes }>{ props.children }</strong>;
        }
        if (props.leaf['uui-richTextEditor-italic']) {
            return <i { ...props.attributes }>{ props.children }</i>;
        }
        if (props.leaf['uui-richTextEditor-underlined']) {
            return <u { ...props.attributes }>{ props.children }</u>;
        }
        if (props.leaf['uui-richTextEditor-superscript']) {
            return <sup { ...props.attributes }>{ props.children }</sup>;
        }

        if (props.leaf['uui-richTextEditor-code']) {
            return <code { ...props.attributes }>{ props.children }</code>;
        }

        return <span { ...props.attributes } >{ props.children }</span>;
    };

    return (
        <Slate
            editor={ editor }
            value={ migrateSchema(data) }
        >
            <Toolbar editor={ editor } plugins={ basePlugins } />
            <Editable
                renderLeaf={ renderMark }
                placeholder="Enter some rich text…"
                spellCheck
                autoFocus
                onKeyDown={ event => {
                    // for (const hotkey in HOTKEYS) {
                    //     if (isHotkey(hotkey, event as any)) {
                    //         event.preventDefault();
                    //         const mark = HOTKEYS[hotkey];
                    //         toggleMark(editor, mark);
                    //     }
                    // }
                } }
            />
        </Slate>
    );
}
