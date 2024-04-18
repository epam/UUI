import { useUuiContext } from '@epam/uui-core';
import React from 'react';

import { useIsPluginActive, isTextSelected } from '../../helpers';

import { ToolbarButton } from '../../implementation/ToolbarButton';

import { ReactComponent as VideoIcon } from '../../icons/video.svg';

import {
    PlateEditor, createPluginFactory, getBlockAbove,
} from '@udecode/plate-common';
import { AddVideoModal } from './AddVideoModal';
import { WithToolbarButton } from '../../implementation/Toolbars';

export const VIDEO_PLUGIN_KEY = 'video';

export const videoPlugin = createPluginFactory<WithToolbarButton>({
    key: VIDEO_PLUGIN_KEY,
    type: 'video',
    options: {
        bottomBarButton: VideoButton,
    },
});

interface IVideoButton {
    editor: PlateEditor;
}

export function VideoButton({
    editor,
}: IVideoButton) {
    const context = useUuiContext();

    if (!useIsPluginActive('video')) return null;

    const block = getBlockAbove(editor);

    return (
        <ToolbarButton
            onClick={ async (event) => {
                if (!editor) return;
                event.preventDefault();

                context.uuiModals.show<string>((modalProps) => (
                    <AddVideoModal
                        editor={ editor }
                        { ...modalProps }
                    />
                )).catch(() => null);
            } }
            isDisabled={ !!isTextSelected(editor, true) }
            icon={ VideoIcon }
            isActive={ block?.length && block[0].type === 'iframe' }
        />
    );
}
