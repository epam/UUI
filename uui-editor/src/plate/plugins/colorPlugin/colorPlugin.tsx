import React, { useCallback } from 'react';
import { Dropdown } from '@epam/uui-components';

import {
    ToolbarButton as PlateToolbarButton,
    createFontColorPlugin,
    getPluginType,
    PlateEditor,
    MARK_COLOR,
    removeMark,
    setMarks,
    getMark,
} from '@udecode/plate';

import { isPluginActive } from '../../../helpers';

import { ColorBar } from '../../implementation/ColorBar';
import { ToolbarButton } from '../../implementation/ToolbarButton';

import { ReactComponent as ColorIcon } from '../../icons/text-color-normal.svg';

export const colorPlugin = () => createFontColorPlugin();

interface IToolbarButton {
    editor: PlateEditor;
}

export const ColorButton = ({ editor }: IToolbarButton) => {

    if (!isPluginActive(MARK_COLOR)) return null;

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
                <PlateToolbarButton
                    styles={ { root: { width: 'auto', height: 'auto', cursor: 'pointer', padding: '0px' } } }
                    active={ true }
                    onMouseDown={
                        editor
                            ? (e) => e.preventDefault()
                            : undefined
                    }
                    icon={ <ToolbarButton
                        icon={ ColorIcon }
                        { ...props }
                    /> }
                />
            ) }
            renderBody={ () => <ColorBar
                updateColor={ updateColor }
                clearColor={ clearColor }
                value={ markValue }
            /> }
            placement='top-start'
            modifiers={ [{ name: 'offset', options: { offset: [0, 3] } }] }
        />
    );
};