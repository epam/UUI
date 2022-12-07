import * as React from 'react';
import { MouseEvent } from 'react';
import { DataTableCellProps, RenderEditorProps, uuiElement, uuiMod, cx, ICanBeInvalid,
    TooltipCoreProps, IHasCX } from '@epam/uui-core';
import css from './DataTableCell.scss';
import { FlexCell } from '../layout/';

interface DataTableCellState {
    inFocus: boolean;
}

export const DataTableCell = <TItem, TId, TCellValue>(props: DataTableCellProps<TItem, TId, TCellValue>) => {
    const [state, setState] = React.useState<DataTableCellState>({ inFocus: false });
    const row = props.rowProps;
    const ref = React.useRef<HTMLDivElement>();

    //const { setSelectionRange, selectionRange } = useContext(DataTableSelectionContext);

    let content: React.ReactNode;
    let outline: React.ReactNode = null;
    let isEditable = !!props.onValueChange;

    const handleEditorClick = React.useCallback((e: MouseEvent) => {
        const input: HTMLInputElement = (e.target as HTMLElement).querySelector('.' + uuiElement.input);
        input?.focus();
    }, []);

    if (props.rowProps.isLoading) {
        content = props.renderPlaceholder(props);
    } else if (isEditable) {

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

        content = <div
            className={ css.editorWrapper }
            onClick={ handleEditorClick }
        >
            { props.renderEditor(editorProps) }
            <DataTableCellOverlay
                { ...editorProps }
                renderTooltip={ props.renderTooltip }
                inFocus={ state.inFocus }
                rowIndex={ row.index }
                columnIndex={ props.index }
            />
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
            style={{
                justifyContent
            }}
        >
            { props.addons }
            { content }
            { outline }
        </FlexCell>
    );
};


interface DataTableCellOverlayProps extends IHasCX, ICanBeInvalid {
    inFocus: boolean;
    columnIndex: number;
    rowIndex: number;
    renderTooltip?: (props: ICanBeInvalid & TooltipCoreProps) => React.ReactElement;
}

function DataTableCellOverlay(props: DataTableCellOverlayProps) {
    const overlay = (
            <div
                className={ cx(
                    css.overlay,
                    props.isInvalid && uuiMod.invalid,
                    props.inFocus && uuiMod.focus,
                    props.cx,
                ) }
            />
    );

    if (props.inFocus) {
        return props.renderTooltip({
            trigger: 'manual',
            placement: 'top',
            isVisible: props.isInvalid,
            content: props.validationMessage,
            children: overlay,
        });
    } else {
        return overlay;
    }
}
