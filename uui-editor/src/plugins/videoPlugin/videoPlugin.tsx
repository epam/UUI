import React from 'react';
import { useUuiContext } from '@epam/uui-core';
import { useIsPluginActive, isTextSelected } from '../../helpers';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { ReactComponent as VideoIcon } from '../../icons/video.svg';
import { PlateEditor, createPluginFactory, getBlockAbove, PlatePlugin } from '@udecode/plate-common';
import { AddVideoModal } from './AddVideoModal';
import { WithToolbarButton } from '../../implementation/Toolbars';
import { VIDEO_PLUGIN_KEY, VIDEO_TYPE } from './constants';
import { IFRAME_TYPE } from '../iframePlugin/constants';

export const videoPlugin = (): PlatePlugin<WithToolbarButton> => {
    const createPlugin = createPluginFactory<WithToolbarButton>({
        key: VIDEO_PLUGIN_KEY,
        type: VIDEO_TYPE,
        options: {
            bottomBarButton: VideoButton,
        },
    });
    return createPlugin();
};

interface IVideoButton {
    editor: PlateEditor;
}

export function VideoButton({
    editor,
}: IVideoButton) {
    const context = useUuiContext();

    if (!useIsPluginActive(VIDEO_TYPE)) return null;

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
            isActive={ block?.length && block[0].type === IFRAME_TYPE }
        />
    );
}
