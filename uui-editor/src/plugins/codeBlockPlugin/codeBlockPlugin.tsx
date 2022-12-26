export {};
// import React from "react";
// import { RenderMarkProps } from "slate-react";
// import { ToolbarButton } from "../../implementation/ToolbarButton";
// import { ReactComponent as editorCodeIcon } from "../../icons/editor-code.svg";
//
// export const codeBlockPlugin = () => {
//     const renderMark = (props: RenderMarkProps) => {
//         return <code { ...props.attributes }>{ props.children }</code>;
//     };
//
//     return {
//         renderMark,
//         toolbarButtons: [CodeButton],
//     };
// };
//
// const CodeButton = (props: { editor: any }) => {
//     return <ToolbarButton isActive={ props.editor.hasMark("uui-richTextEditor-code") } icon={ editorCodeIcon } onClick={ () => props.editor.toggleMark("uui-richTextEditor-code") } />;
// };