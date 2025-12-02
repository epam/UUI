import * as React from 'react';
import {
    cx, DataColumnProps, DataTableHeaderCellProps as UuiCoreDataTableHeaderCellProps, IDropdownTogglerProps, Overwrite, uuiDataTableHeaderCell, uuiMarkers,
} from '@epam/uui-core';
import {
    ControlIcon,
    DataTableCellContainer,
    DataTableHeaderCell as UuiDataTableHeaderCell,
    HeaderCellContentProps,
} from '@epam/uui-components';
import { ColumnHeaderDropdown } from './ColumnHeaderDropdown';
import type { DataTableHeaderCellMods } from './types';
import { IconButton } from '../buttons';
import { Checkbox } from '../inputs';
import { Tooltip } from '../overlays';
import { Text } from '../typography';

import { i18n } from '../../i18n';
import { settings } from '../../settings';

import './variables.scss';
import css from './DataTableHeaderCell.module.scss';

interface DataTableHeaderCellState {
    isDropdownOpen: boolean;
}

export interface DataTableHeaderCellModsOverride {
}

export interface DataTableHeaderCellProps<TItem, TId> extends
    UuiCoreDataTableHeaderCellProps<TItem, TId>,
    Overwrite<DataTableHeaderCellMods, DataTableHeaderCellModsOverride> {}

export class DataTableHeaderCell<TItem, TId> extends React.Component<DataTableHeaderCellProps<TItem, TId>, DataTableHeaderCellState> {
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

    getColumnCaption = (props: HeaderCellContentProps, dropdownProps?: IDropdownTogglerProps) => {
        const renderTooltip = this.props.column.renderTooltip || this.getTooltipContent;
        const captionCx = cx([
            css.caption,
            this.props.textCase === 'upper' && css.upperCase,
            uuiDataTableHeaderCell.uuiTableHeaderCaption,
            'uui-typography-inline',
            this.props.size >= '48' && css.truncate,
        ]);

        const handleFilterOpen = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                dropdownProps.onClick(e);
                e.preventDefault();
            }
        };

        const handleSort = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                props.toggleSort(e);
                e.preventDefault();
            }
        };

        return (
            <div
                className={ cx(css.captionWrapper, css['align-' + this.props.column.textAlign], uuiDataTableHeaderCell.uuiTableHeaderCaptionWrapper) }
            >
                <Tooltip
                    placement="top"
                    color="inverted"
                    content={ renderTooltip(this.props.column) }
                    cx={ [css.cellTooltip, 'uui-dt-header-tooltip'] }
                    openDelay={ 600 }
                    closeOnMouseLeave="boundary"
                >
                    <div key="text" className={ captionCx }>
                        { this.props.column.caption }
                    </div>
                </Tooltip>
                { this.props.column.isSortable && (!this.props.column.renderFilter || this.props.sortDirection) && (
                    <ControlIcon
                        key="sort"
                        cx={ cx(css.icon, css.sortIcon, !this.props.sortDirection && css.sortInActive, uuiDataTableHeaderCell.uuiTableHeaderSortIcon) }
                        icon={ settings.dataTable.icons.header[this.props.sortDirection === 'desc' ? 'descSortIcon' : this.props.sortDirection === 'asc' ? 'ascSortIcon' : 'defaultSortIcon'] }
                        onKeyDown={ !this.props.column.renderFilter ? handleSort : undefined }
                    />
                ) }
                { this.props.isFilterActive && (
                    <IconButton
                        key="filter"
                        cx={ cx(css.icon, !this.props.sortDirection && css.filterIcon, uuiDataTableHeaderCell.uuiTableHeaderFilterIcon) }
                        color="neutral"
                        icon={ settings.dataTable.icons.header.filterIcon }
                    />
                ) }
                { this.props.column.renderFilter && (
                    <ControlIcon
                        key="dropdown"
                        cx={ cx(css.icon, css.dropdownIcon, uuiDataTableHeaderCell.uuiTableHeaderDropdownIcon) }
                        icon={ settings.dataTable.icons.header[this.state.isDropdownOpen ? 'openedDropdownIcon' : 'dropdownIcon'] }
                        onKeyDown={ handleFilterOpen }
                    />
                ) }
            </div>
        );
    };

    renderHeaderCheckbox = () => {
        if (this.props.selectAll && this.props.isFirstColumn) {
            return (
                <Checkbox
                    size={ settings.dataTable.sizes.body.checkboxMap[this.props.size] }
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
                    <ControlIcon
                        cx={ cx(css.icon, css.foldAllIcon, uuiDataTableHeaderCell.uuiTableHeaderFoldAllIcon) }
                        icon={ settings.dataTable.icons.header[this.props.areAllFolded ? 'unfoldIcon' : 'foldIcon'] }
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

        if (columnsGap) return isFirstColumn ? `${columnsGap}px` : `${+columnsGap / 2}px`;
        return `var(--uui-dt-header-cell-padding${isFirstColumn ? '-edge' : ''})`;
    };

    getRightPadding = () => {
        const { columnsGap, isLastColumn } = this.props;

        if (columnsGap) return isLastColumn ? `${columnsGap}px` : `${+columnsGap / 2}px`;
        return `var(--uui-dt-header-cell-padding${isLastColumn ? '-edge' : ''})`;
    };

    getResizingMarkerWidth = () => {
        const { columnsGap } = this.props;
        return columnsGap ? `${+columnsGap / 2}px` : 'var(--uui-resize-marker-width)';
    };

    renderCellContent = (props: HeaderCellContentProps, dropdownProps?: IDropdownTogglerProps) => {
        const isResizable = this.props.column.allowResizing ?? this.props.allowColumnsResizing;
        const onClickEvent = !props.isResizing && (!this.props.column.renderFilter ? props.toggleSort : dropdownProps?.onClick);

        const computeStyles = {
            '--uui-dt-header-cell-icon-size': `${settings.dataTable.sizes.header.iconMap[this.props.size || settings.dataTable.sizes.header.row]}px`,
            '--uui-dt-header-cell-padding-start': this.getLeftPadding(),
            '--uui-dt-header-cell-padding-end': this.getRightPadding(),
            '--uui-dt-header-cell-resizing-marker-width': this.getResizingMarkerWidth(),
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
                    `uui-size-${this.props.size || settings.dataTable.sizes.header.row}`,
                    this.props.isFirstColumn && 'uui-dt-header-first-column',
                    this.props.isLastColumn && 'uui-dt-header-last-column',
                    this.props.column.fix && css['pinned-' + this.props.column.fix],
                    isResizable && uuiMarkers.resizable,
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
                { this.getColumnCaption(props, dropdownProps) }
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
