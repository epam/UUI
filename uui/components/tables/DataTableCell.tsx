import * as React from 'react';
import { uuiMarkers, DataTableCellProps } from '@epam/uui-core';
import { DragHandle, DataTableCell as UuiDataTableCell } from '@epam/uui-components';
import { DataTableCellMods } from './types';
import { TextPlaceholder, Text } from '../typography';
import { Checkbox } from '../inputs';
import { ReactComponent as FoldingArrow } from '@epam/assets/icons/common/navigation-chevron-down-18.svg';
import { Tooltip } from '../overlays';
import { IconContainer } from '../layout';
import css from './DataTableCell.module.scss';
import './variables.scss';

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
                    // Checkbox check/uncheck should happen after blur.
                    // Otherwise, in "show only selected" mode click event will be handled as interacted outside.
                    onValueChange={ () => setTimeout(() => row.onCheck?.(row), 0) }
                    isDisabled={ row.checkbox.isDisabled }
                    isInvalid={ row.checkbox.isInvalid }
                />
            )}
            {row.indent > 0 && (
                <div key="fold" className={ css.indent } style={ { marginLeft: (row.indent - 1) * 24 } }>
                    {row.isFoldable && (
                        <IconContainer
                            rawProps={ {
                                'aria-label': row.isFolded ? 'Unfold' : 'Fold',
                                role: 'button',
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
            // remove `css.loadingCell` after` removing `margin: 0 3px 3px 0` from `TextPlaceholder` `loadingWord` class styles.
            <Text key="t" size={ props.size !== '60' ? props.size : '48' } cx={ css.loadingCell }>
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
        'uui-dt-vars',
        'data-table-cell',
        props.cx,
        css.cell,
        css['size-' + (props.size || '36')],
        css[`padding-${props.padding || (isEditable && !props.rowProps.isLoading && '0') || '12'}`],
        props.isFirstColumn && css[`padding-left-${props.padding || (isEditable && !props.rowProps.isLoading && '12') || '24'}`],
        props.isLastColumn && css['padding-right-24'],
        css[`align-widgets-${props.alignActions || 'top'}`],
        (props.border || isEditable) && 'uui-dt-vertical-cell-border',
    ];

    return <UuiDataTableCell { ...props } />;
}
