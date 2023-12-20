import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import { IEditable, IHasCX, IHasRawProps, cx, useForceUpdate, uuiMod } from '@epam/uui-core';
import { ScrollBars } from '@epam/uui';

import { Plate, PlateContent, PlateEditor, Value, createPlugins, useEditorState, useEventEditorSelectors, WithPlatePlugin } from '@udecode/plate-common';

import { createPlateUI } from './components';
import { migrateSchema } from './migration';
import { baseMarksPlugin } from './plugins';
import { EditorValue, WithButtonPlugin } from './types';
import { defaultPlugins } from './defaultPlugins';
import { isEditorValueEmpty } from './helpers';

import css from './SlateEditor.module.scss';
import { RenderPlaceholderProps } from 'slate-react';
import { StickyToolbar } from './implementation/StickyToolbar';
import { PositionedToolbar } from './implementation/PositionedToolbar';

const basePlugins: any = [
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
    toolbarPosition?: 'below' | 'above';
    toolbarOnFocus?: boolean;
}

interface PlateEditorProps extends SlateEditorProps {
    id: string,
}

function Editor(props: PlateEditorProps) {
    const editor = useEditorState();
    const toolbarPosition = props.toolbarPosition || 'below';
    const toolbarOnFocus = props.toolbarOnFocus || false;

    const focusedEditorId = useEventEditorSelectors.focus();
    const isFocused = editor.id === focusedEditorId;

    const considerFocus = toolbarOnFocus ? isFocused : true;
    const renderToolbarAbove = toolbarPosition === 'above' && !props.isReadonly && considerFocus;
    const renderToolbarBelow = toolbarPosition === 'below' && !props.isReadonly && considerFocus;

    const renderPlaceholder = (p: RenderPlaceholderProps) => {
        return (
            <Placeolder
                placeholder={ props.placeholder }
                children={ p.children }
                attributes={ p.attributes }
            />
        );
    };

    const renderEditor = () => {
        return (
            <Fragment>
                <PlateContent
                    id={ props.id }
                    autoFocus={ props.autoFocus }
                    readOnly={ props.isReadonly }
                    placeholder={ props.placeholder }
                    className={ css.editor }
                    renderPlaceholder={ renderPlaceholder }
                    style={ { height: '100%', padding: '0 24px', minHeight: props.minHeight } }
                />
                {renderToolbarAbove && <StickyToolbar />}
                <PositionedToolbar isImage={ false }>
                    { editor.plugins.map((p: WithPlatePlugin<WithButtonPlugin>) => {
                        const Button = p.options?.floatingBarButton;
                        return Button && <Button editor={ editor } />;
                    }) }
                </PositionedToolbar>
            </Fragment>
        );
    };

    return (
        <Fragment>
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
            {renderToolbarBelow && <StickyToolbar />}
        </Fragment>
    );
}

const DISABLE_CORE_PLUGINS = { insertData: true };

function SlateEditor(props: SlateEditorProps) {
    const currentId = useRef(String(Date.now()));
    const [editor, setEditor] = useState<PlateEditor>();

    const plugins = useMemo(
        () => {
            return createPlugins((props.plugins || []).flat(), { components: createPlateUI() });
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

    const initRef = useCallback((e: PlateEditor | null) => {
        if (e) {
            setEditor(e);
        }
    }, [setEditor]);

    const forceUpdate = useForceUpdate();
    if (value && editor?.children && editor.children !== value) {
        editor.children = value;
        forceUpdate();
    }

    return (
        <Plate
            id={ currentId.current }
            initialValue={ value }
            plugins={ plugins }
            onChange={ onChange }
            editorRef={ initRef }
            // we override plate core insertData plugin
            // so, we need to disable default implementation
            disableCorePlugins={ DISABLE_CORE_PLUGINS }
        >
            <Editor
                id={ currentId.current }
                { ...props }
            />
        </Plate>
    );
}

interface PlaceholderProps extends RenderPlaceholderProps {
    placeholder?: string;
}

function Placeolder({ attributes, placeholder }: PlaceholderProps) {
    const editor = useEditorState();

    if (isEditorValueEmpty(editor.children)) {
        return (
            <div
                { ...attributes }
                style={ { pointerEvents: 'none' } }
                className={ css.placeholder }
            >
                { placeholder }
            </div>
        );
    }
    return null;
}

export { SlateEditor, basePlugins };
