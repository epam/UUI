import * as React from 'react';
import { cx, DataTableCellProps, RenderCellProps, uuiMod, IEditable } from '@epam/uui-core';
import * as css from './DataTableCell.scss';
import { FlexCell } from '../layout/flexItems/FlexCell';

interface DataTableCellState {
    hasFocus: boolean;
}

export const DataTableCell = <TItem, TId, TCellValue>(props: DataTableCellProps<TItem, TId, TCellValue>) => {
    const [state, setState] = React.useState<DataTableCellState>({ hasFocus: false });
    const row = props.rowProps;

    let content: React.ReactNode;

    let renderCellProps: RenderCellProps<TItem, TId, any> = props.rowProps;
    let editorProps: IEditable<any>;
    let outline: React.ReactNode = null;

    if (props.rowProps.isLoading) {
        content = props.renderPlaceholder(props);
    } else if (props.getLens) {
        const cellLens = props.getLens(row.lens);
        editorProps = cellLens.toProps();

        // TEMP HACK FOR FOCUS (remove 'as any' after ICanFocus implementation)
        (editorProps as any).onFocus = () => setState({ ...state, hasFocus: true });
        (editorProps as any).onBlur = () => setState({ ...state, hasFocus: false });

        renderCellProps = {
            ...renderCellProps,
            cellLens,
            cellValue: editorProps.value,
            editorProps,
        };

        content = <div className={ css.editorWrapper } >
            { props.renderEditor(renderCellProps) }
            { props.renderOverlay({ ...editorProps, hasFocus: state.hasFocus }) }
        </div>
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
            cx={[
                css.cell,
                props.column.cx,
                props.cx,
                editorProps?.isInvalid && uuiMod.invalid,
                state.hasFocus && uuiMod.focus,
            ]}
        >
            { props.addons }
            { content }
            { outline }
        </FlexCell>
    );
};