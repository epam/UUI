import * as React from 'react';
import { cx, DataColumnGroupProps, DataTableHeaderGroupCellProps, Overwrite, uuiDataTableHeaderGroupCell } from '@epam/uui-core';
import { DataTableCellContainer } from '@epam/uui-components';
import type { DataTableHeaderCellMods } from './types';
import { Tooltip } from '../overlays';
import { Text } from '../typography';
import { settings } from '../../settings';

import './variables.scss';
import css from './DataTableHeaderGroupCell.module.scss';

export interface DataTableHeaderGroupCellModsOverride {
}

export class DataTableHeaderGroupCell extends
    React.Component<
    DataTableHeaderGroupCellProps & Overwrite<DataTableHeaderCellMods,
    DataTableHeaderGroupCellModsOverride>
    > {
    getTooltipContent = (column: DataColumnGroupProps) => (
        <div className={ cx(css.groupCellTooltipWrapper, uuiDataTableHeaderGroupCell.uuiTableHeaderGroupCaptionTooltip) }>
            <Text cx={ [css.groupCellTooltipText, css.tooltipCaption] }>
                { column.caption }
            </Text>
            { column.info && (
                <Text cx={ [css.groupCellTooltipText, css.tooltipInfo] }>
                    { column.info }
                </Text>
            ) }
        </div>
    );

    getColumnCaption = () => {
        const renderTooltip = this.props.group.renderTooltip || this.getTooltipContent;
        const captionCx = cx(
            css.caption,
            this.props.textCase === 'upper' && css.upperCase,
            uuiDataTableHeaderGroupCell.uuiTableHeaderGroupCaption,
            'uui-typography-inline',
            this.props.size >= '48' && css.truncate,
        );

        return (
            <div
                className={ cx(css.captionWrapper, css['align-' + this.props.group.textAlign], uuiDataTableHeaderGroupCell.uuiTableHeaderGroupCaptionWrapper) }
            >
                <Tooltip
                    placement="top"
                    color="inverted"
                    content={ renderTooltip(this.props.group) }
                    cx={ css.groupCellTooltip }
                    openDelay={ 600 }
                >
                    <div key="text" className={ captionCx }>
                        { this.props.group.caption }
                    </div>
                </Tooltip>
            </div>
        );
    };

    getLeftPadding = () => {
        const { columnsGap, isFirstCell } = this.props;

        if (columnsGap) return isFirstCell ? `${columnsGap}px` : `${+columnsGap / 2}px`;
        return `var(--uui-dt-header-group-cell-padding${isFirstCell ? '-edge' : ''})`;
    };

    getRightPadding = () => {
        const { columnsGap, isLastCell } = this.props;

        if (columnsGap) return isLastCell ? `${columnsGap}px` : `${+columnsGap / 2}px`;
        return `var(--uui-dt-header-group-cell-padding${isLastCell ? '-edge' : ''})`;
    };

    render() {
        if (this.props.group.renderHeaderCell) {
            return this.props.group.renderHeaderCell(this.props);
        }

        const computeStyles = {
            '--uui-dt-header-group-cell-padding-start': this.getLeftPadding(),
            '--uui-dt-header-group-cell-padding-end': this.getRightPadding(),
        } as React.CSSProperties;

        return (
            <DataTableCellContainer
                column={ this.props.group }
                cx={ cx(
                    uuiDataTableHeaderGroupCell.uuiTableHeaderGroupCell,
                    css.root,
                    `uui-size-${this.props.size || settings.dataTable.sizes.header.row}`,
                    this.props.isFirstCell && 'uui-dt-header-first-column',
                    this.props.isLastCell && 'uui-dt-header-last-column',
                ) }
                rawProps={ { role: 'columnheader' } }
                style={ computeStyles }
            >
                { this.getColumnCaption() }
            </DataTableCellContainer>
        );
    }
}
