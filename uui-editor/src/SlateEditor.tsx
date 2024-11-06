import React, {
    FocusEventHandler, forwardRef, KeyboardEventHandler, memo, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {
    IHasCX, IHasRawProps, cx, uuiMod, useForceUpdate,
    IEditable,
} from '@epam/uui-core';
import { ScrollBars } from '@epam/uui';
import {
    Plate, PlateContent, PlateEditor, PlatePlugin, Value, createPlugins, useComposedRef,
} from '@udecode/plate-common';

import { createPlateUI } from './components';
import { Toolbars } from './implementation/Toolbars';
import { EditorValue } from './types';

import css from './SlateEditor.module.scss';
import { useFocusEvents } from './plugins/eventEditorPlugin';
import { isEditorValueEmpty } from './helpers';
import { getMigratedPlateValue, isPlateValue } from './migrations';
import { PlateProps } from '@udecode/plate-core';
import isEqual from 'react-fast-compare';

export interface PlateEditorProps
    extends IEditable<EditorValue>,
    IHasCX,
    IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, Pick<PlateProps, 'maxLength'> {
    plugins: PlatePlugin[];
    isReadonly?: boolean;
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

export const SlateEditor = memo(forwardRef<HTMLDivElement, PlateEditorProps>((props, ref) => {
    const [currentId] = useState(String(Date.now()));
    const editorRef = useRef<PlateEditor | null>(null);
    const editableWrapperRef = useRef<HTMLDivElement>();
    const prevChangedValue = useRef(props.value);

    /** value */
    /** consider legacy slate to plate content migraions once. should be deprecated in the near future */
    const plateValue: Value | undefined = useMemo(
        () => {
            return getMigratedPlateValue(props.value);
        },
        [props.value],
    );

    const initialPlateValue: Value | undefined = useMemo(() => {
        const content = editorRef.current?.children;
        if (content) return content;

        return plateValue;
    }, [plateValue]);

    const { isReadonly, onValueChange } = props;
    const onChange = useCallback((v: Value) => {
        if (isReadonly) {
            return;
        }
        prevChangedValue.current = v;
        onValueChange(v);
    }, [isReadonly, onValueChange]);

    /** config */
    const plugins = useMemo(
        () => createPlugins(props.plugins, { components: createPlateUI() }),
        [props.plugins],
    );

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
    useFocusEvents({
        editorId: currentId,
        editorWrapperRef: editableWrapperRef,
        isReadonly: props.isReadonly,
    });

    const autoFocusRef = useCallback((node: HTMLDivElement) => {
        if (!editableWrapperRef.current && node) {
            editableWrapperRef.current = node;

            if (!props.isReadonly && props.autoFocus) {
                editableWrapperRef.current.classList.add(uuiMod.focus);
            }
        }
        return editableWrapperRef;
    }, [props.autoFocus, props.isReadonly]);
    const composedRef = useComposedRef(autoFocusRef, ref);

    /** render related */
    const renderContent = useCallback(() => {
        const editor = editorRef.current;
        const displayPlaceholder = !editor || (!!editor.children && isEditorValueEmpty(editor.children));
        const placeholder = displayPlaceholder ? props.placeholder : undefined;
        return (
            <PlateContent
                id={ currentId }
                autoFocus={ props.autoFocus }
                readOnly={ props.isReadonly }
                className={ css.editor }
                onKeyDown={ props.onKeyDown }
                onBlur={ props.onBlur }
                onFocus={ props.onFocus }
                placeholder={ placeholder }
                style={ contentStyle }
            />
        );
    }, [props.placeholder, props.autoFocus, props.isReadonly, props.onKeyDown, props.onBlur, props.onFocus, currentId, contentStyle]);

    /** could not be memoized, since slate is uncontrolled component */
    const content = props.scrollbars
        ? <ScrollBars cx={ css.scrollbars }>{ renderContent() }</ScrollBars>
        : renderContent();

    /** force update of uncontrolled component. Danger part, because Slate component is uncontrolled by default and doesn't support value change after init.
     * This code can produce unexpected effects and bugs, e.g. updating value in a such value doesn't call value normalizers.
     * We just guarantee that we can apply value change from empty state to the new one, like after content loading. Try to avoid updating editor value in other cases.
     */
    const forceUpdate = useForceUpdate();
    useEffect(() => {
        if (isPlateValue(plateValue) && editorRef.current && !isEqual(prevChangedValue.current, props.value)) {
            editorRef.current.children = plateValue;
            prevChangedValue.current = props.value;
            forceUpdate();
        }
    }, [props.value]);

    return (
        <Plate
            key={ currentId }
            id={ currentId }
            initialValue={ initialPlateValue }
            normalizeInitialValue // invokes plate migrations
            plugins={ plugins }
            onChange={ onChange }
            editorRef={ editorRef }
            maxLength={ props.maxLength }
        >
            <div
                ref={ composedRef }
                className={ editorWrapperClassNames }
                { ...props.rawProps }
            >
                {content}
                <Toolbars toolbarPosition={ props.toolbarPosition } />
            </div>
        </Plate>
    );
}));
