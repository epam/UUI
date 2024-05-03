import React, {
    FocusEventHandler, forwardRef, Fragment, KeyboardEventHandler, memo, useCallback, useMemo, useRef,
} from 'react';
import {
    IEditable, IHasCX, IHasRawProps, cx, uuiMod, useForceUpdate,
} from '@epam/uui-core';
import { ScrollBars } from '@epam/uui';
import {
    Plate, PlateContent, PlateEditor, PlatePlugin, Value, createPlugins, useComposedRef,
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

const SlateEditor = memo(forwardRef<HTMLDivElement, PlateEditorProps>(({
    value: propsValue,
    onValueChange,
    plugins: propsPlugins = [paragraphPlugin()],
    cx: classes,
    isReadonly,
    autoFocus,
    fontSize,
    scrollbars,
    placeholder,
    toolbarPosition,
    rawProps,
    mode = 'form',
    onKeyDown,
    onBlur,
    onFocus,
    minHeight,
}, ref) => {
    const currentId = useRef(String(Date.now()));
    const editorRef = useRef<PlateEditor | null>(null);
    const editableWrapperRef = useRef<HTMLDivElement>();

    /** config */
    const plugins = useMemo(
        () => createPlugins((propsPlugins).flat(), { components: createPlateUI() }),
        [propsPlugins],
    );

    /** value */
    const value = useMemo(() => { return migrateSchema(propsValue); }, [propsValue]);
    const onChange = useCallback((v: Value) => {
        if (isReadonly) {
            return;
        }
        onValueChange(v);
    }, [isReadonly, onValueChange]);

    /** styles */
    const contentStyle = useMemo(() => ({ minHeight }), [minHeight]);
    const editorWrapperClassNames = useMemo(() => cx(
        'uui-typography',
        classes,
        css.container,
        css['mode-' + mode],
        isReadonly && uuiMod.readonly,
        scrollbars && css.withScrollbars,
        fontSize === '16' ? 'uui-typography-size-16' : 'uui-typography-size-14',
    ), [classes, fontSize, isReadonly, mode, scrollbars]);

    /** focus management */
    /** TODO: move to plate */
    useFocusEvents({ editorId: currentId.current, editorWrapperRef: editableWrapperRef, isReadonly });
    const autoFocusRef = useCallback((node: HTMLDivElement) => {
        if (!editableWrapperRef.current && node) {
            editableWrapperRef.current = node;

            if (!isReadonly && autoFocus) {
                editableWrapperRef.current.classList.add(uuiMod.focus);
            }
        }
        return editableWrapperRef;
    }, [autoFocus, isReadonly]);

    /** render related */
    /** could not be memoized, since slate is uncontrolled component */
    const renderEditable = useCallback(() => {
        return (
            <Fragment>
                <PlateContent
                    id={ currentId.current }
                    autoFocus={ autoFocus }
                    readOnly={ isReadonly }
                    className={ css.editor }
                    onKeyDown={ onKeyDown }
                    onBlur={ onBlur }
                    onFocus={ onFocus }
                    placeholder={ editorRef.current
                        && isEditorValueEmpty(editorRef.current.children)
                        ? placeholder : undefined }
                    style={ contentStyle }
                />
                <Toolbars toolbarPosition={ toolbarPosition } />
            </Fragment>
        );
    }, [autoFocus, contentStyle, isReadonly, onBlur, onFocus, onKeyDown, placeholder, toolbarPosition]);

    const editorContent = scrollbars
        ? <ScrollBars cx={ css.scrollbars }>{ renderEditable() }</ScrollBars>
        : renderEditable();

    /** force update of uncontrolled component */
    const forceUpdate = useForceUpdate();
    if (value && editorRef.current && editorRef.current.children !== value) {
        editorRef.current.children = value;
        forceUpdate();
    }

    return (
        <Plate
            id={ currentId.current }
            initialValue={ value }
            plugins={ plugins }
            onChange={ onChange }
            editorRef={ editorRef }
            disableCorePlugins={ disabledPlugins }
        >
            <div
                ref={ useComposedRef(autoFocusRef, ref) }
                className={ editorWrapperClassNames }
                { ...rawProps }
            >
                {editorContent}
            </div>
        </Plate>
    );
}));

export { SlateEditor, basePlugins };
