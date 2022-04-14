import * as React from 'react';
import { cx, DataTableCellProps, RenderCellProps, uuiMod, IEditable } from '@epam/uui-core';
import * as css from './DataTableCell.scss';
import { FlexCell } from '../layout/flexItems/FlexCell';
import { Manager, Popper, PopperChildrenProps, Reference, ReferenceChildrenProps } from 'react-popper';
import { Portal } from '../overlays/Portal';

interface DataTableCellState {
    inFocus: boolean;
}

export const DataTableCell = <TItem, TId, TCellValue>(props: DataTableCellProps<TItem, TId, TCellValue>) => {
    const [state, setState] = React.useState<DataTableCellState>({ inFocus: false });
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

        let outline: React.ReactNode;

        const renderOutline = (referenceProps?: ReferenceChildrenProps) => (
            <div
                className={ cx(css.editorOutline, 'uui-cell-editor-outline') }
                ref={ referenceProps?.ref }
            />
        );

        // Wrap and add validation tooltip
        if (state.inFocus) {
            const popperModifiers = [
                {
                    name: 'preventOverflow',
                    options: {
                        rootBoundary: 'viewport',
                        //boundary: this.props.boundaryElement,
                    },
                },
                {
                    name: 'hide',
                    enabled: true,
                },
            ];

            const renderTooltip = (childProps: PopperChildrenProps) => (
                <div
                    ref={ childProps.ref }
                    style={{ background: 'red', zIndex: 100500, ...childProps.style }}
                >
                    { editorProps.validationMessage }
                </div>
            )

            outline = <Manager>
                <Reference>
                    { renderOutline }
                </Reference>
                { editorProps?.isInvalid && (
                    <Portal>
                        <Popper
                            placement={ 'top-start' }
                            strategy={ 'fixed' }
                            modifiers={ popperModifiers }
                        >
                            { renderTooltip }
                        </Popper>
                    </Portal>
                ) }
            </Manager>
        } else {
            outline = renderOutline();
        }

        return <div className={ css.editorWrapper } >
            { props.renderEditor(renderCellProps) }
            { outline }
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
                state.inFocus && uuiMod.focus,
            ]}
        >
            { props.addons }
            { content }
            { outline }
        </FlexCell>
    );
};