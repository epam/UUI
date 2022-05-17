import * as React from 'react';
import { uuiMarkers, DataTableCellProps, withMods, DataTableCellOverlayProps, ICanBeInvalid, TooltipCoreProps } from '@epam/uui-core';
import { IconContainer, DragHandle, DataTableCell as UuiDataTableCell,
    DataTableCellOverlay as UuiDataTableCellOverlay } from '@epam/uui-components';
import { DataTableCellMods } from './types';
import { TextPlaceholder, Text } from '../typography';
import { Checkbox } from '../inputs';
import { ReactComponent as FoldingArrow } from '../../icons/tree_folding_arrow.svg';
import * as css from './DataTableCell.scss';
import { Tooltip } from '../overlays';

function renderTooltip(props: ICanBeInvalid & TooltipCoreProps): React.ReactElement {
    return <Tooltip color='red' { ...props } />;
}

const DataTableCellOverlay = withMods<DataTableCellOverlayProps, {}>(
    UuiDataTableCellOverlay,
    () => [css.overlay],
    props => ({ renderTooltip }),
);

function DataTableRowAddons<TItem, TId, TCellValue>(props: DataTableCellProps<TItem, TId, TCellValue> & DataTableCellMods) {
    const row = props.rowProps;
    const additionalItemSize = +props.size < 30 ? '12' : '18';

    return <>
        { row.dnd?.srcData && <DragHandle key='dh' cx={ css.dragHandle } /> }
        { row?.checkbox?.isVisible && <Checkbox
            key='cb'
            cx={ css.checkbox }
            tabIndex={ props.tabIndex }
            size={ additionalItemSize }
            value={ row.isChecked }
            indeterminate={ !row.isChecked && row.isChildrenChecked }
            onValueChange={ () => row.onCheck(row) }
            isDisabled={ row.checkbox.isDisabled }
            isInvalid={ row.checkbox.isInvalid }
        />
        }
        { row.indent > 0 && (
            <div key='fold' className={ css.indent } style={ { marginLeft: (row.indent - 1) * 24 } }>
                { row.isFoldable &&
                    <IconContainer
                        key='icon'
                        icon={ FoldingArrow }
                        cx={ [css.foldingArrow, css[`folding-arrow-${additionalItemSize}`], uuiMarkers.clickable] }
                        rotate={ row.isFolded ? '90ccw' : '0' }
                        onClick={ () => row.onFold(row) }
                    />
                }
            </div>
        ) }
    </>;
}

export function DataTableCell<TItem, TId, TCellValue>(props: DataTableCellProps<TItem, TId, TCellValue> & DataTableCellMods) {
    props = { ...props };

    if (props.isFirstColumn) {
        props.addons = <DataTableRowAddons { ...props } />;
    }

    props.renderPlaceholder = props.renderPlaceholder || (() => (
        <Text key='t' size={ props.size != '60' ? props.size : '48' }>
            <TextPlaceholder />
        </Text>
    ));

    const isEditable = !!props.getLens;

    props.cx = [
        props.cx,
        css.cell,
        css['size-' + (props.size || '36')],
        css[`padding-${ props.padding || (isEditable && '0') || '12' }`],
        props.isFirstColumn && css[`padding-left-${ props.padding || '24' }`],
        props.isLastColumn && css['padding-right-24'],
        css[`align-widgets-${ props.alignActions || 'top' }`],
    ];

    const rowIndex = props.rowProps.index;
    const { index: columnIndex } = props;

    props.renderOverlay = (props => <DataTableCellOverlay { ...props } rowIndex={ rowIndex } columnIndex={ columnIndex } />);

    return <UuiDataTableCell { ...props } />;
}
