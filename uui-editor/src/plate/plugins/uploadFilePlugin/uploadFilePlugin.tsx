import React from 'react';
import { UploadFileToggler} from '@epam/uui-components';

import {
    ToolbarButton as PlateToolbarButton,
    getPreventDefaultHandler,
    createPluginFactory,
    PlateEditor,
} from "@udecode/plate";

import { isPluginActive, isTextSelected } from '../../../helpers';

import { ToolbarButton } from '../../../implementation/ToolbarButton';

import { ReactComponent as AttachIcon } from '../../../icons/attach-file.svg';

import { withFileUpload } from './withFileUpload';

const KEY = 'fileUpload';

export interface UploadFileOptions {
    uploadFile(file: File, onProgress: (progress: any) => any): any;
}

export const uploadFilePlugin = (options: UploadFileOptions) => {
    const createUploadFilePlugin = createPluginFactory({
        key: KEY,
        isElement: true,
        isVoid: true,
        options,
        withOverrides: withFileUpload,
    });

    return createUploadFilePlugin();
};

interface IUploadFileButton {
    editor: PlateEditor;
}

export const UploadFileButton = ({ editor }: IUploadFileButton): any => {

    if (!isPluginActive(KEY)) return null;

    return (
        <UploadFileToggler
            render={ (props) => (
                <PlateToolbarButton
                    styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                    active={ true }
                    onMouseDown={
                        editor
                            ? getPreventDefaultHandler()
                            : undefined
                    }
                    icon={ <ToolbarButton
                        { ...props }
                        icon={ AttachIcon }
                        isDisabled={ isTextSelected(editor, true) }
                    /> }
                />
            ) }
            onFilesAdded={ (files) =>
                (editor as any).insertData({ getData: () => 'files', files })
            }
        />
    );
};
