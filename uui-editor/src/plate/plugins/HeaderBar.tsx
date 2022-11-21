import React, {  useCallback, useState } from 'react';
import {
    useEventPlateId,
    usePlateEditorState,
    ToolbarButton,
    ToolbarButtonProps,
    getPreventDefaultHandler,
    ToolbarDropdown,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
} from '@udecode/plate';

import { HeaderBar } from '../implementation/HeaderBar';
import { isPluginActive } from "../../helpers";

export const HeaderBarToolbar = ({
   id,
   pluginKey,
   icon,
   colors = [],
   customColors = [],
   closeOnSelect = false,
   ...rest
}: ToolbarButtonProps) => {
    id = useEventPlateId(id);
    const editor = usePlateEditorState(id);

    const [open, setOpen] = useState(false);

    const onToggle = useCallback(() => {
        setOpen(!open);
    }, [open, setOpen]);

    if (!isPluginActive(ELEMENT_H1) && !isPluginActive(ELEMENT_H2) && !isPluginActive(ELEMENT_H3)) return null;

    return (
        <ToolbarDropdown
            control={
                <ToolbarButton
                    styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                    active={ !!editor?.selection }
                    icon={ icon }
                    onMouseDown={
                        editor
                            ? getPreventDefaultHandler()
                            : undefined
                    }
                    { ...rest }
                />
            }
            open={ open }
            onOpen={ onToggle }
            onClose={ onToggle }
        >
            <HeaderBar />
        </ToolbarDropdown>
    );
};