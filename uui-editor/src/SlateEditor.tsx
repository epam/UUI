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

const Editor = memo(forwardRef<HTMLDivElement, Omit<PlateEditorProps, 'value' | 'onValueChange'>>((props, ref) => {
    const editor = useEditorRef(props.id);
    const editorWrapperRef = useRef<HTMLDivElement>();

    /**
     * Handles editor focus
     */
    useFocusEvents({
        editorId: props.id,
        onFocus: useCallback(() => {
            const allowFocus = editorWrapperRef.current && !props.isReadonly;
            if (allowFocus) {
                editorWrapperRef.current.classList.add(uuiMod.focus);
            }
        }, [props.isReadonly]),
        onBlur: useCallback(() => {
            if (editorWrapperRef.current) {
                editorWrapperRef.current.classList.remove(uuiMod.focus);
            }
        }, []),
    });

    const autoFocusRef = useCallback((node: HTMLDivElement) => {
        if (!editorWrapperRef.current && node) {
            editorWrapperRef.current = node;

            if (!props.isReadonly && props.autoFocus) {
                editorWrapperRef.current.classList.add(uuiMod.focus);
            }
        }
        return editorWrapperRef;
    }, [props.autoFocus, props.isReadonly]);

    const renderEditor = () => (
        <Fragment>
            <PlateContent
                id={ props.id }
                autoFocus={ props.autoFocus }
                readOnly={ props.isReadonly }
                className={ css.editor }
                onKeyDown={ props.onKeyDown }
                onBlur={ props.onBlur }
                onFocus={ props.onFocus }
                placeholder={ isEditorValueEmpty(editor.children) ? props.placeholder : undefined }
                style={ { minHeight: props.minHeight } }
            />
            <Toolbars toolbarPosition={ props.toolbarPosition } />
        </Fragment>
    );
    return (
        <div
            ref={ useComposedRef(autoFocusRef, ref) }
            className={ cx(
                'uui-typography',
                props.cx,
                css.container,
                css['mode-' + (props.mode || 'form')],
                props.isReadonly && uuiMod.readonly,
                props.scrollbars && css.withScrollbars,
                props.fontSize === '16' ? 'uui-typography-size-16' : 'uui-typography-size-14',
            ) }
            { ...props.rawProps }
        >
            { props.scrollbars
                ? (
                    <ScrollBars cx={ css.scrollbars }>
                        { renderEditor() }
                    </ScrollBars>
                )
                : renderEditor()}
        </div>
    );
}));

const SlateEditor = forwardRef<HTMLDivElement, Omit<PlateEditorProps, 'id'>>((props, ref) => {
    const currentId = useRef(String(Date.now()));
    const editor = useRef<PlateEditor | null>(null);

    const plugins = useMemo(
        () => {
            return createPlugins((props.plugins || [paragraphPlugin()]).flat(), { components: createPlateUI() });
        },
        [props.plugins],
    );

    const onChange = useCallback((value: Value) => {
        if (props.isReadonly) {
            return;
        }
        props.onValueChange(value);
    }, [props.isReadonly]);// onValueChange should be in deps ideally

    const value = useMemo(() => {
        return migrateSchema(props.value);
    }, [props.value]);

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
                ref={ ref }
                autoFocus={ props.autoFocus }
                cx={ props.cx }
                fontSize={ props.fontSize }
                id={ currentId.current }
                scrollbars={ props.scrollbars }
                isReadonly={ props.isReadonly }
                placeholder={ props.placeholder }
                toolbarPosition={ props.toolbarPosition }
                onKeyDown={ props.onKeyDown }
                onBlur={ props.onBlur }
                onFocus={ props.onFocus }
            />
        </Plate>
    );
});

export { SlateEditor, basePlugins };
