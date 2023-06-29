import { useSlate } from "slate-react";
import { Editor as CoreEditor, Editor } from "slate";
import * as React from "react";
import { ReactComponent as BoldIcon } from "../../icons/bold.svg";
import { ReactComponent as ItalicIcon } from "../../icons/italic.svg";
import { ReactComponent as UnderlinedIcon } from "../../icons/underline.svg";
import { ToolbarButton } from "../../implementation/ToolbarButton";
import { getMarkDeserializer } from '../../helpers';
import { parseStringToCSSProperties } from '@epam/uui-core';

export const baseMarksPlugin = () => {
    const renderMark = (props: any, editor: CoreEditor, next: () => any) => {
        switch (props.mark.type) {
            case "uui-richTextEditor-bolde":
                return <strong { ...props.attributes }>{ props.children }</strong>;
            case "uui-richTextEditor-italice":
                return <i { ...props.attributes }>{ props.children }</i>;
            case "uui-richTextEditor-underlinede":
                return <u { ...props.attributes }>{ props.children }</u>;
            case "uui-richTextEditor-superscripte":
                return <sup { ...props.attributes }>{ props.children }</sup>;
            case "uui-richTextEditor-span-marke":
                return <span { ...props.attributes } style={ props.mark.data.get("style") }>{ props.children }</span>;

            default:
                return next();
        }
    };

    const onKeyDown = (event: KeyboardEvent, editor: any, next: () => any) => {
        if (event.ctrlKey && event.keyCode === 66) { // ctrl + b
            return editor.toggleMark("uui-richTextEditor-bold");
        }

        if (event.ctrlKey && event.keyCode === 73) { // ctrl + i
            return editor.toggleMark("uui-richTextEditor-italic");
        }

        if (event.ctrlKey && event.keyCode === 85) { // ctrl + u
            return editor.toggleMark("uui-richTextEditor-underlined");
        }

        if (event.shiftKey && event.keyCode === 8) { // ctrl + backspace
            return document.execCommand("cut");
        }

        return next();
    };

    const hasMark = (editor: any, markType: string | string[]) => {
        if (!editor) {
            return false;
        }

        if ((typeof markType) === "string") {
            return editor.value.activeMarks.some((mark: any) => mark.type === markType);
        } else {
            return (markType as any).some((markType: string) => editor.value.activeMarks.some((mark: any) => mark.type === markType));
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

const isMarkActive = (editor: Editor, format: string) => {
    const marks: any = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

const BoldButton = () => {
    const editor = useSlate();
    const isActive = isMarkActive(editor, 'uui-richTextEditor-bold');
    return <ToolbarButton
        isActive={ isMarkActive(editor, 'uui-richTextEditor-bold') }
        icon={ BoldIcon }
        onClick={ () => editor.addMark('uui-richTextEditor-bold', !isActive) }
    />;
};

const ItalicButton = () => {
    const editor = useSlate();
    const isActive = isMarkActive(editor, 'uui-richTextEditor-italic');
    return <ToolbarButton
        isActive={ isMarkActive(editor, 'uui-richTextEditor-italic') }
        icon={ ItalicIcon }
        onClick={ () => editor.addMark('uui-richTextEditor-italic', !isActive) }
    />;
};

const UnderlineButton = () => {
    const editor = useSlate();
    const isActive = isMarkActive(editor, 'uui-richTextEditor-underlined');
    return <ToolbarButton
        isActive={ isMarkActive(editor, 'uui-richTextEditor-underlined') }
        icon={ UnderlinedIcon }
        onClick={ () => editor.addMark('uui-richTextEditor-underlined', !isActive) }
    />;
};

const MARK_TAGS: any = {
    strong: "uui-richTextEditor-bold",
    em: "uui-richTextEditor-italic",
    u: "uui-richTextEditor-underlined",
    sup: "uui-richTextEditor-superscript",
};

const baseMarkDeserializer = getMarkDeserializer(MARK_TAGS);

const inlineDeserializer = (el: any, next: any) => {
    if (el.tagName.toLowerCase() === "span") {
        return {
            object: "mark",
            type: "uui-richTextEditor-span-mark",
            data: {
                style: parseStringToCSSProperties(el.getAttribute("style")),
            },
            nodes: next(el.childNodes),
        };
    }
};