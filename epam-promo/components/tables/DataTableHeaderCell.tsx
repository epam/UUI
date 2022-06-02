import * as React from 'react';
import { DataTableHeaderCellProps, uuiMarkers, uuiDataTableHeaderCell, IDropdownToggler, cx } from '@epam/uui-core';
import { DataTableHeaderCell as UuiDataTableHeaderCell, HeaderCellContentProps } from '@epam/uui-components';
import { ColumnHeaderDropdown, DataTableHeaderCellMods } from './';
import { FlexCell, Checkbox, Text, IconButton, Tooltip } from '../';
import * as css from './DataTableHeaderCell.scss';
import { ReactComponent as DefaultSortIcon } from '@epam/assets/icons/common/table-swap-18.svg';
import { ReactComponent as SortIcon } from '@epam/assets/icons/common/table-sort_asc-18.svg';
import { ReactComponent as SortIconDesc } from '@epam/assets/icons/common/table-sort_desc-18.svg';
import { ReactComponent as FilterIcon } from '@epam/assets/icons/common/content-filtration-18.svg';
import { ReactComponent as DropdownIcon } from '@epam/assets/icons/common/navigation-chevron-down-18.svg';
import { ReactComponent as OpenedDropdownIcon } from '@epam/assets/icons/common/navigation-chevron-up-18.svg';

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
    }

    getColumnCaption = () => (
        <div className={ css.tooltipWrapper }>
            <Tooltip
                trigger="hover"
                placement="bottom-start"
                renderContent={ (!this.state.isDropdownOpen && this.props.column.info) ? () => this.props.column.info : null }
                color="white"
                cx={ css.cellTooltip }
                offset={ [-12, 12] }
            >
                <div className={ cx(css.iconCell, css['align-' + this.props.column.textAlign], uuiDataTableHeaderCell.uuiTableHeaderCaptionWrapper) }>
                    <Text
                        key="text"
                        lineHeight="30"
                        fontSize="14"
                        size="30"
                        cx={ cx(css.caption, this.getTextStyle(), uuiDataTableHeaderCell.uuiTableHeaderCaption) }
                    >
                        { this.props.column.caption }
                    </Text>
                    { this.props.column.info && (
                        <div>
                            <Text key="tooltip-marker" lineHeight="30" fontSize="14" size="30">*</Text>
                        </div>
                    ) }
                    { this.props.column.isSortable && (!this.props.column.renderFilter || this.props.sortDirection) && (
                        <IconButton
                            key="sort"
                            cx={ cx(css.icon, css.sortIcon, this.props.sortDirection && css.sortIconActive, uuiDataTableHeaderCell.uuiTableHeaderSortIcon) }
                            color="gray50"
                            icon={ this.props.sortDirection === 'desc' ? SortIconDesc : this.props.sortDirection === 'asc' ? SortIcon : DefaultSortIcon }
                        />
                    ) }
                    { this.props.isFilterActive && (
                        <IconButton
                            key="filter"
                            cx={ cx(css.icon, !this.props.sortDirection && css.filterIcon, uuiDataTableHeaderCell.uuiTableHeaderFilterIcon) }
                            color="gray60" icon={ FilterIcon }
                        />
                    ) }
                    { this.props.column.renderFilter && (
                        <IconButton
                            key="dropdown"
                            cx={ cx(css.icon, css.dropdownIcon, uuiDataTableHeaderCell.uuiTableHeaderDropdownIcon) }
                            color="gray50"
                            icon={ this.state.isDropdownOpen ? OpenedDropdownIcon : DropdownIcon }
                        />
                    ) }
                </div>
            </Tooltip>
        </div>
    )

    renderHeaderCheckbox = () => this.props.selectAll && this.props.isFirstColumn && (
        <Checkbox
            size={ +this.props.size < 36 ? '12' : '18' }
            { ...this.props.selectAll }
            cx={ cx(css.checkbox, uuiDataTableHeaderCell.uuiTableHeaderCheckbox) }
        />
    )

    renderResizeMark = (props: HeaderCellContentProps) => (
        <div onMouseDown={ props.onResizeStart } className={ cx(css.resizeMark, uuiMarkers.draggable) } />
    )

    renderCellContent = (props: HeaderCellContentProps, dropdownProps?: IDropdownToggler) => (
        <FlexCell
            { ...this.props.column }
            minWidth={ this.props.column.width || this.props.column.minWidth }
            ref={ ref => {
                (props.ref as React.RefCallback<HTMLElement>)(ref);
                (dropdownProps?.ref as React.RefCallback<HTMLElement>)?.(ref);
            } }
            cx={ cx(
                uuiDataTableHeaderCell.uuiTableHeaderCell,
                (this.props.column.isSortable || this.props.isDropdown) && uuiMarkers.clickable,
                css.cell, css['size-' + (this.props.size || '36')],
                this.props.isFirstColumn && css[`padding-left-24`],
                this.props.isLastColumn && css['padding-right-24'],
                this.props.column.cx,
                this.props.allowColumnsResizing && css.resizable,
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
            { this.getColumnCaption() }
            { this.props.allowColumnsResizing && this.renderResizeMark(props) }
        </FlexCell>
    )

    renderCellWithFilter = (props: HeaderCellContentProps) => (
        <ColumnHeaderDropdown
            isOpen={ this.state.isDropdownOpen }
            isSortable={ this.props.column.isSortable }
            renderTarget={ dropdownProps => this.renderCellContent(props, dropdownProps) }
            renderFilter={ this.props.renderFilter }
            onSort={ this.props.onSort }
            sortDirection={ this.props.sortDirection }
            onOpenChange={ isDropdownOpen => this.setState({ isDropdownOpen }) }
            title={ this.props.column.caption as string }
        />
    )

    render() {
        return (
            <UuiDataTableHeaderCell
                { ...this.props }
                renderCellContent={ this.props.column.renderFilter
                    ? this.renderCellWithFilter
                    : this.renderCellContent }
            />
        );
    }
}
