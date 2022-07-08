import * as React from 'react';
import { DataTableCellProps, RenderEditorProps, uuiMod, IEditable, ICanFocus, uuiDataTableCell, Lens } from '@epam/uui-core';
import * as css from './DataTableCell.scss';
import { FlexCell } from '../layout/';
import { PointerEventHandler, useContext } from "react";
import { DataTableSelectionContext, DataTableCellOverlay } from "./index";

interface DataTableCellState {
    inFocus: boolean;
}

export const DataTableCell = <TItem, TId, TCellValue>(props: DataTableCellProps<TItem, TId, TCellValue>) => {
    const [state, setState] = React.useState<DataTableCellState>({ inFocus: false });
    const row = props.rowProps;

    const { setSelectionRange, selectionRange } = useContext(DataTableSelectionContext);

    let content: React.ReactNode;
    let outline: React.ReactNode = null;

    if (props.rowProps.isLoading) {
        content = props.renderPlaceholder(props);
    } else if (props.onValueChange) {

        // Copy all attributes explicitly, to avoid bypassing unnecessary DataTableCell props
        // We don't use any helpers and/or deconstruction syntax, as this is performance-sensitive part of code
        const editorProps: RenderEditorProps<TItem, TId, any> = {
            value: props.value,
            onValueChange: props.onValueChange,
            isDisabled: props.isDisabled,
            isInvalid: props.isInvalid,
            isReadonly: props.isReadonly,
            isRequired: props.isRequired,
            validationMessage: props.validationMessage,
            validationProps: props.validationProps,
            onFocus: () => setState({ ...state, inFocus: true }),
            onBlur: () => setState({ ...state, inFocus: false }),
            rowProps: props.rowProps,
            mode: 'cell',
        };

        const handlePointerEnter: PointerEventHandler =  () => {
            if (!selectionRange) {
                return;
            }

            props.canCopyTo({...selectionRange, endRowIndex: row.index, endColumnIndex: props.index }) &&  setSelectionRange(prevState => ({ ...prevState, endRowIndex: row.index, endColumnIndex: props.index }));
        };

        content = <div className={ css.editorWrapper } onPointerEnter={ props.canCopyTo && handlePointerEnter } >
            { props.renderEditor(editorProps) }
            <DataTableCellOverlay
                { ...editorProps }
                renderTooltip={ props.renderTooltip }
                inFocus={ state.inFocus }
                rowIndex={ row.index }
                columnIndex={ props.index }
                allowCopy={ props.allowCopy }
                canCopyTo={ props.canCopyTo }
            />
        </div>;
    } else {
        content = props.column.render(props.rowProps.value, props.rowProps);
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
                props.rowProps.showCellDivider && uuiDataTableCell.uuiTableCellVerticalBorder,
                props.isInvalid && uuiMod.invalid,
                state.inFocus && uuiMod.focus,
            ] }
        >
            { props.addons }
            { content }
            { outline }
        </FlexCell>
    );
};