import * as React from 'react';
import { DataTableHeaderCellProps, uuiMarkers, uuiDataTableHeaderCell, IDropdownToggler, cx } from '@epam/uui-core';
import { DataTableHeaderCell as UuiDataTableHeaderCell, HeaderCellContentProps } from '@epam/uui-components';
import { ColumnHeaderDropdown, DataTableHeaderCellMods } from './';
import { FlexCell, Checkbox, Text, IconButton, Tooltip } from '../';
import css from './DataTableHeaderCell.module.scss';
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
    };

    getTooltipContent = () => !this.state.isDropdownOpen && (
        <div className={ css.cellTooltipWrapper }>
            <Text fontSize="14" color="contrast" font="semibold" cx={ css.cellTooltipText }>{ this.props.column.caption }</Text>
            { this.props.column.info && <Text fontSize="12" color="contrast" cx={ css.cellTooltipText }>{ this.props.column.info }</Text> }
        </div>
    );

    getColumnCaption = () => {
        return (
            <div className={ css.tooltipWrapper }>
                <div className={ cx(css.iconCell, css['align-' + this.props.column.textAlign], uuiDataTableHeaderCell.uuiTableHeaderCaptionWrapper) }>
                    <Tooltip
                        placement="top"
                        color="contrast"
                        renderContent={ this.getTooltipContent }
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
                            color={ this.props.sortDirection ? 'default' : 'secondary' }
                            icon={ this.props.sortDirection === 'desc' ? SortIconDesc : this.props.sortDirection === 'asc' ? SortIcon : DefaultSortIcon }
                        />
                    )}
                    {this.props.isFilterActive && (
                        <IconButton
                            key="filter"
                            cx={ cx(css.icon, !this.props.sortDirection && css.filterIcon, uuiDataTableHeaderCell.uuiTableHeaderFilterIcon) }
                            color="default"
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

    renderHeaderCheckbox = () =>
        this.props.selectAll
        && this.props.isFirstColumn && (
            <Checkbox size={ +this.props.size < 36 ? '12' : '18' } { ...this.props.selectAll } cx={ cx(css.checkbox, uuiDataTableHeaderCell.uuiTableHeaderCheckbox) } />
        );

    renderResizeMark = (props: HeaderCellContentProps) => <div onMouseDown={ props.onResizeStart } className={ cx(css.resizeMark, uuiMarkers.draggable) } />;
    renderCellContent = (props: HeaderCellContentProps, dropdownProps?: IDropdownToggler) => (
        <FlexCell
            { ...this.props.column }
            minWidth={ this.props.column.width }
            ref={ (ref) => {
                (props.ref as React.RefCallback<HTMLElement>)(ref);
                (dropdownProps?.ref as React.RefCallback<HTMLElement>)?.(ref);
            } }
            cx={ cx(
                uuiDataTableHeaderCell.uuiTableHeaderCell,
                (this.props.column.isSortable || this.props.isDropdown) && uuiMarkers.clickable,
                css.cell,
                css['size-' + (this.props.size || '36')],
                this.props.isFirstColumn && css['padding-left-24'],
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
            {this.renderHeaderCheckbox()}
            {this.getColumnCaption()}
            {this.props.allowColumnsResizing && this.renderResizeMark(props)}
        </FlexCell>
    );

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
