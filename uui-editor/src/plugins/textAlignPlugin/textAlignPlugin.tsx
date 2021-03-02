import { RenderBlockProps, Editor } from "slate-react";
import { Editor as CoreEditor } from "slate";
import * as css from './textAlign.scss';
import * as React from "react";
import { ToolbarButton } from "../../implementation/ToolbarButton";
import * as alignLeft from '../../icons/align-left.svg';
import * as alignCenter from '../../icons/align-center.svg';
import * as alignRight from '../../icons/align-right.svg';

const alignMarks = ['uui-richTextEditor-align-text-left', 'uui-richTextEditor-align-text-center', 'uui-richTextEditor-align-text-right'];

export const textAlignPlugin = () => {
    const renderBlock = (props: RenderBlockProps, editor: CoreEditor, next: () => any) => {
        switch (props.node.type) {
            case 'uui-richTextEditor-align-text-left':
                return <div { ...props.attributes } className={ css.alignLeft }>{ props.children }</div>;
            case 'uui-richTextEditor-align-text-center':
                return <div { ...props.attributes } className={ css.alignCenter }>{ props.children }</div>;
            case 'uui-richTextEditor-align-text-right':
                return <div { ...props.attributes } className={ css.alignRight }>{ props.children }</div>;
            default:
                return next();
        }
    };

    const onKeyDown = (event: KeyboardEvent, editor: Editor, next: () => any) => {
        const focusBlock = editor.value.focusBlock;

        if (event.key === 'Backspace') {
            alignMarks.map(mark => {
                let parentBlock: any = editor.value.document.getParent(focusBlock.key);
                if (parentBlock.type === mark && focusBlock.text === '') {
                    editor.removeNodeByKey(focusBlock.key);
                }
            });
        }

        next();
    };

    return {
        renderBlock,
        onKeyDown,
        toolbarButtons: [
            { component: leftAlignButton, allowRender: (slate: Editor) => slate.value.focusBlock.type !== 'toDoItem' },
            { component: rightAlignButton, allowRender: (slate: Editor) => slate.value.focusBlock.type !== 'toDoItem' },
            { component: centerAlignButton, allowRender: (slate: Editor) => slate.value.focusBlock.type !== 'toDoItem' },
        ],
    };
};

const toggleAlign = (props: { editor: any }, mark: string) => {
    const alignStringKey = props.editor.value.focusBlock.key;

    if (props.editor.value.document.getParent(alignStringKey).type === mark) {
        alignMarks.map(mark => {
            props.editor.unwrapBlock(mark);
        });
    } else {
        props.editor.wrapBlock(mark);
    }
};

const isAlignActive = (alignType: string, editor: Editor) => {
    return (editor.value.document.getParent(editor.value.anchorBlock.key) as any).type === alignType;
};

const leftAlignButton = (props: { editor: any }) => {
    return <ToolbarButton
                isActive={ isAlignActive('uui-richTextEditor-align-text-left', props.editor) }
                icon={ alignLeft }
                iconColor={ 'red' }
                onClick={ () => toggleAlign(props, 'uui-richTextEditor-align-text-left') }
            />;
};

const rightAlignButton = (props: { editor: any }) => {
    return <ToolbarButton
                isActive={ isAlignActive('uui-richTextEditor-align-text-right', props.editor) }
                icon={ alignRight }
                iconColor={ 'red' }
                onClick={ () => toggleAlign(props, 'uui-richTextEditor-align-text-right') }
            />;
};

const centerAlignButton = (props: { editor: any }) => {
    return <ToolbarButton
                isActive={ isAlignActive('uui-richTextEditor-align-text-center', props.editor) }
                icon={ alignCenter }
                iconColor={ 'red' }
                onClick={ () => toggleAlign(props, 'uui-richTextEditor-align-text-center') }
            />;
};
