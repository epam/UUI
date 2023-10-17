import React from 'react';
import { DataRowProps, DropdownBodyProps } from '@epam/uui-core';
import {
    DropdownMenuBody, DropdownMenuButton, Dropdown, IconButton,
} from '@epam/uui';
import { ReactComponent as MoreIcon } from '@epam/assets/icons/common/navigation-more_vert-18.svg';
import { ColumnsProps, Task } from './types';

export interface RowKebabProps extends ColumnsProps {
    row: DataRowProps<Task, number>;
}

export function RowKebabButton({ row, insertTask, deleteTask }: RowKebabProps) {
    const renderBody = React.useCallback((props: DropdownBodyProps) => {
        return (
            <DropdownMenuBody { ...props } rawProps={ { style: { maxWidth: '250px' } } }>
                <DropdownMenuButton
                    caption="Add Task above"
                    onClick={ () => {
                        insertTask('top', row.value);
                        props.onClose();
                    } }
                />
                <DropdownMenuButton
                    caption="Add Task below"
                    onClick={ () => {
                        insertTask('bottom', row.value);
                        props.onClose();
                    } }
                />
                <DropdownMenuButton
                    caption="Add Sub-Task"
                    onClick={ () => {
                        insertTask('inside', row.value);
                        props.onClose();
                    } }
                />
                <DropdownMenuButton
                    caption="Delete"
                    onClick={ () => {
                        deleteTask(row.value);
                        props.onClose();
                    } }
                />
            </DropdownMenuBody>
        );
    }, [insertTask, row, deleteTask]);

    return (
        <Dropdown renderBody={ renderBody } renderTarget={ (props) => <IconButton icon={ MoreIcon } { ...props } /> } />
    );
}
