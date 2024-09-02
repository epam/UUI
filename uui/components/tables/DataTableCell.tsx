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
                <TextPlaceholder isNotAnimated={ true } />
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

    const getPaddings = () => {
        const { rowProps, padding, columnsGap } = props;
        const { isLoading } = rowProps;

        if (isEditable && !isLoading) {
            return { padding: '0', sidePadding: '12' };
        }

        if (padding) {
            return { padding, sidePadding: padding };
        }

        switch (columnsGap) {
            case '12':
                return { padding: '6', sidePadding: '12' };
            case '24':
                return { padding: '12', sidePadding: '24' };
        }

        return { padding: '12', sidePadding: '24' };
    };

    props.cx = [
        'data-table-cell',
        props.cx,
        css.cell,
        css['size-' + (props.size || '36')],
        css[`padding-${getPaddings().padding}`],
        props.isFirstColumn && css[`padding-left-${getPaddings().sidePadding}`],
        props.isLastColumn && css[`padding-right-${getPaddings().sidePadding}`],
        css[`align-widgets-${props.alignActions || 'top'}`],
        (props.border || isEditable) && 'uui-dt-vertical-cell-border',
    ];

    return <UuiDataTableCell { ...props } />;
}
