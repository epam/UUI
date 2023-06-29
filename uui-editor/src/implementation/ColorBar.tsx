import * as React from 'react';
import { ReactComponent as ClearIcon } from "../icons/text-color-default.svg";
import { ReactComponent as ColorIcon } from '../icons/text-color-select.svg';
import { ToolbarButton } from './ToolbarButton';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { uuiSkin } from "@epam/uui-core";
import { useState } from "react";

interface ColorBarProps {
    editor: Editor;
}

const { FlexRow } = uuiSkin;

export function ColorBar() {
    //const editor = useSlate();

    //const [isActive, setIsActive] = useState(false);

    const removeMarks = () => {
        // console.log(this.props.editor);
        // this.props.editor.marks.toArray().map((mark: any) => {
        //     console.log('sdfsdfsdfsdf', mark)
        //     mark.type === 'uui-richTextEditor-span-mark' && this.props.editor.removeMark(mark);
        // });
    };

    // const isMarkActive = (editor: any, format: string) => {
    //     const marks: any = Editor.marks(editor);
    //
    //     return marks ? marks[format] === true : false;
    // };

    const toggleMark = (color: string) => {
        //this.removeMarks();

        // const isActive = isMarkActive(editor, 'bold');
        //
        // if (isActive) {
        //     Editor.removeMark(editor, 'bold');
        // } else {
        //     Editor.addMark(editor, 'bold', true);
        // }
    };

    return <FlexRow rawProps={ { style: { background: '#303240' } } }>
        <ToolbarButton isActive={ false } icon={ ClearIcon } onClick={ () => removeMarks() } />
        <ToolbarButton iconColor='red' isActive={ false } icon={ ColorIcon } onClick={ () => { toggleMark('#A72014'); } } />
        <ToolbarButton iconColor='amber' isActive={ false } icon={ ColorIcon } onClick={ () => { toggleMark('#995A00'); } } />
        <ToolbarButton iconColor='green' isActive={ false } icon={ ColorIcon } onClick={ () => { toggleMark('#669900'); } } />
    </FlexRow>;
}