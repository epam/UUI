import React from 'react';
import { ToolbarButton } from "../../implementation/ToolbarButton";
import { isPluginActive } from "../../helpers";
import { ReactComponent as SuperScriptIcon } from "../../icons/super-script.svg";
import { createSuperscriptPlugin, MARK_SUPERSCRIPT } from '@udecode/plate-basic-marks';
import { PlateEditor, getPluginType, isMarkActive } from '@udecode/plate-common';
import { MarkToolbarButton } from '@udecode/plate-ui';

const KEY = 'uui-richTextEditor-superscript';
const noop = () => {};

export const superscriptPlugin = () => createSuperscriptPlugin({
    type: KEY,
});

interface ToolbarButton {
    editor: PlateEditor;
}

export const SuperscriptButton = ({ editor }: ToolbarButton) => {
    if (!isPluginActive(MARK_SUPERSCRIPT)) return null;
    return (
        <MarkToolbarButton
            styles={ { root: { width: 'auto', height: 'auto', cursor: 'pointer', padding: '0px' } } }
            type={ getPluginType(editor, KEY) }
            icon={ <ToolbarButton
                onClick={ noop }
                icon={ SuperScriptIcon }
                isActive={ !!editor?.selection && isMarkActive(editor, KEY!) }
            /> }
        />
    );
};