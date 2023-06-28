import React, { useMemo, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IEditable, uuiMod, IHasCX, cx, IHasRawProps } from '@epam/uui-core';
import { ScrollBars } from '@epam/uui-components';
import { useForceUpdate } from '@epam/uui-core';

import {
    Plate,
    createPlugins,
    createPlateUI,
    usePlateEditorState,
    Toolbar,
    createSoftBreakPlugin,
    createExitBreakPlugin,
    PlateProvider,
    useEventEditorSelectors,
    isElementEmpty,
    Value,
    createTextIndentPlugin,
    createIndentListPlugin,
} from '@udecode/plate';

import { createJuicePlugin } from '@udecode/plate-juice';
import { ToolbarButtons, MarkBalloonToolbar, } from './plate/plugins/Toolbars';

import { migrateSchema } from './migration';

import { baseMarksPlugin, paragraphPlugin } from './plate/plugins';

import css from './SlateEditor.module.scss';
import { createDeserializeDocxPlugin } from './plate/plugins/deserializeDocxPlugin/deserializeDocxPlugin';

let components = createPlateUI();

export type EditorValue = Value | null;


/**
 * Please make sure defaultPlugins and all your plugins are not interfere
 * with the following list when disableCorePlugins prop hasn't been set
 * https://github.com/udecode/plate/blob/main/docs/BREAKING_CHANGES.md#general
 */
export const defaultPlugins: any = [
    createIndentListPlugin(),
    createTextIndentPlugin(),
    createSoftBreakPlugin(),
    createExitBreakPlugin(),
    createDeserializeDocxPlugin(),
    createJuicePlugin(),
    paragraphPlugin(),
];

export const basePlugins: any = [
    baseMarksPlugin(),
    ...defaultPlugins,
];

interface SlateEditorProps extends IEditable<EditorValue>, IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    isReadonly?: boolean;
    plugins?: any[];
    autoFocus?: boolean;
    minHeight?: number | 'none';
    placeholder?: string;
    mode?: 'form' | 'inline';
    fontSize?: '14' | '16';
    onKeyDown?: (event: KeyboardEvent, value: any | null) => void;
    onBlur?: (event: FocusEvent, value: any | null) => void;
    scrollbars?: boolean;
}

interface PlateEditorProps extends SlateEditorProps {
    initialValue: Value,
    onChange: (newValue: Value) => void,
    id: string,
}

const Editor = (props: PlateEditorProps) => {
    const editor = usePlateEditorState();

    const focusedEditorId = useEventEditorSelectors.focus();
    const isFocused = editor.id === focusedEditorId;
    const forceUpdate = useForceUpdate();

    if (props.initialValue && editor.children !== props.initialValue) {
        editor.children = props.initialValue;
        forceUpdate();
    }

    const renderEditor = () => (
        <DndProvider backend={ HTML5Backend }>
            <Plate
                { ...props }
                id={ props.id }
                editableProps={ {
                    autoFocus: props.autoFocus,
                    readOnly: props.isReadonly,
                    placeholder: props.placeholder,
                    renderPlaceholder: ({ attributes }) => {
                        const shouldShowPlaceholder = isElementEmpty(editor, editor.children[0]) && editor.children[0].type === 'paragraph';
                        return shouldShowPlaceholder && (
                            <div
                                { ...attributes }
                                style={ { pointerEvents: 'none' } }
                                className={ css.placeholder }>
                                { props.placeholder }
                            </div>
                        );
                    },
                    style: { padding: '0 24px', minHeight: props.minHeight }
                } }

                // we override plate core insertData plugin
                // so, we need to disable default implementation
                disableCorePlugins={ { insertData: true } }
            />
            < MarkBalloonToolbar />
            <Toolbar style={ {
                position: 'sticky',
                bottom: 12,
                display: 'flex',
                minHeight: 0,
                zIndex: 50,
            } }>
                <ToolbarButtons />
            </Toolbar>
        </DndProvider >
    );

    return (
        <div
            className={ cx(
                props.cx,
                css.container,
                css['mode-' + (props.mode || 'form')],
                (!props.isReadonly && isFocused) && uuiMod.focus,
                props.isReadonly && uuiMod.readonly,
                props.scrollbars && css.withScrollbars,
                css.typographyPromo,
                props.fontSize == '16' ? css.typography16 : css.typography14,
            ) }
            style={ { minHeight: props.minHeight || 350 } }
            { ...props.rawProps }
        >
            { props.scrollbars
                ? <ScrollBars cx={ css.scrollbars } style={ { width: '100%' } }>
                    { renderEditor() }
                </ScrollBars>
                : renderEditor()
            }
        </div>
    );
};

export function SlateEditor(props: SlateEditorProps) {
    const currentId = useRef(String(Date.now()));

    const plugins = createPlugins((props.plugins || []).flat(), {
        components,
    });

    const onChange = (value: Value) => {
        if (props.isReadonly) return;
        props?.onValueChange(value);
    };

    const initialValue = useMemo(() => migrateSchema(props.value), [props.value]);

    return (
        <PlateProvider
            onChange={ onChange }
            plugins={ plugins }
            initialValue={ initialValue }
            id={ currentId.current }
        >
            <Editor
                onChange={ onChange }
                id={ currentId.current }
                initialValue={ initialValue }
                plugins={ plugins }
                { ...props }
            />
        </PlateProvider>
    );
}
