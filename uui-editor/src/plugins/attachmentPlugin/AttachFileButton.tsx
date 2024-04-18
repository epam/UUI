import { UploadFileToggler } from '@epam/uui-components';
import { PlateEditor, focusEditor } from '@udecode/plate-common';
import React, { memo, useCallback } from 'react';

import { useIsPluginActive, isTextSelected } from '../../helpers';
import { ReactComponent as AttachIcon } from '../../icons/attach-file.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { useFilesUploader } from '../uploadFilePlugin/file_uploader';
import { ATTACHMENT_PLUGIN_KEY } from './attachmentPlugin';

interface IUploadFileButton {
    editor: PlateEditor;
}

export const AttachFileButton = memo(({ editor }: IUploadFileButton): any => {
    const uploadFiles = useFilesUploader(editor);

    const onFilesAdded = useCallback((files: File[]) => uploadFiles(files, 'attachment'), []);

    if (!useIsPluginActive(ATTACHMENT_PLUGIN_KEY)) return null;

    return (
        <UploadFileToggler
            render={ (props) => (
                <ToolbarButton
                    { ...props }
                    onClick={ () => {
                        focusEditor(editor);
                        props.onClick();
                        focusEditor(editor);
                    } }
                    icon={ AttachIcon }
                    isDisabled={ isTextSelected(editor, true) }
                />
            ) }
            onFilesAdded={ onFilesAdded }
        />
    );
});
