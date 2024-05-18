import {
    Range, Editor,
} from 'slate';
import {
    PlatePlugin, Value, createPlateEditor, getPlugins, useEditorState, createNode, PlateEditor, createPlugins,
} from '@udecode/plate-common';
import { createPlateUI } from './components';
import { PARAGRAPH_TYPE } from './plugins/paragraphPlugin';
import { migrateSlateSchema, SlateSchema } from './migrations/slate_migrations';
import { EditorValue } from './types';

export function getBlockDesirialiser(blockTags: Record<string, string>) {
    return (el: any, next: any) => {
        const block = blockTags[el.tagName.toLowerCase()];

        if (block) {
            return {
                object: 'block',
                type: block,
                nodes: next(el.childNodes),
            };
        }
    };
}

export function getMarkDeserializer(marks: Record<string, string>) {
    return (el: any, next: any) => {
        const mark = marks[el.tagName.toLowerCase()];

        if (mark) {
            return {
                object: 'mark',
                type: mark,
                nodes: next(el.childNodes),
            };
        }
    };
}

export function isTextSelected(editor: any, inFocus: boolean) {
    const { selection } = editor;
    return (selection && inFocus && !Range.isCollapsed(selection) && Editor.string(editor, selection) !== '');
}

export function isImageSelected(editor: any) {
    const { selection, getFragment } = editor;
    const node = getFragment()[0]?.type;
    return selection && node === 'image';
}

// TODO: get rid of that
export function useIsPluginActive(key: string): boolean {
    const editor = useEditorState();
    const plugins = getPlugins(editor);
    return plugins.some((plugin) => plugin.key === key);
}

export const isEditorValueEmpty = (value: Value) => {
    return (
        !value
        || (value.length === 0
        || (value.length === 1 && value[0].type === PARAGRAPH_TYPE && value[0].children[0].text === ''))
    );
};

export class SelectionUtils {
    static getSelection(params: { shadowRoot: ShadowRoot | undefined }) {
        const { shadowRoot } = params;
        if (shadowRoot) {
            if ((shadowRoot as any).getSelection) {
                // Chrome/Edge. See details here: https://caniuse.com/mdn-api_shadowroot_getselection
                return (shadowRoot as any).getSelection();
            }
        }
        // Works fine in other cases
        return window.getSelection();
    }

    static getSelectionRange0(params: { selection: Selection; shadowRoot: ShadowRoot | undefined }) {
        const { selection, shadowRoot } = params;
        if (shadowRoot) {
            if ((selection as any).getComposedRanges) {
                // Webkit. https://w3c.github.io/selection-api/#dom-selection-getcomposedranges
                return (selection as any).getComposedRanges(shadowRoot)[0];
            }
        }
        return selection.getRangeAt(0);
    }
}

export const createTempEditor = (plugins: PlatePlugin[]): PlateEditor => {
    return createPlateEditor({
        plugins: createPlugins((plugins).flat(), {
            components: createPlateUI(),
        }),
    });
};

/** Consider slate and plate migarions */
export const initializeEditor = (editor: PlateEditor<Value>, v: EditorValue): Value => {
    let value: Value;
    if (!v) {
        value = [createNode(PARAGRAPH_TYPE)];
    } else {
        if (!Array.isArray(v)) {
            value = migrateSlateSchema(v); // slate migraitons
        } else {
            value = v;
        }
    }

    editor.children = value;
    editor.normalize({ force: true }); // plate migratoins

    return editor.children;
};

/** type guard to support two modes: with strictNullCheck and without, try toggle editor tsconfig setting */
export const isSlateSchema = (value: EditorValue): value is SlateSchema => {
    return !!value && !Array.isArray(value);
};

export const isPlateValue = (value: EditorValue): value is Value => {
    return Array.isArray(value);
};
