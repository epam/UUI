import * as React from 'react';
import * as css from '../../RichTextEditor.scss';
import { FlexRow } from '@epam/loveship';
import { IEditable } from '@epam/uui';
import { EditorState } from 'draft-js';
import { buttonsMap } from './buttons';
import { ToolbarButton, ToolbarTextColor } from '../../types';

interface ToolbarProps extends IEditable<EditorState> {
    structure: ToolbarButton[];
    // textColors: ToolbarTextColor[];
}

export class Toolbar extends React.Component<ToolbarProps> {
    render() {
        return (
            <FlexRow cx={ css.toolbar } padding='12' vPadding='24' borderBottom='night400' spacing='12' background='white'>
                { this.props.structure.map((button: string, index: number) => {
                    const ToolbarItem = buttonsMap[button as ToolbarButton];
                    return <ToolbarItem { ...this.props } key={ button + index }/>;
                }) }
            </FlexRow>
        );
    }
}