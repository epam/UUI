import { getEventTransfer, getEventRange, Editor } from "slate-react";
import * as attachIcon from "../../icons/attach-file.svg";
import { Editor as CoreEditor, Range} from "slate";
import { FileUploadResponse, BlockTypes } from "@epam/uui";
import { UploadFileToggler} from "@epam/uui-components";
import * as React from "react";
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { isTextSelected } from '../../helpers';

export interface UploadFileOptions {
    uploadFile(file: File, onProgress: (progress: any) => any): any;
}

export const uploadFilePlugin = (options: UploadFileOptions) => {
    const handleUploadFile = (editor: CoreEditor, file: File, range?: Range, type?: BlockTypes) => {
        if (range) {
            editor.select(range);
        }
        editor.setBlocks('loader');
        const loaderKey = editor.value.anchorBlock.key;
        options.uploadFile(file, (process) => { })
            .then((res: FileUploadResponse) => {
                const block = (editor as any).createBlock({
                    ...res,
                    src: res.path,
                    fileName: res.name,
                }, type ? type : res.type);
                range ? editor.setBlocksAtRange(range as Range, block) : editor.setNodeByKey(`${loaderKey}`, block);
            });
    };

    const onDrop = (event: Event, editor: CoreEditor, next: () => any) => {
        const transfer: any = getEventTransfer(event);
        const range = getEventRange(event, editor);

        transfer.files.forEach((file: File) => {
            handleUploadFile(editor, file, range);
        });
    };

    return {
        onDrop,
        queries: {
            handleUploadFile,
        },
        sidebarButtons: [FileUploadButton],
    };
};

const FileUploadButton = (props: { editor: Editor }) => {
    return (
        <UploadFileToggler
            render={ togglerProps => <ToolbarButton
                { ...togglerProps }
                icon={ attachIcon }
                isDisabled={ isTextSelected(props.editor) }
            /> }
            onFilesAdded={ files => { files.map(file => (props.editor as any).handleUploadFile(file, null, 'attachment')); } }
        />
    );
};