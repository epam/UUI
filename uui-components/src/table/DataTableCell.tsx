import * as React from 'react';
import { cx, uuiMarkers, DataTableCellProps, FlexCellProps, RenderCellProps, ILens, uuiMod, IEditable } from '@epam/uui-core';
import * as css from './DataTableCell.scss';
import { FlexCell } from '../layout/flexItems/FlexCell';
import { Placement, Boundary } from '@popperjs/core';

interface DataTableCellState {
    inFocus: boolean;
}

export const DataTableCell = <TItem, TId, TCellValue>(props: DataTableCellProps<TItem, TId, TCellValue>) => {
    const [state, setState] = React.useState<DataTableCellState>({ inFocus: false });
    const row = props.rowProps;

    let content;

    let renderCellProps: RenderCellProps<TItem, TId, any> = props.rowProps;
    let editorProps: IEditable<any>;
    let outline: React.ReactNode = null;

    if (props.rowProps.isLoading) {
        content = props.renderPlaceholder(props);
    } else if (props.getLens) {
        const cellLens = props.getLens(row.lens);
        editorProps = cellLens.toProps();

        // TEMP HACK FOR FOCUS
        (editorProps as any).onFocus = () => setState({ ...state, inFocus: true });
        (editorProps as any).onBlur = () => setState({ ...state, inFocus: false });
        (editorProps as any).rawProps = {};
        (editorProps as any).rawProps.onFocus = () => setState({ ...state, inFocus: true });
        (editorProps as any).rawProps.onBlur = () => setState({ ...state, inFocus: false });

        renderCellProps = {
            ...renderCellProps,
            cellLens,
            cellValue: editorProps.value,
            editorProps,
        };

        content = <div className={ css.editorWrapper }>
            { props.renderEditor(renderCellProps) }
            <div className={ cx(css.editorOutline, 'uui-cell-editor-outline') } />
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
            cx={[
                css.cell,
                props.column.cx,
                props.cx,
                editorProps?.isInvalid && uuiMod.invalid,
                state.inFocus && uuiMod.focus,
            ]}
        >
            { props.addons }
            { content }
            { outline }
        </FlexCell>
    );
};