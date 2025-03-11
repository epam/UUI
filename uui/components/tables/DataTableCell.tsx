import * as React from 'react';
import { DataTableCellProps as UuiCoreDataTableCellProps, Overwrite } from '@epam/uui-core';
import { DataTableCell as UuiDataTableCell } from '@epam/uui-components';
import { DataRowAddons } from '../widgets';
import type { DataTableCellMods } from './types';
import { TextPlaceholder, Text } from '../typography';
import { Tooltip } from '../overlays';
import { settings } from '../../settings';

import './variables.scss';
import css from './DataTableCell.module.scss';

export interface DataTableCellModsOverride {}

export interface DataTableCellProps<TItem, TId, TCellValue> extends
    UuiCoreDataTableCellProps<TItem, TId, TCellValue>, Overwrite<DataTableCellMods, DataTableCellModsOverride> {}

export function DataTableCell<TItem, TId, TCellValue>(initialProps : DataTableCellProps<TItem, TId, TCellValue>) {
    const props = { ...initialProps };

    if (props.isFirstColumn) {
        props.addons = <DataRowAddons size={ props.size } { ...props } />;
    }

    props.renderPlaceholder = props.renderPlaceholder
        || (() => (
            <Text key="t" size={ props.size }>
                <TextPlaceholder isNotAnimated />
            </Text>
        ));

    props.renderUnknown = props.renderUnknown
        || (() => (
            <Text key="t" size={ props.size }>
                Unknown
            </Text>
        ));

    props.renderTooltip = (tooltipProps) => <Tooltip color="critical" { ...tooltipProps } />;

    const isEditable = !!props.onValueChange;

    const getLeftPadding = () => {
        const { rowProps: { isLoading }, columnsGap, isFirstColumn } = props;

        if (isFirstColumn && isEditable && !isLoading) return 'var(--uui-dt-cell-padding)';
        if (isEditable && !isLoading) return '0px';
        if (columnsGap) return isFirstColumn ? `${columnsGap}px` : `${+columnsGap / 2}px`;
        return `var(--uui-dt-cell-padding${isFirstColumn ? '-edge' : ''})`;
    };

    const getRightPadding = () => {
        const { rowProps: { isLoading }, columnsGap, isLastColumn } = props;

        if (isEditable && !isLoading) return '0px';
        if (columnsGap) return isLastColumn ? `${columnsGap}px` : `${+columnsGap / 2}px`;
        return `var(--uui-dt-cell-padding${isLastColumn ? '-edge' : ''})`;
    };

    props.cx = [
        'data-table-cell',
        css.root,
        props.cx,
        'uui-size-' + (props.size || settings.dataTable.sizes.body.row),
        props.isFirstColumn && 'uui-dt-first-column',
        props.isLastColumn && 'uui-dt-last-column',
        css[`align-widgets-${props.alignActions || 'top'}`],
        (props.border || isEditable) && 'uui-dt-vertical-cell-border',
    ];

    props.style = {
        '--uui-dt-cell-padding-start': getLeftPadding(),
        '--uui-dt-cell-padding-end': getRightPadding(),
    } as React.CSSProperties;

    return <UuiDataTableCell { ...props } />;
}
