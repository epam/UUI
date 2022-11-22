import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { uuiMod, cx } from '@epam/uui-core';
import { ScrollBars } from '@epam/uui-components';

import {
    Plate,
    createPlugins,
    createPlateUI,
    usePlateEditorState,
    isEditorFocused,
    PlateEventProvider,
    TRenderElementProps,
    PlateProvider,
    focusEditor,
} from '@udecode/plate';

import {
    ToolbarButtons,
    MarkBalloonToolbar,
    ImageBalloonToolbar,
} from './plate/plugins/Toolbars';

import { migrateSchema } from './migration';

import { customPlugins } from './plate/plugins/plugins';

import * as style from '@epam/assets/scss/promo/typography.scss';
import * as css from './SlateEditor.scss';

let components = createPlateUI();

export const defaultPlugins: any = [];
export const basePlugins: any = [];

const plugins = createPlugins(customPlugins, {
    components,
});

let id = Date.now();

export function SlateEditor(props: any) {
    const currentId = String(id++);
    const editor = usePlateEditorState();
    const isFocused = isEditorFocused(editor);

    const onChange = (value: any) => {
        props?.onValueChange(value);
        focusEditor(editor);
    };

    const renderElement = (props: TRenderElementProps): JSX.Element => {
        const { attributes, children } = props;

        return <p { ...attributes }>{ children }</p>;
    };

    const renderEditor = () => (
        <DndProvider backend={ HTML5Backend }>
            <Plate
                // onChange={ onChange }
                renderElement={ renderElement }
                id={ currentId }
                plugins={ plugins }
                { ...(props?.value ? { initialValue: migrateSchema(props.value) } : {}) }
            >
                <ImageBalloonToolbar />
                <MarkBalloonToolbar />
            </Plate>
            <PlateEventProvider id={ currentId }>
                <ToolbarButtons />
            </PlateEventProvider>
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
            style={ { minHeight: props.minHeight || 350, padding: '0 24px', overflow: 'hidden' } }
            { ...props.rawProps }
        >
            { props.scrollbars
                ? <ScrollBars cx={ css.scrollbars }>
                    { renderEditor() }
                </ScrollBars>
                : renderEditor()
            }
        </div>
    );
}
