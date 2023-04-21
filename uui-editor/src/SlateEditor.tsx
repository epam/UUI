import React, { useMemo, useEffect, useState, useRef } from 'react';
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
    TRenderElementProps,
    TEditableProps,
    Toolbar,
    createSoftBreakPlugin,
    createParagraphPlugin,
    createExitBreakPlugin,
    PlateProvider,
    createDeserializeDocxPlugin,
    useEventEditorSelectors,
} from '@udecode/plate';

import { createJuicePlugin } from '@udecode/plate-juice';

import {
    ToolbarButtons,
    MarkBalloonToolbar,
} from './plate/plugins/Toolbars';

import { migrateSchema } from './migration';

import { baseMarksPlugin } from './plate/plugins';

import style from '@epam/assets/scss/promo/typography.scss';
import css from './SlateEditor.scss';

let components = createPlateUI();

/**
 * Please make sure defaultPlugins and all your plugins are not interfere
 * with the following list when disableCorePlugins prop hasn't been set
 * https://github.com/udecode/plate/blob/main/docs/BREAKING_CHANGES.md#general
 */
export const defaultPlugins: any = [
    createSoftBreakPlugin(),
    createExitBreakPlugin(),
    createParagraphPlugin(),
    createDeserializeDocxPlugin(),
    createJuicePlugin(),
];

export const basePlugins: any = [
    baseMarksPlugin(),
    ...defaultPlugins,
];

interface SlateEditorProps extends IEditable<any | null>, IHasCX, IHasRawProps<HTMLDivElement> {
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

const Editor = ({ initialValue, ...props }: any) => {
    const editor = usePlateEditorState();
    const forceUpdate = useForceUpdate();

    const focusedEditorId = useEventEditorSelectors.focus();
    const isFocused = editor.id === focusedEditorId;

    useEffect(() => {
        if (initialValue) {
            editor.children = initialValue;
        }
    }, [editor, initialValue, forceUpdate]);

    const renderEditor = () => (
        <DndProvider backend={ HTML5Backend }>
            <Plate
                { ...props }
                id={ props.id }

                // we override plate core insertData plugin
                // so, we need to disable default implementation
                disableCorePlugins={ { insertData: true } }
            >

            </Plate>
            <MarkBalloonToolbar />
            <Toolbar style={ {
                position: 'sticky',
                bottom: 12,
                display: 'flex',
                minHeight: 0,
                zIndex: 50,
            } }>
                <ToolbarButtons />
            </Toolbar>
        </DndProvider>
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
                // from slate editor
                style.typographyPromo,
                props.fontSize == '16' ? style.typography16 : style.typography14,
            ) }
            //@ts-ignore
            style={ { minHeight: props.minHeight || 350, padding: '0 24px' } as any }
            { ...props.rawProps }
        >
            { props.scrollbars
                ? <ScrollBars cx={ css.scrollbars } style={{ width: '100%' }}>
                    { renderEditor() }
                </ScrollBars>
                : renderEditor()
            }
        </div>
    );
};

export function SlateEditor(props: SlateEditorProps) {
    const {
        autoFocus,
        isReadonly,
        placeholder,
    } = props;

    const [value, setValue] = useState(null);

    const currentId = useRef(String(Date.now()));

    const plugins = createPlugins((props.plugins || []).flat(), {
        components,
    });

    const editableProps: TEditableProps = {
        autoFocus: false,
        readOnly: isReadonly,
        placeholder,
    };

    const onChange = (value: any) => {
        if (isReadonly) return;
        props?.onValueChange(value);
    };

    const renderElement = (props: TRenderElementProps): JSX.Element => {
        const { attributes, children } = props;

        return <p { ...attributes }>{ children }</p>;
    };

    const initialValue = useMemo(() => migrateSchema(props.value), [props.value]);

    useEffect(() => {
        if (!value) {
            setValue(initialValue);
        }
    }, [initialValue, value]);

    return (
        <PlateProvider
            onChange={ onChange }
            renderElement={ renderElement }
            plugins={ plugins }
            initialValue={ value }
            id={ currentId.current }
        >
            <Editor
                onChange={ onChange }
                editableProps={ editableProps }
                renderElement={ renderElement }
                id={ currentId.current }
                initialValue={ value }
                plugins={ plugins }
                { ...props }
            />
        </PlateProvider>
    );
}
