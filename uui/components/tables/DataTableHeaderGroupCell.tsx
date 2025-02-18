import * as React from 'react';
import { cx, DataColumnGroupProps, DataTableHeaderGroupCellProps, Overwrite, uuiDataTableHeaderGroupCell } from '@epam/uui-core';
import { DataTableCellContainer, HeaderCellContentProps } from '@epam/uui-components';
import { DataTableHeaderCellMods } from './types';
import { Tooltip } from '../overlays';
import { Text } from '../typography';
import { settings } from '../../index';

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
        const captionCx = [
            css.caption,
            this.props.textCase === 'upper' && css.upperCase,
            uuiDataTableHeaderGroupCell.uuiTableHeaderGroupCaption,
            this.props.size >= '48' && css.truncate,
        ];

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
                    <Text
                        key="text"
                        fontSize={ settings.dataTable.sizes.header[this.props.textCase === 'upper' ? 'groupCellCaptionUppercase' : 'groupCellCaptionFontSize'] }
                        size={ settings.dataTable.sizes.header.groupCellCaptionSize }
                        cx={ captionCx }
                    >
                        { this.props.group.caption }
                    </Text>
                </Tooltip>
            </div>
        );
    };

    getLeftPadding = () => {
        const { columnsGap, isFirstCell } = this.props;

        if (columnsGap) return isFirstCell ? columnsGap : +columnsGap / 2;
        return isFirstCell ? settings.dataTable.sizes.header.defaultGroupCellPaddingEdge : settings.dataTable.sizes.header.defaultGroupCellPadding;
    };

    getRightPadding = () => {
        const { columnsGap, isLastCell } = this.props;

        if (columnsGap) return isLastCell ? columnsGap : +columnsGap / 2;
        return isLastCell ? settings.dataTable.sizes.header.defaultGroupCellPaddingEdge : settings.dataTable.sizes.header.defaultGroupCellPadding;
    };

    renderCellContent = (props: HeaderCellContentProps) => {
        const computeStyles = {
            '--uui-dt-header-group-cell-padding-start': `${this.getLeftPadding()}px`,
            '--uui-dt-header-group-cell-padding-end': `${this.getRightPadding()}px`,
        } as React.CSSProperties;

        return (
            <DataTableCellContainer
                column={ this.props.group }
                ref={ (ref) => {
                    (props.ref as React.RefCallback<HTMLElement>)(ref);
                } }
                cx={ cx(
                    uuiDataTableHeaderGroupCell.uuiTableHeaderGroupCell,
                    css.root,
                    `uui-size-${this.props.size || settings.dataTable.sizes.header.defaultGroupCell}`,
                    this.props.isFirstCell && 'uui-dt-header-first-column',
                    this.props.isLastCell && 'uui-dt-header-last-column',
                ) }
                rawProps={ {
                    role: 'columnheader',
                    ...props.eventHandlers,
                } }
                style={ computeStyles }
            >
                { this.getColumnCaption() }
            </DataTableCellContainer>
        );
    };

    render() {
        if (this.props.group.renderHeaderCell) {
            return this.props.group.renderHeaderCell(this.props);
        }

        const computeStyles = {
            '--uui-dt-header-group-cell-padding-start': `${this.getLeftPadding()}px`,
            '--uui-dt-header-group-cell-padding-end': `${this.getRightPadding()}px`,
        } as React.CSSProperties;

        return (
            <DataTableCellContainer
                column={ this.props.group }
                cx={ cx(
                    uuiDataTableHeaderGroupCell.uuiTableHeaderGroupCell,
                    css.root,
                    `uui-size-${this.props.size || settings.dataTable.sizes.header.defaultGroupCell}`,
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
