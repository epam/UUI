import {
    createPluginFactory,
    insertNode,
} from '@udecode/plate';
//@ts-ignore
import { svc } from "@epam/app/src/services";

const uploadFile = async (file: File, onProgress: (progress: number) => any): any => {
    return svc.uuiApi.uploadFile('/uploadFileMock', file, {
        onProgress,
    });
};

const handleUploadFile = (editor: any, file: File, range?: Range) => {
    if (range) {
        editor.select(range);
    }
    // insertNode(editor, {
    //     type: 'image',
    //     mark: 'loader',
    //     children: [{ text: 'Some text' }],
    // });
    //const loaderKey = editor.value.anchorBlock.key;
    uploadFile(file, (process) => { })
        .then((res: any) => {
            // const block = (editor as any).createBlock({
            //     ...res,
            //     type: 'image',
            //     src: res.path,
            //     fileName: res.name,
            // }, type ? type : res.type);
            //editor.removeNodeByKey(loaderKey);
            //range ? editor.setBlocksAtRange(range as Range, block) : insertImage(editor, res.path);
            //console.log(res);
            insertNode(editor, {
                type: 'image',
                children: [{ text: 'sdsdsdsd' }],
                url: res.path,
            });
        });
};

export const createUploadPlugin = createPluginFactory({
    key: 'fileUpload',
    isElement: true,
    isVoid: true,
    handlers: {
        onDrop: (editor) => (e) => {
            Object.values(e.dataTransfer.files).forEach((file: File) => {
                handleUploadFile(editor, file);
            });
        },
    },
    then: (editor, { type }) => ({
        deserializeHtml: {
            rules: [
                {
                    validNodeName: 'IMG',
                },
            ],
            getNode: (el) => ({
                type,
                url: el.getAttribute('src'),
            }),
        },
    }),
});