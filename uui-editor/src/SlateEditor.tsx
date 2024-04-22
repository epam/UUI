import React, {
    FocusEventHandler, Fragment, KeyboardEventHandler, useMemo, useRef,
} from 'react';
import {
    IEditable, IHasCX, IHasRawProps, cx, useForceUpdate, uuiMod,
} from '@epam/uui-core';
import { ScrollBars } from '@epam/uui';
import {
    Plate, PlateContent, PlateEditor, PlatePlugin, Value, createPlugins, useEditorState, useEventEditorSelectors,
} from '@udecode/plate-common';

import { createPlateUI } from './components';
import { migrateSchema } from './migration';
import { baseMarksPlugin, paragraphPlugin } from './plugins';
import { Toolbars } from './implementation/Toolbars';
import { EditorValue } from './types';
import { defaultPlugins } from './defaultPlugins';

import css from './SlateEditor.module.scss';
import { isEditorValueEmpty } from './helpers';

const basePlugins: PlatePlugin[] = [
    ...baseMarksPlugin(),
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
    onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
    onBlur?: FocusEventHandler<HTMLDivElement>;
    onFocus?: FocusEventHandler<HTMLDivElement>;
    scrollbars?: boolean;
    toolbarPosition?: 'floating' | 'fixed';
}

interface PlateEditorProps extends SlateEditorProps {
    id: string,
}

function Editor(props: PlateEditorProps) {
    const editor = useEditorState();
    const focusedEditorId = useEventEditorSelectors.focus();
    const isFocused = editor.id === focusedEditorId;

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
            className={ cx(
                'uui-typography',
                props.cx,
                css.container,
                css['mode-' + (props.mode || 'form')],
                (!props.isReadonly && isFocused) && uuiMod.focus,
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
}

function SlateEditor(props: SlateEditorProps) {
    const currentId = useRef(String(Date.now()));
    const editor = useRef<PlateEditor | null>(null);

    const plugins = useMemo(
        () => {
            return createPlugins((props.plugins || [paragraphPlugin()]).flat(), { components: createPlateUI() });
        },
        [props.plugins],
    );

    const onChange = (value: Value) => {
        if (props.isReadonly) return;
        props?.onValueChange(value);
    };

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
            disableCorePlugins={ { insertData: true } }
        >
            <Editor
                id={ currentId.current }
                { ...props }
            />
        </Plate>
    );
}

export { SlateEditor, basePlugins };
