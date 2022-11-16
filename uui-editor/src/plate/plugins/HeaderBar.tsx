import React, {  useCallback, useState } from 'react';
import {
    useEventPlateId,
    usePlateEditorState,
    ToolbarButton,
    ToolbarButtonProps,
    getPreventDefaultHandler,
    ToolbarDropdown,
} from '@udecode/plate';

import { HeaderBar } from '../implementation/HeaderBar';

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