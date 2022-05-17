import * as React from 'react';
import { DataTableCellProps, RenderCellProps, uuiMod, IEditable, ICanFocus } from '@epam/uui-core';
import * as css from './DataTableCell.scss';
import { FlexCell } from '../layout/';
import { PointerEventHandler, useContext } from "react";
import { DataTableSelectionContext } from "./DataTableSelectionContext";

interface DataTableCellState {
    inFocus: boolean;
}

export const DataTableCell = <TItem, TId, TCellValue>(props: DataTableCellProps<TItem, TId, TCellValue>) => {
    const [state, setState] = React.useState<DataTableCellState>({ inFocus: false });
    const row = props.rowProps;

    const { setSelectionRange, selectionRange } = useContext(DataTableSelectionContext);

    let content: React.ReactNode;

    let renderCellProps: RenderCellProps<TItem, TId, any> = props.rowProps;
    let editorProps: IEditable<any> & ICanFocus<HTMLElement>;
    let outline: React.ReactNode = null;

    if (props.rowProps.isLoading) {
        content = props.renderPlaceholder(props);
    } else if (props.getLens) {
        const cellLens = props.getLens(row.lens);
        editorProps = cellLens.toProps();

        editorProps.onFocus = () => setState({ ...state, inFocus: true });
        editorProps.onBlur = () => setState({ ...state, inFocus: false });

        renderCellProps = {
            ...renderCellProps,
            cellLens,
            cellValue: editorProps.value,
            editorProps,
        };

        const handlePointerEnter: PointerEventHandler =  props.canCopyPaste ? () => {
            if (!selectionRange) {
                return;
            }

            setSelectionRange(prevState => ({ ...prevState, endRowIndex: row.index, endColumnIndex: props.index }));
        } : null;

        content = <div className={ css.editorWrapper } onPointerEnter={ handlePointerEnter } >
            { props.renderEditor(renderCellProps) }
            { props.renderOverlay({ ...editorProps, inFocus: state.inFocus, rowIndex: row.index, columnIndex: props.index, canCopyPaste: props.canCopyPaste }) }
        </div>;
    } else {
        content = props.column.render(props.rowProps.value, renderCellProps);
    }

    return (
        <FlexCell
            { ...props.column }
            minWidth={ props.column.width }
            rawProps={ {
                role: props.role,
            } }
            cx={ [
                css.cell,
                props.column.cx,
                props.cx,
                editorProps?.isInvalid && uuiMod.invalid,
                state.inFocus && uuiMod.focus,
            ] }
        >
            { props.addons }
            { content }
            { outline }
        </FlexCell>
    );
};