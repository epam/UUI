import * as React from 'react';
import { DataTableHeaderCellProps, uuiMarkers, uuiDataTableHeaderCell, IDropdownToggler, cx } from '@epam/uui';
import { DataTableHeaderCell as UuiDataTableHeaderCell, HeaderCellContentProps } from '@epam/uui-components';
import { ColumnHeaderDropdown, DataTableHeaderCellMods } from './';
import { FlexCell, Checkbox, Text, IconButton, Tooltip } from '../';
import * as css from './DataTableHeaderCell.scss';
import * as defaultSortIcon from '@epam/assets/icons/common/table-swap-18.svg';
import * as sortIcon from '@epam/assets/icons/common/table-sort_asc-18.svg';
import * as sortIconDesc from '@epam/assets/icons/common/table-sort_desc-18.svg';
import * as filterIcon from '@epam/assets/icons/common/content-filtration-18.svg';
import * as dropdownIcon from '@epam/assets/icons/common/navigation-chevron-down-18.svg';
import * as openedDropdownIcon from '@epam/assets/icons/common/navigation-chevron-up-18.svg';

interface DataTableHeaderCellState {
    isDropdownOpen: boolean;
}

export class DataTableHeaderCell<TItem, TId> extends React.Component<DataTableHeaderCellProps<TItem, TId> & DataTableHeaderCellMods, DataTableHeaderCellState> {
    state: DataTableHeaderCellState = {
        isDropdownOpen: null,
    };

    getTextStyle = () => {
        if (this.props.textCase === 'upper') {
            return css.upperCase;
        } else {
            return css['font-size-14'];
        }
    }

    getColumnCaption = () => {
        const captionContent = (
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
                        icon={ this.props.sortDirection === 'desc' ? sortIconDesc : this.props.sortDirection === 'asc' ? sortIcon : defaultSortIcon }
                    />
                ) }
                { this.props.isFilterActive && (
                    <IconButton
                        key="filter"
                        cx={ cx(css.icon, !this.props.sortDirection && css.filterIcon, uuiDataTableHeaderCell.uuiTableHeaderFilterIcon) }
                        color="gray60" icon={ filterIcon }
                    />
                ) }
                { this.props.column.renderFilter && (
                    <IconButton
                        key="dropdown"
                        cx={ cx(css.icon, css.dropdownIcon, uuiDataTableHeaderCell.uuiTableHeaderDropdownIcon) }
                        color="gray50"
                        icon={ this.state.isDropdownOpen ? openedDropdownIcon : dropdownIcon }
                    />
                ) }
            </div>
        );

        return <div className={ css.tooltipWrapper }>
            <Tooltip
                trigger="hover"
                placement="bottom-start"
                renderContent={ (!this.state.isDropdownOpen && this.props.column.info) ? () => this.props.column.info : null }
                color="white"
                cx={ css.cellTooltip }
                offset={ [-12, 12] }
            >
                { captionContent }
            </Tooltip>
        </div>;
    }

    renderHeaderCheckbox = () => this.props.selectAll && this.props.isFirstColumn && (
        <Checkbox
            size="18"
            { ...this.props.selectAll }
            cx={ cx(css.checkbox, uuiDataTableHeaderCell.uuiTableHeaderCheckbox) }
        />
    );

    renderResizeMark = (props: HeaderCellContentProps) => (
        <div onMouseDown={ props.onResizeStart } className={ css.resizeMark } />
    );

    renderCellContent = (props: HeaderCellContentProps, dropdownProps?: React.PropsWithRef<IDropdownToggler>) => (
        <FlexCell
            { ...this.props.column }
            ref={ props.ref }
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
    );

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
    );

    render() {
        return (
            <UuiDataTableHeaderCell
                { ...this.props }
                renderCellContent={ this.props.column.renderFilter ? this.renderCellWithFilter : this.renderCellContent }
            />
        );
    }
}
