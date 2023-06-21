import * as React from 'react';
import { uuiMarkers, DataTableCellProps } from '@epam/uui-core';
import { DragHandle, DataTableCell as UuiDataTableCell } from '@epam/uui-components';
import { DataTableCellMods } from './types';
import { TextPlaceholder, Text } from '../typography';
import { Checkbox } from '../inputs';
import { ReactComponent as FoldingArrow } from '../../icons/tree_folding_arrow.svg';
import css from './DataTableCell.module.scss';
import { Tooltip } from '../overlays';
import { IconContainer } from '../layout';

function DataTableRowAddons<TItem, TId, TCellValue>(props: DataTableCellProps<TItem, TId, TCellValue> & DataTableCellMods) {
    const row = props.rowProps;
    const additionalItemSize = +props.size < 30 ? '12' : '18';

    return (
        <>
            {row.dnd?.srcData && <DragHandle key="dh" cx={ css.dragHandle } />}
            {row?.checkbox?.isVisible && (
                <Checkbox
                    key="cb"
                    cx={ css.checkbox }
                    tabIndex={ props.tabIndex }
                    size={ additionalItemSize }
                    value={ row.isChecked }
                    indeterminate={ !row.isChecked && row.isChildrenChecked }
                    onValueChange={ () => row.onCheck?.(row) }
                    isDisabled={ row.checkbox.isDisabled }
                    isInvalid={ row.checkbox.isInvalid }
                />
            )}
            {row.indent > 0 && (
                <div key="fold" className={ css.indent } style={ { marginLeft: (row.indent - 1) * 24 } }>
                    {row.isFoldable && (
                        <IconContainer
                            rawProps={ {
                                'aria-label': 'Fold/Unfold',
                                'data-testid': `uui-DataTableRowAddons-folding-arrow-${row.rowKey}`,
                            } }
                            key="icon"
                            icon={ FoldingArrow }
                            cx={ [
                                css.foldingArrow, css[`folding-arrow-${additionalItemSize}`], uuiMarkers.clickable, css.iconContainer,
                            ] }
                            rotate={ row.isFolded ? '90ccw' : '0' }
                            onClick={ () => row.onFold(row) }
                        />
                    )}
                </div>
            )}
        </>
    );
}

export function DataTableCell<TItem, TId, TCellValue>(props: DataTableCellProps<TItem, TId, TCellValue> & DataTableCellMods) {
    props = { ...props };

    if (props.isFirstColumn) {
        props.addons = <DataTableRowAddons { ...props } />;
    }

    props.renderPlaceholder = props.renderPlaceholder
        || (() => (
            <Text key="t" size={ props.size !== '60' ? props.size : '48' }>
                <TextPlaceholder />
            </Text>
        ));

    props.renderUnknown = props.renderUnknown
        || (() => (
            <Text key="t" size={ props.size !== '60' ? props.size : '48' }>
                Unknown
            </Text>
        ));

    props.renderTooltip = (tooltipProps) => <Tooltip color="critical" { ...tooltipProps } />;

    const isEditable = !!props.onValueChange;

    props.cx = [
        'data-table-cell',
        props.cx,
        css.cell,
        css['size-' + (props.size || '36')],
        css[`padding-${props.padding || (isEditable && !props.rowProps.isLoading && '0') || '12'}`],
        props.isFirstColumn && css[`padding-left-${props.padding || '24'}`],
        props.isLastColumn && css['padding-right-24'],
        css[`align-widgets-${props.alignActions || 'top'}`],
        (props.border || isEditable) && 'uui-dt-vertical-cell-border',
    ];

    return <UuiDataTableCell { ...props } />;
}
