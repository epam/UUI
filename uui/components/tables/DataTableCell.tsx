import * as React from 'react';
import { DataTableCellProps } from '@epam/uui-core';
import { DataTableCell as UuiDataTableCell } from '@epam/uui-components';
import { DataRowAddons } from '../widgets';
import { DataTableCellMods } from './types';
import { TextPlaceholder, Text } from '../typography';
import { Tooltip } from '../overlays';
import './variables.scss';
import css from './DataTableCell.module.scss';

export function DataTableCell<TItem, TId, TCellValue>(props: DataTableCellProps<TItem, TId, TCellValue> & DataTableCellMods) {
    props = { ...props };

    if (props.isFirstColumn) {
        props.addons = <DataRowAddons { ...props } />;
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

    const defaultPadding = props.padding || (isEditable && !props.rowProps.isLoading && '0') || '12';
    const padding = props.columnsGap === '12' ? '6' : defaultPadding;

    const sideDefaultPadding = props.padding || (isEditable && !props.rowProps.isLoading && '12') || '24';
    const sidePadding = props.columnsGap === '12' ? '12' : sideDefaultPadding;

    props.cx = [
        'uui-dt-vars',
        'data-table-cell',
        props.cx,
        css.cell,
        css['size-' + (props.size || '36')],
        css[`padding-${padding}`],
        props.isFirstColumn && css[`padding-left-${sidePadding}`],
        props.isLastColumn && css[`padding-right-${sidePadding}`],
        css[`align-widgets-${props.alignActions || 'top'}`],
        (props.border || isEditable) && 'uui-dt-vertical-cell-border',
    ];

    return <UuiDataTableCell { ...props } />;
}
