import { Dropdown } from '@epam/uui-components';
import React, { useCallback, useMemo } from 'react';

import { useIsPluginActive } from '../../helpers';
import { ColorBar } from '../../implementation/ColorBar';
import { ToolbarButton } from '../../implementation/ToolbarButton';

import { PlateEditor, getMark, getPluginType, removeMark, setMarks, PlatePlugin } from '@udecode/plate-common';
import { MARK_COLOR, createFontColorPlugin } from '@udecode/plate-font';
import { ReactComponent as ColorIcon } from '../../icons/text-color-normal.svg';

export const colorPlugin = (): PlatePlugin => createFontColorPlugin({
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
    const pluginActive = useIsPluginActive(MARK_COLOR);

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

    const modifiers = useMemo(() => ([{ name: 'offset', options: { offset: [0, 3] } }]), []);

    if (!pluginActive) return null;

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
            modifiers={ modifiers }
        />
    );
}
