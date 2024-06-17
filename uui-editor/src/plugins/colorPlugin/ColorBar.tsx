import * as React from 'react';
import { Dropdown, FlexRow } from '@epam/uui';
import { ToolbarButton } from '../../implementation/ToolbarButton';

import { ReactComponent as ClearIcon } from '../../icons/text-color-default.svg';
import { ReactComponent as ColorIcon } from '../../icons/text-color-select.svg';
import { ReactComponent as ColorIcoNormal } from '../../icons/text-color-normal.svg';

import css from './ColorBar.module.scss';
import { getMark, getPluginOptions, getPluginType, removeMark, setMarks, useEditorRef } from '@udecode/plate-common';
import { COLOR_PLUGIN_KEY } from './constants';
import { ColorPluginOptions } from './types';
import { useIsPluginActive } from '../../helpers';
import { MARK_COLOR } from '@udecode/plate-font';

type IColorBar = {
    onColorUpdate: (color: string) => void;
    onColorClear: () => void;
    value?: string,
};

export function ColorBar({ onColorUpdate, onColorClear, value }: IColorBar) {
    const editorRef = useEditorRef();
    const { colors: colorProps } = React.useMemo(() => getPluginOptions<ColorPluginOptions>(
        editorRef,
        COLOR_PLUGIN_KEY,
    ), [editorRef]);

    const colors = colorProps.map((color) => {
        return (
            <ToolbarButton
                key={ color }
                onClick={ () => onColorUpdate(color) }
                isActive={ value === color }
                rawProps={ { style: { fill: color } } }
                icon={ ColorIcon }
            />
        );
    });

    return (
        <FlexRow cx={ css.wrapper }>
            <ToolbarButton
                key="clear"
                onClick={ onColorClear }
                isActive={ false }
                icon={ ClearIcon }
            />
            {colors}
        </FlexRow>
    );
}

export function ColorButton() {
    const editor = useEditorRef();
    const pluginActive = useIsPluginActive(MARK_COLOR);

    const type = getPluginType(editor, MARK_COLOR);
    const markValue: any = getMark(editor, type);

    const updateColor = React.useCallback((color: string) => {
        if (markValue !== color) {
            setMarks(editor, { [type]: color });
        } else {
            removeMark(editor, { key: type });
        }
    }, [editor, type, markValue]);

    const clearColor = React.useCallback(() => {
        removeMark(editor, { key: type });
    }, [editor, type]);

    const modifiers = React.useMemo(() => ([{ name: 'offset', options: { offset: [0, 3] } }]), []);

    if (!pluginActive) return null;

    return (
        <Dropdown
            renderTarget={ (props) => (
                <ToolbarButton
                    icon={ ColorIcoNormal }
                    { ...props }
                />
            ) }
            renderBody={ () => (
                <ColorBar
                    onColorUpdate={ updateColor }
                    onColorClear={ clearColor }
                    value={ markValue }
                />
            ) }
            placement="top-start"
            modifiers={ modifiers }
        />
    );
}
