import * as React from 'react';
import * as clearIcon from "../icons/text-color-default.svg";
import * as colorIcon from '../icons/text-color-select.svg';
import { ToolbarButton } from './ToolbarButton';
import { Editor } from 'slate-react';
import { uuiSkin } from "@epam/uui";

interface ColorBarProps {
    editor: Editor;
}

const { FlexRow } = uuiSkin;

export class ColorBar extends React.Component<ColorBarProps> {
    state: any = {
        isActive: false,
    };

    removeMarks() {
        this.props.editor.value.texts.toArray().map(text => {
            text.marks.toArray().map(mark => {
                mark.type === 'uui-richTextEditor-span-mark' && this.props.editor.removeMark(mark);
            });
        });
    }

    toggleMark(color: string) {
        this.removeMarks();

        this.props.editor.addMark({ type: 'uui-richTextEditor-span-mark', data: { style: { color: color } } });
    }

    renderColorMenu() {

        return <FlexRow rawProps={ { style: { background: '#303240' } } }>
            <ToolbarButton isActive={ false } icon={ clearIcon } onClick={ () => this.removeMarks() } />
            <ToolbarButton iconColor='red' isActive={ false } icon={ colorIcon } onClick={ () => { this.toggleMark('#A72014'); } } />
            <ToolbarButton iconColor='amber' isActive={ false } icon={ colorIcon } onClick={ () => { this.toggleMark('#995A00'); } } />
            <ToolbarButton iconColor='green' isActive={ false } icon={ colorIcon } onClick={ () => { this.toggleMark('#669900'); } } />
        </FlexRow>;
    }

    render() {

        return this.renderColorMenu();
    }
}