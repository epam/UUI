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
    createListPlugin,
    createSoftBreakPlugin,
    createExitBreakPlugin,
    createLinkPlugin,
    createHeadingPlugin,
    createSubscriptPlugin,
    createSuperscriptPlugin,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
} from '@udecode/plate';

import { ToolbarButtons, MarkBalloonToolbar } from "./components/Toolbars";

import { createUUIBoldPlugin } from "./components/customBold";
import { createUUIItalicPlugin } from "./components/customItalic";
import { createUUIUnderlinePlugin } from "./components/customUnderline";
import { createUUICodePlugin } from "./components/customCode";
import { listPluginOptions } from "./components/createListPlugin";

import { AddLinkModal } from './plugins/linkPlugin/AddLinkModal';

import { migrateSchema } from './migration';

import * as style from '@epam/assets/scss/promo/typography.scss';
import * as css from './SlateEditor.scss';

let components = createPlateUI();

export const defaultPlugins: any = [];
export const basePlugins: any = [];

const plugins = createPlugins([
    createSoftBreakPlugin(),
    createExitBreakPlugin(),
    createListPlugin(listPluginOptions),
    createUUIBoldPlugin(),
    createUUIItalicPlugin(),
    createUUIUnderlinePlugin(),
    createUUICodePlugin(),
    createSuperscriptPlugin({
        type: 'uui-richTextEditor-superscript',
    }),
    createLinkPlugin({
        type: 'link',
    }),
    createHeadingPlugin({
        overrideByKey: {
            [ELEMENT_H1]: {
                type: 'uui-richTextEditor-header-1',
            },
            [ELEMENT_H2]: {
                type: 'uui-richTextEditor-header-2',
            },
            [ELEMENT_H3]: {
                type: 'uui-richTextEditor-header-3',
            }
        },
    }),
], {
    components,
});

let id = Date.now();

export function SlateEditor(props: any) {
    console.log(props?.value && migrateSchema(props.value));
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
                <PlateEventProvider>
                    <HeadingToolbar>
                        <ToolbarButtons />
                    </HeadingToolbar>
                </PlateEventProvider>
                <Plate
                    id={ String(id++) }
                    plugins={ plugins }
                    { ...(props?.value ? { initialValue: migrateSchema(props.value) } : {}) }
                >
                    <MarkBalloonToolbar />
                </Plate>
            </DndProvider>
    </div>
    );
}
