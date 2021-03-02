import { RenderMarkProps } from "slate-react";
import {Editor as CoreEditor} from "slate";
import * as React from "react";
import * as superScriptIcon from "../../icons/super-script.svg";
import {ToolbarButton} from "../../implementation/ToolbarButton";

export const superscriptPlugin = () => {
    const renderMark = (props: RenderMarkProps, editor: CoreEditor, next: () => any) => {
        switch (props.mark.type) {
            case 'uui-richTextEditor-superscript':
                return <sup { ...props.attributes }>{ props.children }</sup>;
            default:
                return next();
        }
    };

    return {
        renderMark,
        toolbarButtons: [SuperscriptButton],
    };
};

const SuperscriptButton = (props: { editor: any }) => {
    return <ToolbarButton isActive={ props.editor.hasMark('uui-richTextEditor-superscript') } icon={ superScriptIcon } onClick={ () => props.editor.toggleMark('uui-richTextEditor-superscript') } />;
};
