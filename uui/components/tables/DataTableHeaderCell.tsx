import * as React from 'react';
import {
    DataTableHeaderCellProps, uuiMarkers, uuiDataTableHeaderCell, IDropdownTogglerProps, cx, DataColumnProps,
} from '@epam/uui-core';
import { DataTableHeaderCell as UuiDataTableHeaderCell, HeaderCellContentProps } from '@epam/uui-components';
import { ColumnHeaderDropdown } from './ColumnHeaderDropdown';
import { DataTableHeaderCellMods } from './types';
import { FlexCell } from '../layout';
import { IconButton } from '../buttons';
import { Checkbox } from '../inputs';
import { Tooltip } from '../overlays';
import { Text } from '../typography';
import css from './DataTableHeaderCell.module.scss';
import './variables.scss';
import { ReactComponent as DefaultSortIcon } from '@epam/assets/icons/common/table-swap-18.svg';
import { ReactComponent as SortIcon } from '@epam/assets/icons/common/table-sort_asc-18.svg';
import { ReactComponent as SortIconDesc } from '@epam/assets/icons/common/table-sort_desc-18.svg';
import { ReactComponent as FilterIcon } from '@epam/assets/icons/common/content-filtration-18.svg';
import { ReactComponent as DropdownIcon } from '@epam/assets/icons/common/navigation-chevron-down-18.svg';
import { ReactComponent as OpenedDropdownIcon } from '@epam/assets/icons/common/navigation-chevron-up-18.svg';
import { ReactComponent as FoldIcon } from '../../icons/foldAll/navigation-collapse_all-outline.svg';
import { ReactComponent as UnfoldIcon } from '../../icons/foldAll/navigation-expand_all-outline.svg';
import { i18n } from '../../i18n';

interface DataTableHeaderCellState {
    isDropdownOpen: boolean;
}

export class DataTableHeaderCell<TItem, TId> extends React.Component<DataTableHeaderCellProps<TItem, TId> & DataTableHeaderCellMods, DataTableHeaderCellState> {
    state: DataTableHeaderCellState = {
        isDropdownOpen: null,
    };

    getTextStyle = () => {
        if (this.props.textCase === 'upper') return css.upperCase;
        return css['font-size-14'];
    };

    getTooltipContent = (column: DataColumnProps<TItem, TId>) => (
        <div className={ css.cellTooltipWrapper }>
            <Text fontSize="14" fontWeight="600" cx={ css.cellTooltipText }>{ column.caption }</Text>
            { column.info && <Text fontSize="12" cx={ css.cellTooltipText }>{ column.info }</Text> }
        </div>
    );

    getColumnCaption = () => {
        const renderTooltip = this.props.column.renderTooltip || this.getTooltipContent;

        return (
            <div className={ css.tooltipWrapper }>
                <div className={ cx(css.iconCell, css['align-' + this.props.column.textAlign], uuiDataTableHeaderCell.uuiTableHeaderCaptionWrapper) }>
                    <Tooltip
                        placement="top"
                        color="inverted"
                        content={ renderTooltip(this.props.column) }
                        cx={ css.cellTooltip }
                        openDelay={ 600 }
                    >
                        <Text key="text" lineHeight="30" fontSize="14" size="30" cx={ cx(css.caption, this.getTextStyle(), uuiDataTableHeaderCell.uuiTableHeaderCaption) }>
                            {this.props.column.caption}
                        </Text>
                    </Tooltip>
                    {this.props.column.isSortable && (!this.props.column.renderFilter || this.props.sortDirection) && (
                        <IconButton
                            key="sort"
                            cx={ cx(css.icon, css.sortIcon, this.props.sortDirection && css.sortIconActive, uuiDataTableHeaderCell.uuiTableHeaderSortIcon) }
                            color={ this.props.sortDirection ? 'neutral' : 'secondary' }
                            icon={ this.props.sortDirection === 'desc' ? SortIconDesc : this.props.sortDirection === 'asc' ? SortIcon : DefaultSortIcon }
                        />
                    )}
                    {this.props.isFilterActive && (
                        <IconButton
                            key="filter"
                            cx={ cx(css.icon, !this.props.sortDirection && css.filterIcon, uuiDataTableHeaderCell.uuiTableHeaderFilterIcon) }
                            color="neutral"
                            icon={ FilterIcon }
                        />
                    )}
                    {this.props.column.renderFilter && (
                        <IconButton
                            key="dropdown"
                            cx={ cx(css.icon, css.dropdownIcon, uuiDataTableHeaderCell.uuiTableHeaderDropdownIcon) }
                            color="secondary"
                            icon={ this.state.isDropdownOpen ? OpenedDropdownIcon : DropdownIcon }
                        />
                    )}
                </div>
            </div>
        );
    };

    renderHeaderCheckbox = () => {
        if (this.props.selectAll && this.props.isFirstColumn) {
            return (
                <Checkbox size={ +this.props.size < 36 ? '12' : '18' } { ...this.props.selectAll } cx={ cx(css.checkbox, uuiDataTableHeaderCell.uuiTableHeaderCheckbox) } />
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
                    />
                </Tooltip>
            );
        }
    };

    renderResizeMark = (props: HeaderCellContentProps) => <div onMouseDown={ props.onResizeStart } className={ cx(css.resizeMark, uuiMarkers.draggable) } />;
    renderCellContent = (props: HeaderCellContentProps, dropdownProps?: IDropdownTogglerProps) => {
        const isResizable = this.props.column.allowResizing ?? this.props.allowColumnsResizing;
        return (
            <FlexCell
                { ...this.props.column }
                minWidth={ this.props.column.width }
                ref={ (ref) => {
                    (props.ref as React.RefCallback<HTMLElement>)(ref);
                    (dropdownProps?.ref as React.RefCallback<HTMLElement>)?.(ref);
                } }
                cx={ cx(
                    'uui-dt-vars',
                    uuiDataTableHeaderCell.uuiTableHeaderCell,
                    (this.props.column.isSortable || this.props.isDropdown) && uuiMarkers.clickable,
                    css.cell,
                    css['size-' + (this.props.size || '36')],
                    this.props.isFirstColumn && css['padding-left-24'],
                    this.props.isLastColumn && css['padding-right-24'],
                    this.props.column.cx,
                    isResizable && css.resizable,
                    props.isDraggable && css.draggable,
                    props.isDragGhost && css.ghost,
                    props.isDraggedOut && css.isDraggedOut,
                    props.isDndInProgress && css['dnd-marker-' + props.position],
                ) }
                onClick={ !this.props.column.renderFilter ? props.toggleSort : dropdownProps?.onClick }
                rawProps={ {
                    role: 'columnheader',
                    'aria-sort': this.props.sortDirection === 'asc' ? 'ascending' : this.props.sortDirection ? 'descending' : 'none',
                    ...props.eventHandlers,
                } }
            >
                { this.renderHeaderCheckbox() }
                { this.renderFoldAllIcon() }
                { this.getColumnCaption() }
                { isResizable && this.renderResizeMark(props) }
            </FlexCell>
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
        return <UuiDataTableHeaderCell { ...this.props } renderCellContent={ this.props.column.renderFilter ? this.renderCellWithFilter : this.renderCellContent } />;
    }
}
