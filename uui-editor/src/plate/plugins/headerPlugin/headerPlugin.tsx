import React from 'react';

import {
    createHeadingPlugin,
    ToolbarButton as PlateToolbarButton,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    PlateEditor,
} from "@udecode/plate";
import { Dropdown } from '@epam/uui-components';
import { isPluginActive } from "../../../helpers";

import { ToolbarButton } from '../../../implementation/ToolbarButton';
import { HeaderBar } from '../../../implementation/HeaderBar';

import { ReactComponent as HeadlinePickerIcon } from '../../icons/heading.svg';

const KEY = 'heading';

export const headerPlugin = () => createHeadingPlugin({
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

export const HeaderButton = ({ editor }: IToolbarButton): any => {

    if (!isPluginActive(KEY)) return null;

    return (
        <Dropdown
            renderTarget={ (props) => (
                <PlateToolbarButton
                    styles={ { root: { width: 'auto', height: 'auto', cursor: 'pointer', padding: '0px' } } }
                    active={ true }
                    onMouseDown={
                        editor
                            ? (e) => e.preventDefault()
                            : undefined
                    }
                    icon={ <ToolbarButton
                        icon={ HeadlinePickerIcon }
                        { ...props }
                    /> }
                />
            ) }
            renderBody={ (props) => <HeaderBar editor={ editor } { ...props } /> }
            placement='top-start'
            modifiers={ [{ name: 'offset', options: { offset: [0, 3] } }] }
        />
    );
};