import { ScrollBars } from '@epam/uui-components';
import { IEditable, IHasCX, IHasRawProps, cx, useForceUpdate, uuiMod } from '@epam/uui-core';
import React, { Fragment, useMemo, useRef } from 'react';

import { createExitBreakPlugin, createSoftBreakPlugin } from '@udecode/plate-break';
import {
    Plate,
    PlateProvider,
    Value,
    createPlugins,
    useEventEditorSelectors,
    usePlateEditorState
} from '@udecode/plate-common';
import { createTextIndentPlugin } from '@udecode/plate-indent';
import { createIndentListPlugin } from '@udecode/plate-indent-list';
import { createJuicePlugin } from '@udecode/plate-juice';
import { createDeserializeDocxPlugin } from './plugins/deserializeDocxPlugin/deserializeDocxPlugin';

import css from './SlateEditor.module.scss';
import { createPlateUI } from './components';
import { migrateSchema } from './migration';
import { baseMarksPlugin, paragraphPlugin } from './plugins';
import { MainToolbar, MarksToolbar } from './plugins/Toolbars';
import { isElementEmpty } from './helpers';
import { EditorValue } from './types';

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

function Editor(props: PlateEditorProps) {
    const editor = usePlateEditorState();

    const focusedEditorId = useEventEditorSelectors.focus();
    const isFocused = editor.id === focusedEditorId;
    const forceUpdate = useForceUpdate();

    if (props.initialValue && editor.children !== props.initialValue) {
        editor.children = props.initialValue;
        forceUpdate();
    }

    const renderEditor = () => (
        <Fragment>
            <Plate
                { ...props }
                id={ props.id }
                editableProps={ {
                    autoFocus: props.autoFocus,
                    readOnly: props.isReadonly,
                    placeholder: props.placeholder,
                    renderPlaceholder: ({ attributes }) => {
                        const shouldShowPlaceholder = isElementEmpty(editor.children);
                        return shouldShowPlaceholder && (
                            <div
                                { ...attributes }
                                style={ { pointerEvents: 'none' } }
                                className={ css.placeholder }
                            >
                                { props.placeholder }
                            </div>
                        );
                    },
                    style: { padding: '0 24px', minHeight: props.minHeight },
                } }

                // we override plate core insertData plugin
                // so, we need to disable default implementation
                disableCorePlugins={ { insertData: true } }
            />
            <MainToolbar />
            <MarksToolbar />
        </Fragment>
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
                props.fontSize === '16' ? css.typography16 : css.typography14,
            ) }
            style={ { minHeight: props.minHeight || 350 } }
            { ...props.rawProps }
        >
            { props.scrollbars
                ? (
                    <ScrollBars cx={ css.scrollbars } style={ { width: '100%' } }>
                        { renderEditor() }
                    </ScrollBars>
                )
                : renderEditor()}
        </div>
    );
}

export function SlateEditor(props: SlateEditorProps) {
    const currentId = useRef(String(Date.now()));

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
