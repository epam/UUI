import { UploadFileToggler } from '@epam/uui-components';
import { useEditorRef } from '@udecode/plate-common';
import React, { useCallback, useRef } from 'react';

import { useIsPluginActive, isTextSelected } from '../../helpers';
import { ReactComponent as AttachIcon } from '../../icons/attach-file.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { useFilesUploader } from '../uploadFilePlugin/file_uploader';
import { ATTACHMENT_PLUGIN_KEY, ATTACHMENT_TYPE } from './constants';

export function AttachFileButton() {
    const editor = useEditorRef();
    const uploadFiles = useFilesUploader(editor);

    const onFilesAdded = useCallback(
        (files: File[]) => uploadFiles(files, ATTACHMENT_TYPE),
        [uploadFiles],
    );

    if (!useIsPluginActive(ATTACHMENT_PLUGIN_KEY)) return null;

    return (
        <UploadFileToggler
            render={ (props) => {
                return (
                    <ToolbarButton
                        { ...props }
                        icon={ AttachIcon }
                        isDisabled={ isTextSelected(editor, true) }
                    />
                );
            } }
            onFilesAdded={ onFilesAdded }
        />
    );
}
