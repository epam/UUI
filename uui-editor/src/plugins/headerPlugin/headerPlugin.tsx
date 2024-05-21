import React from 'react';

import { Dropdown } from '@epam/uui-components';
import { useIsPluginActive } from '../../helpers';

import { ToolbarButton } from '../../implementation/ToolbarButton';
import { HeaderBar } from '../../implementation/HeaderBar';

import { ReactComponent as HeadlinePickerIcon } from '../../icons/heading.svg';
import {
    ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6, createHeadingPlugin,
} from '@udecode/plate-heading';
import { PlateEditor } from '@udecode/plate-common';
import { WithToolbarButton } from '../../implementation/Toolbars';

const KEY = 'heading';

export const headerPlugin = () => createHeadingPlugin<WithToolbarButton>({
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
    options: {
        bottomBarButton: HeaderButton,
    },
});

interface IToolbarButton {
    editor: PlateEditor;
}

export function HeaderButton({ editor }: IToolbarButton): any {
    if (!useIsPluginActive(KEY)) return null;

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
            modifiers={ [{
                name: 'offset',
                options: { offset: [0, 3] },
            }] }
        />
    );
}
