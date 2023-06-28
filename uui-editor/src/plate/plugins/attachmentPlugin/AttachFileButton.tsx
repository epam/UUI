import React, { memo, useCallback } from 'react';
import { UploadFileToggler } from '@epam/uui-components';

import {
    ToolbarButton as PlateToolbarButton,
    PlateEditor, focusEditor
} from "@udecode/plate";

import { isPluginActive, isTextSelected } from '../../../helpers';
import { ToolbarButton } from '../../../implementation/ToolbarButton';
import { ReactComponent as AttachIcon } from '../../../icons/attach-file.svg';
import { ATTACHMENT_PLUGIN_KEY } from '../attachmentPlugin/attachmentPlugin';
import { useFilesUploader } from '../uploadFilePlugin/file_uploader';

interface IUploadFileButton {
    editor: PlateEditor;
}

export const AttachFileButton = memo(({ editor }: IUploadFileButton): any => {
    const uploadFiles = useFilesUploader(editor);

    const onFilesAdded = useCallback((files: File[]) => uploadFiles(files, 'attachment'), []);

    if (!isPluginActive(ATTACHMENT_PLUGIN_KEY)) return null;

    return (
        <UploadFileToggler
            render={ (props) => (
                <PlateToolbarButton
                    styles={ { root: { width: 'auto', height: 'auto', cursor: 'pointer', padding: '0px' } } }
                    active={ true }
                    onMouseDown={ (e) => {
                        e.preventDefault();
                        focusEditor(editor);
                    } }
                    icon={ <ToolbarButton
                        { ...props }
                        onClick={ () => {
                            focusEditor(editor);
                            props.onClick();
                            focusEditor(editor);
                        } }
                        icon={ AttachIcon }
                        isDisabled={ isTextSelected(editor, true) }
                    /> }
                />
            ) }
            onFilesAdded={ onFilesAdded }
        />
    );
});
