import { Editor } from "slate-react";
import { Block, KeyUtils, Inline } from "slate";

export const utilsPlugin: any = () => {
    const onKeyDown = (event: KeyboardEvent, editor: Editor, next: () => any) => {
        if (event.ctrlKey && event.keyCode === 90) { // ctrl + z
            return editor.undo();
        }

        if (event.ctrlKey && event.keyCode === 89) { //ctrl + y
            return editor.redo();
        }

        return next();
    };

    const createBlock = (editor: Editor, data: any, type: string) => {
        return Block.create({
            object: 'block',
            type: type,
            key: KeyUtils.create(),
            data: data,
        });
    };

    const createInline = (editor: Editor, data: any, type: string) => {

        return Inline.create({
            object: 'inline',
            type: type,
            key: KeyUtils.create(),
            data: data,
        });
    };

    const insertEmptyBlock = (editor: Editor) => {
        const emptyParagraph = Block.create({
            object: 'block',
            type: 'paragraph',
            key: KeyUtils.create(),
        });

        return editor.insertBlock(emptyParagraph);
    };

    const hasBlock = (editor: Editor, types: string[]) => {
        const value: any = editor ? editor.value : { blocks: [] };
        return value.blocks.some((node: any) => {
            return types.some((type: any) => node.type === type);
        });
    };

    return {
        onKeyDown,
        commands: {
            insertEmptyBlock,
        },
        queries: {
            createBlock,
            createInline,
            hasBlock,
        },
    };
};