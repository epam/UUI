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

const SlateEditor = memo(forwardRef<HTMLDivElement, PlateEditorProps>((props, ref) => {
    const currentId = useRef(String(Date.now()));
    const editorRef = useRef<PlateEditor | null>(null);
    const editableWrapperRef = useRef<HTMLDivElement>();

    /** config */
    const plugins = useMemo(
        () => createPlugins((props.plugins || [paragraphPlugin()]).flat(), { components: createPlateUI() }),
        [props.plugins],
    );

    /** value */
    const value = useMemo(() => { return migrateSchema(props.value); }, [props.value]);
    const onChange = useCallback((v: Value) => {
        if (props.isReadonly) {
            return;
        }
        props.onValueChange(v);
    }, [props.isReadonly, props.onValueChange]);

    /** styles */
    const contentStyle = useMemo(() => ({ minHeight: props.minHeight }), [props.minHeight]);
    const editorWrapperClassNames = useMemo(() => cx(
        'uui-typography',
        props.cx,
        css.container,
        css['mode-' + (props.mode || 'form')],
        props.isReadonly && uuiMod.readonly,
        props.scrollbars && css.withScrollbars,
        props.fontSize === '16' ? 'uui-typography-size-16' : 'uui-typography-size-14',
    ), [props.cx, props.fontSize, props.isReadonly, props.mode, props.scrollbars]);

    /** focus management */
    /** TODO: move to plate */
    useFocusEvents({ editorId: currentId.current, editorWrapperRef: editableWrapperRef, isReadonly: props.isReadonly });
    const autoFocusRef = useCallback((node: HTMLDivElement) => {
        if (!editableWrapperRef.current && node) {
            editableWrapperRef.current = node;

            if (!props.isReadonly && props.autoFocus) {
                editableWrapperRef.current.classList.add(uuiMod.focus);
            }
        }
        return editableWrapperRef;
    }, [props.autoFocus, props.isReadonly]);

    /** render related */
    /** could not be memoized, since slate is uncontrolled component */
    const renderEditable = useCallback(() => {
        return (
            <Fragment>
                <PlateContent
                    id={ currentId.current }
                    autoFocus={ props.autoFocus }
                    readOnly={ props.isReadonly }
                    className={ css.editor }
                    onKeyDown={ props.onKeyDown }
                    onBlur={ props.onBlur }
                    onFocus={ props.onFocus }
                    placeholder={ editorRef.current
                        && isEditorValueEmpty(editorRef.current.children)
                        ? props.placeholder : undefined }
                    style={ contentStyle }
                />
                <Toolbars toolbarPosition={ props.toolbarPosition } />
            </Fragment>
        );
    }, [props.autoFocus, contentStyle, props.isReadonly, props.onBlur, props.onFocus, props.onKeyDown, props.placeholder, props.toolbarPosition]);

    const editorContent = props.scrollbars
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
                { ...props.rawProps }
            >
                {editorContent}
            </div>
        </Plate>
    );
}));

export { SlateEditor, basePlugins };
