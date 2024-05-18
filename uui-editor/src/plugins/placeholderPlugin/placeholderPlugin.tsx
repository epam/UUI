import { Dropdown } from '@epam/uui-components';
import React from 'react';

import { useIsPluginActive, isTextSelected } from '../../helpers';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { PlaceholderBlock } from './PlaceholderBlock';

import {
    PlateEditor, createPluginFactory, getPluginOptions, insertElements, PlatePlugin,
} from '@udecode/plate-common';
import css from './PlaceholderPlugin.module.scss';
import { PLACEHOLDER_PLUGIN_KEY } from './constants';
import { WithToolbarButton } from '../../implementation/Toolbars';

export interface PlaceholderPluginParams {
    /** Placeholder items */
    items: {
        name: string;
        [key: string]: any;
    }[];
}

type PlaceholderPluginOptins = WithToolbarButton & { params: PlaceholderPluginParams };

export const placeholderPlugin = (params: PlaceholderPluginParams): PlatePlugin<PlaceholderPluginOptins> => {
    const createPlaceholderPlugin = createPluginFactory<PlaceholderPluginOptins>({
        key: PLACEHOLDER_PLUGIN_KEY,
        isElement: true,
        isInline: true,
        isVoid: true,
        component: PlaceholderBlock,
        options: {
            bottomBarButton: PlaceholderButton,
            params,
        },
    });

    return createPlaceholderPlugin();
};

interface IPlaceholderButton {
    editor: PlateEditor;
}

export function PlaceholderButton({ editor }: IPlaceholderButton): any {
    if (!useIsPluginActive(PLACEHOLDER_PLUGIN_KEY)) return null;
    const { params }: { params: PlaceholderPluginParams } = getPluginOptions(editor, PLACEHOLDER_PLUGIN_KEY);

    const renderDropdownBody = () => {
        return (
            <div className={ css.dropdownContainer }>
                { params.items.map((i) => (
                    <div
                        className={ css.dropdownItem }
                        key={ i.name }
                        onMouseDown={ (event) => {
                            event.preventDefault();
                            insertElements(
                                editor,
                                {
                                    data: i,
                                    type: 'placeholder',
                                    children: [{ text: '' }],
                                },
                            );
                        } }
                    >
                        { i.name }
                    </div>
                )) }
            </div>
        );
    };

    return (
        <Dropdown
            renderTarget={ (props) => (
                <ToolbarButton
                    caption={
                        <div style={ {
                            height: 42,
                            display: 'flex',
                            alignItems: 'center',
                        } }
                        >
                            Insert Placeholder
                        </div>
                    }
                    isDisabled={ isTextSelected(editor, true) }
                    { ...props }
                />
            ) }
            renderBody={ renderDropdownBody }
            placement="top-start"
            modifiers={ [{
                name: 'offset',
                options: { offset: [0, 3] },
            }] }
        />
    );
}
