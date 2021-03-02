import * as React from 'react';
import { uuiSkin } from '@epam/uui';
import { RenderBlockProps } from "slate-react";
import * as css from './ToDoItem.scss';

const { Checkbox, FlexRow } = uuiSkin;

export class ToDoItem extends React.Component<RenderBlockProps, any> {

    onChange = (value: boolean) => {
        const { editor, node } = this.props;
        editor.setNodeByKey(node.key, {
            data: { checked: value },
            type: 'toDoItem',
        });
    }

    render() {

        const data = this.props.node.data;
        return (
            <FlexRow rawProps={ this.props.attributes }>
                <div contentEditable={ false } className={ css.checkboxContainer }><Checkbox value={ data.get('checked') } onValueChange={ this.onChange }/></div>
                { this.props.children }
            </FlexRow>
        );
    }
}