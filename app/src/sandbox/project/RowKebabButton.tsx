import React from 'react';
import { DropdownMenuBody, DropdownMenuButton,
    Dropdown,
    IconButton} from '@epam/promo';
import { DropdownBodyProps } from "@epam/uui-components";
import { ReactComponent as MoreIcon } from "@epam/assets/icons/common/navigation-more_vert-18.svg";
import { InsertTaskCallback, Task } from './types';
import { DataRowProps } from 'uui-core';

export interface RowKebabProps {
    row: DataRowProps<Task, number>;
    insertTask: InsertTaskCallback;
}

export function RowKebabButton({ row, insertTask }: RowKebabProps) {
    const renderBody = React.useCallback((props: DropdownBodyProps) => {
        return (
            <DropdownMenuBody { ...props } style={ { maxWidth: "250px" } }>
                <DropdownMenuButton caption="Add Task below" onClick={() => {
                    //insertTask({ parentId: row.pathid });
                    props.onClose();
                }}/>
                <DropdownMenuButton caption="Add Task above" onClick={() => {
                    //insertTask({ parentId: row.id });
                    props.onClose();
                }}/>
                <DropdownMenuButton caption="Add Sub-Task" onClick={() => {
                    insertTask({ parentId: row.id });
                    props.onClose();
                }}/>
                <DropdownMenuButton caption="Delete" onClick={() => {
                    props.onClose();
                }}/>
            </DropdownMenuBody>
        );
    }, []);

    return (
        <>
            <Dropdown
                renderBody={ renderBody }
                renderTarget={ props => <IconButton icon={ MoreIcon } { ...props } /> }
            />
        </>
    );
}