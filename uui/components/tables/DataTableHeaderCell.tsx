import React, { useId, useState } from 'react';
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

export interface DataTableHeaderCellModsOverride {}

export interface DataTableHeaderCellProps<TItem, TId> extends
    UuiCoreDataTableHeaderCellProps<TItem, TId>,
    Overwrite<DataTableHeaderCellMods, DataTableHeaderCellModsOverride> {}

function DefaultTooltipContent<TItem, TId>(column: DataColumnProps<TItem, TId>) {
    return (
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
}

export function DataTableHeaderCell<TItem, TId>(props: DataTableHeaderCellProps<TItem, TId>) {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(null);
    const id = useId();

    const captionId = `uui-dt-header-caption-${id}-${props.column.key}`;

    const captionAriaProps = {
        'aria-labelledby': captionId,
        'aria-description': props.isFilterActive ? i18n.tables.columnHeader.filterActiveLabel : undefined,
    };

    const getColumnCaption = (contentProps: HeaderCellContentProps, dropdownProps?: IDropdownTogglerProps) => {
        const renderTooltip = props.column.renderTooltip || DefaultTooltipContent;
        const captionCx = cx([
            css.caption,
            props.textCase === 'upper' && css.upperCase,
            uuiDataTableHeaderCell.uuiTableHeaderCaption,
            'uui-typography-inline',
            props.size >= '48' && css.truncate,
        ]);

        const handleFilterOpen = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                dropdownProps.onClick(e);
                e.preventDefault();
            }
        };

        const handleSort = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                contentProps.toggleSort(e);
                e.preventDefault();
            }
        };

        return (
            <div
                className={ cx(css.captionWrapper, css['align-' + props.column.textAlign], uuiDataTableHeaderCell.uuiTableHeaderCaptionWrapper) }
            >
                <Tooltip
                    placement="top"
                    color="inverted"
                    content={ renderTooltip(props.column) }
                    cx={ [css.cellTooltip, 'uui-dt-header-tooltip'] }
                    openDelay={ 600 }
                    closeOnMouseLeave="boundary"
                >
                    <div key="text" id={ captionId } className={ captionCx }>
                        { props.column.caption }
                    </div>
                </Tooltip>
                { props.column.isSortable && (!props.column.renderFilter || props.sortDirection) && (
                    <ControlIcon
                        key="sort"
                        cx={ cx(css.icon, css.sortIcon, !props.sortDirection && css.sortInActive, uuiDataTableHeaderCell.uuiTableHeaderSortIcon) }
                        icon={ settings.dataTable.icons.header[props.sortDirection === 'desc' ? 'descSortIcon' : props.sortDirection === 'asc' ? 'ascSortIcon' : 'defaultSortIcon'] }
                        onKeyDown={ !props.column.renderFilter ? handleSort : undefined }
                        rawProps={ { ...captionAriaProps, 'aria-hidden': !!props.column.renderFilter } }
                    />
                ) }
                { props.isFilterActive && (
                    <IconButton
                        key="filter"
                        cx={ cx(css.icon, !props.sortDirection && css.filterIcon, uuiDataTableHeaderCell.uuiTableHeaderFilterIcon) }
                        color="neutral"
                        icon={ settings.dataTable.icons.header.filterIcon }
                        rawProps={ { 'aria-hidden': true } }
                    />
                ) }
                { props.column.renderFilter && (
                    <ControlIcon
                        key="dropdown"
                        cx={ cx(css.icon, css.dropdownIcon, uuiDataTableHeaderCell.uuiTableHeaderDropdownIcon) }
                        icon={ settings.dataTable.icons.header[isDropdownOpen ? 'openedDropdownIcon' : 'dropdownIcon'] }
                        onKeyDown={ handleFilterOpen }
                        rawProps={ captionAriaProps }
                    />
                ) }
            </div>
        );
    };

    const renderHeaderCheckbox = () => {
        if (props.selectAll && props.isFirstColumn) {
            return (
                <Checkbox
                    size={ settings.dataTable.sizes.body.checkboxMap[props.size] }
                    rawProps={ { 'aria-label': 'Select All' } }
                    { ...props.selectAll }
                    cx={ cx(css.checkbox, uuiDataTableHeaderCell.uuiTableHeaderCheckbox) }
                />
            );
        }
    };

    const renderFoldAllIcon = () => {
        if (props.isFirstColumn && props.showFoldAll) {
            return (
                <Tooltip content={
                    props.areAllFolded
                        ? i18n.tables.columnHeader.expandAllTooltip
                        : i18n.tables.columnHeader.collapseAllTooltip
                }
                >
                    <ControlIcon
                        cx={ cx(css.icon, css.foldAllIcon, uuiDataTableHeaderCell.uuiTableHeaderFoldAllIcon) }
                        icon={ settings.dataTable.icons.header[props.areAllFolded ? 'unfoldIcon' : 'foldIcon'] }
                        onClick={ props.onFoldAll }
                        rawProps={ {
                            'aria-label': props.areAllFolded ? 'Expand All' : 'Collapse All',
                            'aria-expanded': !!props.areAllFolded,
                        } }
                    />
                </Tooltip>
            );
        }
    };

    const renderResizingMarker = (contentProps: HeaderCellContentProps) => {
        return (
            <div
                role="separator"
                onMouseDown={ contentProps.onResizeStart }
                className={ cx(css.resizingMarker, uuiMarkers.draggable, uuiMarkers.clickable) }
            />
        );
    };

    const getLeftPadding = () => {
        const { columnsGap, isFirstColumn } = props;

        if (columnsGap) return isFirstColumn ? `${columnsGap}px` : `${+columnsGap / 2}px`;
        return `var(--uui-dt-header-cell-padding${isFirstColumn ? '-edge' : ''})`;
    };

    const getRightPadding = () => {
        const { columnsGap, isLastColumn } = props;

        if (columnsGap) return isLastColumn ? `${columnsGap}px` : `${+columnsGap / 2}px`;
        return `var(--uui-dt-header-cell-padding${isLastColumn ? '-edge' : ''})`;
    };

    const getResizingMarkerWidth = () => {
        const { columnsGap } = props;
        return columnsGap ? `${+columnsGap / 2}px` : 'var(--uui-resize-marker-width)';
    };

    const renderCellContent = (contentProps: HeaderCellContentProps, dropdownProps?: IDropdownTogglerProps) => {
        const isResizable = props.column.allowResizing ?? props.allowColumnsResizing;
        const onClickEvent = !contentProps.isResizing && (!props.column.renderFilter ? contentProps.toggleSort : dropdownProps?.onClick);

        const computeStyles = {
            '--uui-dt-header-cell-icon-size': `${settings.dataTable.sizes.header.iconMap[props.size || settings.dataTable.sizes.header.row]}px`,
            '--uui-dt-header-cell-padding-start': getLeftPadding(),
            '--uui-dt-header-cell-padding-end': getRightPadding(),
            '--uui-dt-header-cell-resizing-marker-width': getResizingMarkerWidth(),
        } as React.CSSProperties;

        return (
            <DataTableCellContainer
                column={ props.column }
                ref={ (ref) => {
                    (contentProps.ref as React.RefCallback<HTMLElement>)(ref);
                    (dropdownProps?.ref as React.RefCallback<HTMLElement>)?.(ref);
                } }
                cx={ cx(
                    uuiDataTableHeaderCell.uuiTableHeaderCell,
                    (props.column.isSortable || props.isDropdown) && uuiMarkers.clickable,
                    css.root,
                    `uui-size-${props.size || settings.dataTable.sizes.header.row}`,
                    props.isFirstColumn && 'uui-dt-header-first-column',
                    props.isLastColumn && 'uui-dt-header-last-column',
                    props.column.fix && css['pinned-' + props.column.fix],
                    isResizable && uuiMarkers.resizable,
                    contentProps.isDraggable && css.draggable,
                    contentProps.isDragGhost && css.ghost,
                    contentProps.isDraggedOut && css.isDraggedOut,
                    contentProps.isDndInProgress && css['dnd-marker-' + contentProps.position],
                ) }
                onClick={ onClickEvent }
                rawProps={ {
                    role: 'columnheader',
                    'aria-sort': props.sortDirection === 'asc' ? 'ascending' : props.sortDirection ? 'descending' : 'none',
                    ...contentProps.eventHandlers,
                } }
                style={ computeStyles }
            >
                { renderHeaderCheckbox() }
                { renderFoldAllIcon() }
                { getColumnCaption(contentProps, dropdownProps) }
                { isResizable && renderResizingMarker(contentProps) }
            </DataTableCellContainer>
        );
    };

    const renderCellWithFilter = (contentProps: HeaderCellContentProps) => (
        <ColumnHeaderDropdown
            isOpen={ isDropdownOpen }
            isSortable={ props.column.isSortable }
            renderTarget={ (dropdownProps) => renderCellContent(contentProps, dropdownProps) }
            renderFilter={ props.renderFilter }
            onSort={ props.onSort }
            sortDirection={ props.sortDirection }
            onOpenChange={ setIsDropdownOpen }
            title={ props.column.caption as string }
        />
    );

    if (props.column.renderHeaderCell) {
        return props.column.renderHeaderCell(props);
    }

    return (
        <UuiDataTableHeaderCell
            { ...props }
            renderCellContent={ props.column.renderFilter ? renderCellWithFilter : renderCellContent }
        />
    );
}
