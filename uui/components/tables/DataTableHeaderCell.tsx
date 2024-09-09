import * as React from 'react';
import {
    cx, DataColumnProps, DataTableHeaderCellProps, IDropdownTogglerProps, Overwrite, uuiDataTableHeaderCell, uuiMarkers,
} from '@epam/uui-core';
import {
    DataTableCellContainer,
    DataTableHeaderCell as UuiDataTableHeaderCell,
    HeaderCellContentProps,
} from '@epam/uui-components';
import { ColumnHeaderDropdown } from './ColumnHeaderDropdown';
import { DataTableHeaderCellMods } from './types';
import { IconButton } from '../buttons';
import { Checkbox, CheckboxProps } from '../inputs';
import { Tooltip } from '../overlays';
import { Text, TextProps } from '../typography';
import { ReactComponent as DefaultSortIcon } from '@epam/assets/icons/table-swap-outline.svg';
import { ReactComponent as SortIcon } from '@epam/assets/icons/table-sort_asc-outline.svg';
import { ReactComponent as SortIconDesc } from '@epam/assets/icons/table-sort_desc-outline.svg';
import { ReactComponent as FilterIcon } from '@epam/assets/icons/content-filtration-fill.svg';
import { ReactComponent as DropdownIcon } from '@epam/assets/icons/navigation-chevron_down-outline.svg';
import { ReactComponent as OpenedDropdownIcon } from '@epam/assets/icons/navigation-chevron_up-outline.svg';
import { ReactComponent as FoldIcon } from '@epam/assets/icons/navigation-collapse_all-outline.svg';
import { ReactComponent as UnfoldIcon } from '@epam/assets/icons/navigation-expand_all-outline.svg';
import { i18n } from '../../i18n';
import { settings } from '../../settings';

import './variables.scss';
import css from './DataTableHeaderCell.module.scss';

interface DataTableHeaderCellState {
    isDropdownOpen: boolean;
}

export interface DataTableHeaderCellModsOverride {
}

