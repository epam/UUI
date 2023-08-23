import React from 'react';

import { Dropdown } from '@epam/uui-components';
import { isPluginActive } from '../../helpers';

import { ToolbarButton } from '../../implementation/ToolbarButton';
import { HeaderBar } from '../../implementation/HeaderBar';

import { ReactComponent as HeadlinePickerIcon } from '../../icons/heading.svg';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6, HeadingsPlugin, createHeadingPlugin } from '@udecode/plate-heading';
import { PlateEditor, PlatePlugin, Value } from '@udecode/plate-common';

const KEY = 'heading';

type CreateHeaderPlugin = () => PlatePlugin<HeadingsPlugin, Value, PlateEditor<Value>>;

export const headerPlugin: CreateHeaderPlugin = () => createHeadingPlugin({
    overrideByKey: {
        [ELEMENT_H1]: {
            type: 'uui-richTextEditor-header-1',
        },
        [ELEMENT_H2]: {
            type: 'uui-richTextEditor-header-2',
        },
        [ELEMENT_H3]: {
            type: 'uui-richTextEditor-header-3',
        },
        [ELEMENT_H4]: {
            type: 'uui-richTextEditor-header-4',
        },
        [ELEMENT_H5]: {
            type: 'uui-richTextEditor-header-5',
        },
        [ELEMENT_H6]: {
            type: 'uui-richTextEditor-header-6',
        },
    },
});

interface IToolbarButton {
    editor: PlateEditor;
}

export function HeaderButton({ editor }: IToolbarButton): any {
    if (!isPluginActive(KEY)) return null;

    return (
        <Dropdown
            renderTarget={ (props) => (
                <ToolbarButton
                    icon={ HeadlinePickerIcon }
                    { ...props }
                />
            ) }
            renderBody={ (props) => <HeaderBar editor={ editor } { ...props } /> }
            placement="top-start"
            modifiers={ [{ name: 'offset', options: { offset: [0, 3] } }] }
        />
    );
}
