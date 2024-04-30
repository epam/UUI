import React, {
    FocusEventHandler, forwardRef, Fragment, KeyboardEventHandler, memo, useCallback, useMemo, useRef,
} from 'react';
import {
    IEditable, IHasCX, IHasRawProps, cx, useForceUpdate, uuiMod,
} from '@epam/uui-core';
import { ScrollBars } from '@epam/uui';
import {
    Plate, PlateContent, PlateEditor, PlatePlugin, Value, createPlugins, useEditorRef, useComposedRef,
} from '@udecode/plate-common';

import { createPlateUI } from './components';
import { migrateSchema } from './migration';
import { baseMarksPlugin, paragraphPlugin } from './plugins';
import { Toolbars } from './implementation/Toolbars';
import { EditorValue } from './types';
import { defaultPlugins } from './defaultPlugins';

import css from './SlateEditor.module.scss';
import { isEditorValueEmpty } from './helpers';
import { useFocusEvents } from './plugins/eventEditorPlugin/eventEditorPlugin';

const basePlugins: PlatePlugin[] = [
    ...baseMarksPlugin(),
    ...defaultPlugins,
];

const disabledPlugins = { insertData: true };

interface PlateEditorProps extends IEditable<EditorValue>, IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    id: string;
    isReadonly?: boolean;
    plugins?: any[];
    autoFocus?: boolean;
    minHeight?: number | 'none';
    placeholder?: string;
    mode?: 'form' | 'inline';
    fontSize?: '14' | '16';
    onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
    onBlur?: FocusEventHandler<HTMLDivElement>;
    onFocus?: FocusEventHandler<HTMLDivElement>;
    scrollbars?: boolean;
    toolbarPosition?: 'floating' | 'fixed';
}

const Editor = memo(forwardRef<HTMLDivElement, Omit<PlateEditorProps, 'value' | 'onValueChange' | 'plugins'>>(({
    id,
    isReadonly,
    autoFocus,
    fontSize,
    cx: classes,
    scrollbars,
    placeholder,
    toolbarPosition,
    onKeyDown,
    onBlur,
    onFocus,
    rawProps,
    minHeight,
    mode = 'form',
}, ref) => {
    const editor = useEditorRef(id);
    const editorWrapperRef = useRef<HTMLDivElement>();

    /**
     * Handles editor focus
     */
    useFocusEvents({
        editorId: id,
        onFocus: useCallback(() => {
            const allowFocus = editorWrapperRef.current && !isReadonly;
            if (allowFocus) {
                editorWrapperRef.current.classList.add(uuiMod.focus);
            }
        }, [isReadonly]),
        onBlur: useCallback(() => {
            if (editorWrapperRef.current) {
                editorWrapperRef.current.classList.remove(uuiMod.focus);
            }
        }, []),
    });

    const autoFocusRef = useCallback((node: HTMLDivElement) => {
        if (!editorWrapperRef.current && node) {
            editorWrapperRef.current = node;

            if (!isReadonly && autoFocus) {
                editorWrapperRef.current.classList.add(uuiMod.focus);
            }
        }
        return editorWrapperRef;
    }, [autoFocus, isReadonly]);

    const contentStyle = useMemo(() => ({ minHeight }), [minHeight]);

    const renderEditor = () => (
        <Fragment>
            <PlateContent
                id={ id }
                autoFocus={ autoFocus }
                readOnly={ isReadonly }
                className={ css.editor }
                onKeyDown={ onKeyDown }
                onBlur={ onBlur }
                onFocus={ onFocus }
                placeholder={ isEditorValueEmpty(editor.children) ? placeholder : undefined }
                style={ contentStyle }
            />
            <Toolbars toolbarPosition={ toolbarPosition } />
        </Fragment>
    );
    return (
        <div
            ref={ useComposedRef(autoFocusRef, ref) }
            className={ cx(
                'uui-typography',
                classes,
                css.container,
                css['mode-' + mode],
                isReadonly && uuiMod.readonly,
                scrollbars && css.withScrollbars,
                fontSize === '16' ? 'uui-typography-size-16' : 'uui-typography-size-14',
            ) }
            { ...rawProps }
        >
            { scrollbars
                ? (
                    <ScrollBars cx={ css.scrollbars }>
                        { renderEditor() }
                    </ScrollBars>
                )
                : renderEditor()}
        </div>
    );
}));

const SlateEditor = forwardRef<HTMLDivElement, Omit<PlateEditorProps, 'id'>>(({
    plugins: _plugins = [paragraphPlugin()],
    isReadonly,
    onValueChange,
    value: _value,
    autoFocus,
    fontSize,
    cx: classes,
    scrollbars,
    placeholder,
    toolbarPosition,
    rawProps,
    mode,
    onKeyDown,
    onBlur,
    onFocus,
}, ref) => {
    const currentId = useRef(String(Date.now()));
    const editor = useRef<PlateEditor | null>(null);

    const plugins = useMemo(
        () => createPlugins((_plugins).flat(), { components: createPlateUI() }),
        [_plugins],
    );

    const onChange = useCallback((v: Value) => {
        if (isReadonly) {
            return;
        }
        onValueChange(v);
    }, [isReadonly, onValueChange]); // onValueChange should be in deps ideally

    const value = useMemo(() => {
        return migrateSchema(_value);
    }, [_value]);

    const forceUpdate = useForceUpdate();
    if (value && editor.current?.children && editor.current.children !== value) {
        editor.current.children = value;
        forceUpdate();
    }

    return (
        <Plate
            id={ currentId.current }
            initialValue={ value }
            plugins={ plugins }
            onChange={ onChange }
            editorRef={ editor }
            // we override plate core insertData plugin
            // so, we need to disable default implementation
            disableCorePlugins={ disabledPlugins }
        >
            <Editor
                id={ currentId.current }
                ref={ ref }
                cx={ classes }
                autoFocus={ autoFocus }
                fontSize={ fontSize }
                scrollbars={ scrollbars }
                isReadonly={ isReadonly }
                placeholder={ placeholder }
                toolbarPosition={ toolbarPosition }
                onKeyDown={ onKeyDown }
                onBlur={ onBlur }
                onFocus={ onFocus }
                rawProps={ rawProps }
                mode={ mode }
            />
        </Plate>
    );
});

export { SlateEditor, basePlugins };
