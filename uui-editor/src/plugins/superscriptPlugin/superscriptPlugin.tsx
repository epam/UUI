import { createSuperscriptPlugin, MARK_SUPERSCRIPT } from '@udecode/plate-basic-marks';
import { isMarkActive, PlateEditor } from '@udecode/plate-common';
import React from 'react';
import { useIsPluginActive } from '../../helpers';
import { ReactComponent as SuperScriptIcon } from '../../icons/super-script.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { handleMarkButtonClick } from '../../utils/handleMarkButtonClick';
import { WithToolbarButton } from '../../implementation/Toolbars';

export const SUPERSCRIPT_TYPE = 'uui-richTextEditor-superscript';

export const superscriptPlugin = () => createSuperscriptPlugin<WithToolbarButton>({
    type: SUPERSCRIPT_TYPE,
    options: {
        floatingBarButton: SuperscriptButton,
    },
});

interface IToolbarButton {
    editor: PlateEditor;
}

export function SuperscriptButton({ editor }: IToolbarButton) {
    if (!useIsPluginActive(MARK_SUPERSCRIPT)) return null;
    return (
        <ToolbarButton
            onClick={ handleMarkButtonClick(editor, SUPERSCRIPT_TYPE) }
            icon={ SuperScriptIcon }
            isActive={ !!editor?.selection && isMarkActive(editor, SUPERSCRIPT_TYPE) }
        />
    );
}
