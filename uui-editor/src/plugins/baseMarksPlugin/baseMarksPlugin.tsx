import { RenderMarkProps } from "slate-react";
import {Editor as CoreEditor, Editor, Mark} from "slate";
import * as React from "react";
import * as boldIcon from "../../icons/bold.svg";
import * as italicIcon from "../../icons/italic.svg";
import * as underlinedIcon from "../../icons/underline.svg";
import {ToolbarButton} from "../../implementation/ToolbarButton";
import { getMarkDeserializer } from '../../helpers';
import { parseStringToCSSProperties } from '@epam/uui';

export const baseMarksPlugin = () => {
    const renderMark = (props: RenderMarkProps, editor: CoreEditor, next: () => any) => {
        switch (props.mark.type) {
            case 'uui-richTextEditor-bold':
                return <strong { ...props.attributes }>{ props.children }</strong>;
            case 'uui-richTextEditor-italic':
                return <i { ...props.attributes }>{ props.children }</i>;
            case 'uui-richTextEditor-underlined':
                return <u { ...props.attributes }>{ props.children }</u>;
            case 'uui-richTextEditor-superscript':
                return <sup { ...props.attributes }>{ props.children }</sup>;
            case 'uui-richTextEditor-code':
                return <code { ...props.attributes }>{ props.children }</code>;
            case 'uui-richTextEditor-span-mark':
                return <span { ...props.attributes } style={ props.mark.data.get('style') }>{ props.children }</span >;

            default:
                return next();
        }
    };

    const onKeyDown = (event: KeyboardEvent, editor: CoreEditor, next: () => any) => {
        if (event.ctrlKey && event.keyCode === 66) { // ctrl + b
            return editor.toggleMark('uui-richTextEditor-bold');
        }

        if (event.ctrlKey && event.keyCode === 73) { // ctrl + i
            return editor.toggleMark('uui-richTextEditor-italic');
        }

        if (event.ctrlKey && event.keyCode === 85) { // ctrl + u
            return editor.toggleMark('uui-richTextEditor-underlined');
        }

        if (event.shiftKey && event.keyCode === 8) { // ctrl + backspace
            return document.execCommand('cut');
        }

        if (event.ctrlKey && event.keyCode === 77) { // ctrl + m
            return editor.toggleMark('uui-richTextEditor-code');
        }

        return next();
    };

    const hasMark = (editor: Editor, markType: string | string[]) => {
        if (!editor) {
            return false;
        }

        if ((typeof markType) === "string") {
            return editor.value.activeMarks.some((mark: Mark) => mark.type === markType);
        } else {
            return (markType as any).some((markType: string) => editor.value.activeMarks.some((mark: Mark) => mark.type === markType));
        }
    };

    return {
        renderMark,
        onKeyDown,
        queries: {
            hasMark,
        },
        toolbarButtons: [BoldButton, ItalicButton, UnderlineButton],
        serializers: [baseMarkDeserializer, inlineDeserializer],
    };
};

const BoldButton = (props: { editor: any }) => {
    return <ToolbarButton isActive={ props.editor.hasMark('uui-richTextEditor-bold') } icon={ boldIcon } onClick={ () => props.editor.toggleMark('uui-richTextEditor-bold') } />;
};

const ItalicButton = (props: { editor: any }) => {
    return <ToolbarButton isActive={ (props.editor as any).hasMark('uui-richTextEditor-italic') } icon={ italicIcon } onClick={ () => props.editor.toggleMark('uui-richTextEditor-italic') } />;
};

const UnderlineButton = (props: { editor: any }) => {
    return <ToolbarButton isActive={ (props.editor as any).hasMark('uui-richTextEditor-underlined') } icon={ underlinedIcon } onClick={ () => props.editor.toggleMark('uui-richTextEditor-underlined') } />;
};

const MARK_TAGS: any = {
    strong: 'uui-richTextEditor-bold',
    em: 'uui-richTextEditor-italic',
    u: 'uui-richTextEditor-underlined',
    sup: 'uui-richTextEditor-superscript',
    code: 'uui-richTextEditor-code',
};

const baseMarkDeserializer = getMarkDeserializer(MARK_TAGS);

const inlineDeserializer = (el: any, next: any) => {
    if (el.tagName.toLowerCase() === 'span') {
        return {
            object: 'mark',
            type: 'uui-richTextEditor-span-mark',
            data: {
                style: parseStringToCSSProperties(el.getAttribute('style')),
            },
            nodes: next(el.childNodes),
        };
    }
};