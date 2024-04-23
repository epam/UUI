import { Dropdown } from '@epam/uui-components';
import React, { useCallback } from 'react';

import { useIsPluginActive } from '../../helpers';
import { ColorBar } from '../../implementation/ColorBar';
import { ToolbarButton } from '../../implementation/ToolbarButton';

import { PlateEditor, getMark, getPluginType, removeMark, setMarks } from '@udecode/plate-common';
import { MARK_COLOR, createFontColorPlugin } from '@udecode/plate-font';
import { ReactComponent as ColorIcon } from '../../icons/text-color-normal.svg';

export const colorPlugin = () => createFontColorPlugin({
    inject: {
        props: {
            nodeKey: MARK_COLOR,
            defaultNodeValue: 'black',
            transformClassName: (options) => {
                if (options.nodeValue.at(0) === '#') {
                    return null;
                } else {
                    return `uui-${options.nodeValue}`;
                }
            },

        },
    },
    options: {
        floatingBarButton: ColorButton,
    },
});

interface IToolbarButton {
    editor: PlateEditor;
}

export function ColorButton({ editor }: IToolbarButton) {
    if (!useIsPluginActive(MARK_COLOR)) return null;

    const type = getPluginType(editor, MARK_COLOR);
    const markValue: any = getMark(editor, type);

    const updateColor = useCallback((color: string) => {
        if (markValue !== color) {
            setMarks(editor, { [type]: color });
        } else {
            removeMark(editor, { key: type });
        }
    }, [editor, type, markValue]);

    const clearColor = useCallback(() => {
        removeMark(editor, { key: type });
    }, [editor, type]);

    return (
        <Dropdown
            renderTarget={ (props) => (
                <ToolbarButton
                    icon={ ColorIcon }
                    { ...props }
                />
            ) }
            renderBody={ () => (
                <ColorBar
                    updateColor={ updateColor }
                    clearColor={ clearColor }
                    value={ markValue }
                />
            ) }
            placement="top-start"
            modifiers={ [{ name: 'offset', options: { offset: [0, 3] } }] }
        />
    );
}
