import React, { useCallback, useMemo } from 'react';
import isHotkey from 'is-hotkey';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import {
    Editor,
    Transforms,
    createEditor,
    Descendant,
    Element as SlateElement,
} from 'slate';
import { withHistory } from 'slate-history';

import SoftBreak from "slate-soft-break";
//import htmlclean from 'htmlclean';
//import { Descendant, Editor } from 'slate';
//import { ScrollBars } from '@epam/uui-components';

import { IEditable, UuiContexts, uuiMod, IHasCX, UuiContext, cx, IHasRawProps } from '@epam/uui-core';

// import {Toolbar} from "./implementation/Toolbar";
// import {Sidebar} from './implementation/Sidebar';
//import { baseMarksPlugin, utilsPlugin, paragraphPlugin } from "./plugins";
//import { getSerializer, isEditorEmpty } from './helpers';

import * as style from '@epam/assets/scss/promo/typography.scss';
import * as css from './SlateEditor.scss';

export const slateEditorEmptyValue: Descendant = {
    document: {
        nodes: [
            {
                object: 'block',
                type: 'paragraph',
                //key: KeyUtils.create(),
                nodes: [
                    {
                        object: 'text',
                        text: '',
                    },
                ],
            },
        ],
    },
} as any;

const schema: any = {
    blocks: {
        attachment: {
            isVoid: true,
        },
        iframe: {
            isVoid: true,
        },
        separatorBLock: {
            isVoid: true,
        },
        video: {
            isVoid: true,
        },
        loader: {
            isVoid: true,
        },
        image: {
            isVoid: true,
        },
    },
    inlines: {
        placeholder: {
            isVoid: true,
        },
    },
};

export const defaultPlugins = [
    SoftBreak({ shift: true }),
    // paragraphPlugin(),
    // utilsPlugin(),
];

export const basePlugins = [
    //baseMarksPlugin(),
    ...defaultPlugins,
];

interface SlateEditorProps extends IEditable<any | null>, IHasCX, IHasRawProps<HTMLDivElement> {
    isReadonly?: boolean;
    plugins?: Plugin[];
    autoFocus?: boolean;
    minHeight?: number | 'none';
    placeholder?: string;
    mode?: 'form' | 'inline';
    fontSize?: '14' | '16';
    onKeyDown?: (event: KeyboardEvent, value: any | null) => void;
    onBlur?: (event: FocusEvent, value: any | null) => void;
    scrollbars?: boolean;
}

interface SlateEditorState {
    inFocus?: boolean;
}

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

const Leaf = ({ attributes, children, leaf }: any) => {
    if (leaf.bold) {
        children = <strong>{ children }</strong>;
    }

    if (leaf.code) {
        children = <code>{ children }</code>;
    }

    if (leaf.italic) {
        children = <em>{ children }</em>;
    }

    if (leaf.underline) {
        children = <u>{ children }</u>;
    }

    return <span { ...attributes }>{ children }</span>;
};

const Element = ({ attributes, children, element }: any) => {
    const style = { textAlign: element.align };
    switch (element.type) {
        case 'block-quote':
            return (
                <blockquote style={ style } { ...attributes }>
                    { children }
                </blockquote>
            );
        case 'bulleted-list':
            return (
                <ul style={ style } { ...attributes }>
                    { children }
                </ul>
            );
        case 'heading-one':
            return (
                <h1 style={ style } { ...attributes }>
                    { children }
                </h1>
            );
        case 'heading-two':
            return (
                <h2 style={ style } { ...attributes }>
                    { children }
                </h2>
            );
        case 'list-item':
            return (
                <li style={ style } { ...attributes }>
                    { children }
                </li>
            );
        case 'numbered-list':
            return (
                <ol style={ style } { ...attributes }>
                    { children }
                </ol>
            );
        default:
            return (
                <p style={ style } { ...attributes }>
                    { children }
                </p>
            );
    }
};

const initialValue: any[] = [
    {
        type: 'paragraph',
        children: [
            { text: 'This is editable ' },
            { text: 'rich', bold: true },
            { text: ' text, ' },
            { text: 'much', italic: true },
            { text: ' better than a ' },
            { text: '<textarea>', code: true },
            { text: '!' },
        ],
    },
    {
        type: 'paragraph',
        children: [
            {
                text:
                    "Since it's rich text, you can do things like turn a selection of text ",
            },
            { text: 'bold', bold: true },
            {
                text:
                    ', or add a semantically rendered block quote in the middle of the page, like this:',
            },
        ],
    },
    {
        type: 'block-quote',
        children: [{ text: 'A wise quote.' }],
    },
    {
        type: 'paragraph',
        align: 'center',
        children: [{ text: 'Try it out for yourself!' }],
    },
];


export function SlateEditor() {
    const renderElement = useCallback(props => <Element { ...props } />, []);
    const renderLeaf = useCallback(props => <Leaf { ...props } />, []);
    //@ts-ignore
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);

    return (
        <Slate editor={ editor } value={ initialValue }>
            <Editable
                renderElement={ renderElement }
                renderLeaf={ renderLeaf }
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
