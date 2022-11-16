import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { cx } from '@epam/uui-core';

import {
    Plate,
    createPlugins,
    createPlateUI,
    PlateEventProvider,
    HeadingToolbar,
} from '@udecode/plate';

import { ToolbarButtons, MarkBalloonToolbar, ImageBalloonToolbar } from "./plate/plugins/Toolbars";

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

    return (
        <div
            className={ cx(
                css.container,
                style['typography-inline'],
                style['typography-promo'],
                css['mode-form' + (props.mode || 'form')],
            ) }
        >
            <DndProvider backend={ HTML5Backend }>
                <PlateEventProvider id={ currentId }>
                    <HeadingToolbar>
                        <ToolbarButtons />
                    </HeadingToolbar>
                </PlateEventProvider>
                <Plate
                    placeholder='asdsadad'
                    id={ currentId }
                    plugins={ plugins }
                    { ...(props?.value ? { initialValue: migrateSchema(props.value) } : {}) }
                >
                    <ImageBalloonToolbar />
                    <MarkBalloonToolbar />
                </Plate>
            </DndProvider>
    </div>
    );
}