export class DataTableHeaderCell<TItem, TId> extends
    React.Component<
    DataTableHeaderCellProps<TItem, TId> & Overwrite<DataTableHeaderCellMods,
    DataTableHeaderCellModsOverride>,
    DataTableHeaderCellState
    > {
    state: DataTableHeaderCellState = {
        isDropdownOpen: null,
    };

    getTooltipContent = (column: DataColumnProps<TItem, TId>) => (
        <div className={ cx(css.cellTooltipWrapper, uuiDataTableHeaderCell.uuiTableHeaderCaptionTooltip) }>
            <Text cx={ [css.cellTooltipText, css.tooltipCaption] }>
                { column.caption }
            </Text>
            { column.info && (
                <Text cx={ [css.cellTooltipText, css.tooltipInfo] }>
                    { column.info }
                </Text>
            ) }
        </div>
    );

    getColumnCaption = () => {
        const renderTooltip = this.props.column.renderTooltip || this.getTooltipContent;
        const captionCx = [
            css.caption,
            this.props.textCase === 'upper' && css.upperCase,
            uuiDataTableHeaderCell.uuiTableHeaderCaption,
            settings.sizes.dataTable.header.row.cell.truncate.includes(this.props.size) && css.truncate,
        ];

        return (
            <div
                className={ cx(css.captionWrapper, css['align-' + this.props.column.textAlign], uuiDataTableHeaderCell.uuiTableHeaderCaptionWrapper) }
            >
                <Tooltip
                    placement="top"
                    color="inverted"
                    content={ renderTooltip(this.props.column) }
                    cx={ css.cellTooltip }
                    openDelay={ 600 }
                >
                    <Text
                        key="text"
                        lineHeight={ settings.sizes.dataTable.header.row.cell.columnCaption.lineHeight as TextProps['lineHeight'] }
                        fontSize={ settings.sizes.dataTable.header.row.cell.columnCaption[this.props.textCase === 'upper' ? 'uppercase' : 'fontSize'] as TextProps['fontSize'] }
                        size={ settings.sizes.dataTable.header.row.cell.columnCaption.size as TextProps['size'] }
                        cx={ captionCx }
                    >
                        { this.props.column.caption }
                    </Text>
                </Tooltip>
                { this.props.column.isSortable && (!this.props.column.renderFilter || this.props.sortDirection) && (
                    <IconButton
                        key="sort"
                        cx={ cx(css.icon, css.sortIcon, this.props.sortDirection && css.sortIconActive, uuiDataTableHeaderCell.uuiTableHeaderSortIcon) }
                        color={ this.props.sortDirection ? 'neutral' : 'secondary' }
                        icon={ this.props.sortDirection === 'desc' ? SortIconDesc : this.props.sortDirection === 'asc' ? SortIcon : DefaultSortIcon }
                    />
                ) }
                { this.props.isFilterActive && (
                    <IconButton
                        key="filter"
                        cx={ cx(css.icon, !this.props.sortDirection && css.filterIcon, uuiDataTableHeaderCell.uuiTableHeaderFilterIcon) }
                        color="neutral"
                        icon={ FilterIcon }
                    />
                ) }
                { this.props.column.renderFilter && (
                    <IconButton
                        key="dropdown"
                        cx={ cx(css.icon, css.dropdownIcon, uuiDataTableHeaderCell.uuiTableHeaderDropdownIcon) }
                        color="secondary"
                        icon={ this.state.isDropdownOpen ? OpenedDropdownIcon : DropdownIcon }
                    />
                ) }
            </div>
        );
    };

    renderHeaderCheckbox = () => {
        if (this.props.selectAll && this.props.isFirstColumn) {
            return (
                <Checkbox
                    size={ settings.sizes.dataTable.header.row.cell.checkbox[this.props.size] as CheckboxProps['size'] }
                    { ...this.props.selectAll }
                    cx={ cx(css.checkbox, uuiDataTableHeaderCell.uuiTableHeaderCheckbox) }
                />
            );
        }
    };

    renderFoldAllIcon = () => {
        if (this.props.isFirstColumn && this.props.showFoldAll) {
            return (
                <Tooltip content={
                    this.props.areAllFolded
                        ? i18n.tables.columnHeader.expandAllTooltip
                        : i18n.tables.columnHeader.collapseAllTooltip
                }
                >
                    <IconButton
                        color="secondary"
                        cx={ cx(css.icon, css.foldAllIcon, uuiDataTableHeaderCell.uuiTableHeaderFoldAllIcon) }
                        icon={ this.props.areAllFolded ? UnfoldIcon : FoldIcon }
                        onClick={ this.props.onFoldAll }
                        rawProps={ {
                            'aria-label': this.props.areAllFolded ? 'Expand All' : 'Collapse All',
                            'aria-expanded': !!this.props.areAllFolded,
                        } }
                    />
                </Tooltip>
            );
        }
    };

    renderResizingMarker = (props: HeaderCellContentProps) => {
        return (
            <div
                role="separator"
                onMouseDown={ props.onResizeStart }
                className={ cx(css.resizingMarker, uuiMarkers.draggable, uuiMarkers.clickable) }
            />
        );
    };

    getLeftPadding = () => {
        const { columnsGap, isFirstColumn } = this.props;

        if (columnsGap) return isFirstColumn ? columnsGap : +columnsGap / 2;
        return isFirstColumn ? settings.sizes.dataTable.header.row.cell.defaults.paddingEdge : settings.sizes.dataTable.header.row.cell.defaults.padding;
    };

    getRightPadding = () => {
        const { columnsGap, isLastColumn } = this.props;

        if (columnsGap) return isLastColumn ? columnsGap : +columnsGap / 2;
        return isLastColumn ? settings.sizes.dataTable.header.row.cell.defaults.paddingEdge : settings.sizes.dataTable.header.row.cell.defaults.padding;
    };

    getResizingMarkerWidth = () => {
        const { columnsGap } = this.props;
        return columnsGap ? +columnsGap / 2 : settings.sizes.dataTable.header.row.cell.defaults.resizeMarker;
    };

    renderCellContent = (props: HeaderCellContentProps, dropdownProps?: IDropdownTogglerProps) => {
        const isResizable = this.props.column.allowResizing ?? this.props.allowColumnsResizing;
        const onClickEvent = !props.isResizing && (!this.props.column.renderFilter ? props.toggleSort : dropdownProps?.onClick);

        const computeStyles = {
            '--uui-dt-header-cell-icon-size': `${settings.sizes.dataTable.header.row.cell.iconSize[this.props.size || settings.sizes.dataTable.header.row.cell.defaults.size]}px`,
            '--uui-dt-header-cell-padding-start': `${this.getLeftPadding()}px`,
            '--uui-dt-header-cell-padding-end': `${this.getRightPadding()}px`,
            '--uui-dt-header-cell-resizing-marker-width': `${this.getResizingMarkerWidth()}px`,
        } as React.CSSProperties;

        return (
            <DataTableCellContainer
                column={ this.props.column }
                ref={ (ref) => {
                    (props.ref as React.RefCallback<HTMLElement>)(ref);
                    (dropdownProps?.ref as React.RefCallback<HTMLElement>)?.(ref);
                } }
                cx={ cx(
                    uuiDataTableHeaderCell.uuiTableHeaderCell,
                    (this.props.column.isSortable || this.props.isDropdown) && uuiMarkers.clickable,
                    css.root,
                    `uui-size-${this.props.size || settings.sizes.dataTable.header.row.cell.defaults.size}`,
                    this.props.isFirstColumn && 'uui-dt-header-first-column',
                    this.props.isLastColumn && 'uui-dt-header-last-column',
                    this.props.column.fix && css['pinned-' + this.props.column.fix],
                    isResizable && css.resizable,
                    props.isDraggable && css.draggable,
                    props.isDragGhost && css.ghost,
                    props.isDraggedOut && css.isDraggedOut,
                    props.isDndInProgress && css['dnd-marker-' + props.position],
                ) }
                onClick={ onClickEvent }
                rawProps={ {
                    role: 'columnheader',
                    'aria-sort': this.props.sortDirection === 'asc' ? 'ascending' : this.props.sortDirection ? 'descending' : 'none',
                    ...props.eventHandlers,
                } }
                style={ computeStyles }
            >
                { this.renderHeaderCheckbox() }
                { this.renderFoldAllIcon() }
                { this.getColumnCaption() }
                { isResizable && this.renderResizingMarker(props) }
            </DataTableCellContainer>
        );
    };

    renderCellWithFilter = (props: HeaderCellContentProps) => (
        <ColumnHeaderDropdown
            isOpen={ this.state.isDropdownOpen }
            isSortable={ this.props.column.isSortable }
            renderTarget={ (dropdownProps) => this.renderCellContent(props, dropdownProps) }
            renderFilter={ this.props.renderFilter }
            onSort={ this.props.onSort }
            sortDirection={ this.props.sortDirection }
            onOpenChange={ (isDropdownOpen) => this.setState({ isDropdownOpen }) }
            title={ this.props.column.caption as string }
        />
    );

    render() {
        if (this.props.column.renderHeaderCell) {
            return this.props.column.renderHeaderCell(this.props);
        }

        return (
            <UuiDataTableHeaderCell
                { ...this.props }
                renderCellContent={ this.props.column.renderFilter ? this.renderCellWithFilter : this.renderCellContent }
            />
        );
    }
}
