import * as React from 'react';
import { MouseEvent } from 'react';
import {
    DataTableCellProps, RenderEditorProps, uuiElement, uuiMod, cx, ICanBeInvalid,
    TooltipCoreProps, IHasCX,
} from '@epam/uui-core';
import css from './DataTableCell.scss';
import { FlexCell } from '../layout/';
import { PointerEventHandler, useContext } from "react";
import { CellSelection, DataTableSelectionContext, OnReplicationFn } from "./DataTableSelectionContext";
import { useSelectionParams } from './useSelectionParams';
import { canCopyByDirection } from './canCopyByDirection';
import { copyOnReplicate } from './copy';

interface DataTableCellState {
    inFocus: boolean;
}

export const DataTableCell = <TItem, TId, TCellValue>(props: DataTableCellProps<TItem, TId, TCellValue>) => {
    const [state, setState] = React.useState<DataTableCellState>({ inFocus: false });
    const row = props.rowProps;
    const ref = React.useRef<HTMLDivElement>();

    const { setSelection, selectionRange, selectedCells } = useContext(DataTableSelectionContext);

    const rowIndex = row.index;
    const columnIndex = props.index;

    const { isSelected } = useSelectionParams({ rowIndex, columnIndex });

    let content: React.ReactNode;
    let outline: React.ReactNode = null;
    let isEditable = !!props.onValueChange;

    if (props.rowProps.isLoading) {
        content = props.renderPlaceholder(props);
    } else if (isEditable) {
        const { startColumnIndex, startRowIndex } = selectionRange ?? {};

        const canCopy = props.canCopyTo?.({
            rowIndex: row.index, columnIndex: props.index,
            allowedDirection: props.acceptCopyDirection, startColumnIndex, startRowIndex,
        }) && canCopyByDirection({ startColumnIndex, startRowIndex, allowedDirection: props.acceptCopyDirection, rowIndex, columnIndex });

        const canReplicate = (canCopy && isSelected);

        const startCellValue = selectedCells?.[startRowIndex]?.[startColumnIndex]?.originalValue ?? null;

        // Copy all attributes explicitly, to avoid bypassing unnecessary DataTableCell props
        // We don't use any helpers and/or deconstruction syntax, as this is performance-sensitive part of code
        const editorProps: RenderEditorProps<TItem, TId, any> = {
            value: canReplicate ? (props.onReplication ?? copyOnReplicate)(props.value, { startCellValue, selectionRange, selectedCells }) : props.value,
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

        const handlePointerEnter: PointerEventHandler = props.acceptCopyDirection ? () => {
            if (!selectionRange) {
                return;
            }

            const canCopy = props.canCopyTo?.({
                rowIndex: row.index, columnIndex: props.index,
                allowedDirection: props.acceptCopyDirection, startColumnIndex, startRowIndex,
            });

            const selection: CellSelection<TCellValue> | null = canCopy
                ? {
                    location: { row: row.index, column: props.index },
                    value: props.value,
                    onValueChange: props.onValueChange,
                    onReplication: props.onReplication,
                } : null;

            setSelection(selection, prevState => ({ ...prevState, endRowIndex: row.index, endColumnIndex: props.index }));

        } : null;

        content = <div className={ css.editorWrapper } onPointerEnter={ handlePointerEnter } >
            { props.renderEditor(editorProps) }
            { props.renderOverlay({
                ...editorProps, inFocus: state.inFocus,
                onReplication: props.onReplication ?? copyOnReplicate,
                rowIndex: row.index, columnIndex: props.index,
                acceptCopyDirection: props.acceptCopyDirection, canCopyTo: props.canCopyTo,
            }) }
        </div>;
    } else {
        content = props.column.render(props.rowProps.value, props.rowProps);
    }

    let justifyContent = props.column.justifyContent;
    if (!justifyContent && props.column.textAlign) {
        justifyContent = props.column.textAlign;
    }

    return (
        <FlexCell
            ref={ ref }
            { ...props.column }
            minWidth={ props.column.width }
            rawProps={ {
                role: 'cell',
            } }
            cx={ [
                css.cell,
                props.column.cx,
                props.cx,
                props.isInvalid && uuiMod.invalid,
                state.inFocus && uuiMod.focus,
            ] }
            style={ {
                justifyContent,
            } }
        >
            { props.addons }
            { content }
            { outline }
        </FlexCell>
    );
};
