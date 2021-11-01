import React from 'react';
import css from './DataTableHeaderCell.scss';
import { Modifier } from "react-popper";
import { DataTableHeaderCellProps, IDropdownToggler, mobilePopperModifier, uuiMarkers, cx } from '@epam/uui';
import { DataTableHeaderCell as UuiDataTableHeaderCell, HeaderCellContentProps } from '@epam/uui-components';
import { LinkButton } from '../buttons';
import { Checkbox } from '../inputs';
import { FlexCell } from '../layout';
import { Text } from '../typography';
import { Tooltip } from '../overlays';
import { DataTableHeaderCellMods } from './types';
import defaultSortIcon from './../icons/sort.svg';
import sortIcon from './../icons/sort_asc-12.svg';
import sortIconDesc from './../icons/sort_desc-12.svg';
import filterIcon from './../icons/filter.svg';
import dropdownIcon from './../icons/chevron-down-24.svg';
import openedDropdownIcon from './../icons/chevron-up-24.svg';
import { ColumnHeaderDropdown } from "./ColumnHeaderDropdown";

interface DataTableHeaderCellState {
    isDropdownOpen: boolean;
}

export class DataTableHeaderCell extends React.Component<DataTableHeaderCellProps<any, any> & DataTableHeaderCellMods, DataTableHeaderCellState> {
    private readonly popperModifiers: Modifier<any>[] = [
        {
            name: 'offset',
            options: { offset: [0, 1] },
        },
        mobilePopperModifier,
    ];

    state: DataTableHeaderCellState = {
        isDropdownOpen: null,
    };

    getTextStyle = () => {
        if (this.props.textCase === 'upper') {
            return css.upperCase;
        } else {
            if (this.props.size === '30') {
                return css['font-size-13'];
            } else {
                return css['font-size-14'];
            }
        }
    }

    getColumnCaption = () => {
        let captionContent = (
            <div className={ cx(css.iconCell, this.props.column.textAlign && css['align-' + this.props.column.textAlign]) }>
                <Text
                    key="text"
                    cx={ cx(css.caption, this.getTextStyle()) }
                >
                    { this.props.column.caption }
                </Text>
                { this.props.column.info && <div><Text key="tooltip-marker">*</Text></div> }
                { this.props.isFilterActive &&
                <LinkButton key="filter" cx={ css.icon } size="30" color="night600" icon={ filterIcon }/> }
                { this.props.column.isSortable && (!this.props.column.renderFilter || this.props.sortDirection) &&
                <LinkButton
                    key="sort"
                    cx={ cx(css.icon, css.sortIcon, this.props.sortDirection && css.sortIconActive) }
                    size="24"
                    color="night400"
                    icon={ this.props.sortDirection === 'desc' ? sortIconDesc : this.props.sortDirection === 'asc' ? sortIcon : defaultSortIcon }
                /> }
                { this.props.column.renderFilter && (
                    <LinkButton
                        key="dropdown"
                        cx={ cx(css.icon, css.dropdownIcon) }
                        size="30"
                        color="night600"
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

    renderHeaderCheckbox = () => {
        return this.props.selectAll && this.props.isFirstColumn &&
            <Checkbox size={ +this.props.size < 36 ? '12' : '18' } { ...this.props.selectAll } cx={ css.checkbox }/>;
    }

    renderResizeMark(props: HeaderCellContentProps) {
        return (
            <div onMouseDown={ props.onResizeStart } className={ css.resizeMark }/>
        );
    }

    renderCellContent = (props: HeaderCellContentProps, dropdownProps?: IDropdownToggler) => {
        return (
            <FlexCell
                { ...this.props.column }
                ref={ (node) => { props.ref.current = node; } }
                cx={ [
                    (this.props.column.isSortable || this.props.isDropdown) && uuiMarkers.clickable,
                    css.cell, css['size-' + (this.props.size || '36')],
                    this.props.isFirstColumn && css[`padding-left-${ this.props.size === '30' ? 18 : 24 }`],
                    this.props.isLastColumn && css['padding-right-24'],
                    this.props.allowColumnsResizing && css.resizable,
                    props.isDraggable && css.draggable,
                    props.isDragGhost && css.ghost,
                    props.isDraggedOut && css.isDraggedOut,
                    props.isDndInProgress && css['dnd-marker-' + props.position],
                    this.props.cx,
                ] }
                onClick={ !this.props.column.renderFilter ? props.toggleSort : (dropdownProps && dropdownProps.onClick) }
                rawProps={ {
                    role: 'columnheader',
                    'aria-sort': this.props.sortDirection === 'asc' ? 'ascending' : this.props.sortDirection ? 'descending' : 'none',
                    ...props.eventHandlers
                } }
            >
                { this.renderHeaderCheckbox() }
                { this.getColumnCaption() }
                { this.props.allowColumnsResizing && this.renderResizeMark(props) }
            </FlexCell>
        );
    }

    renderCellWithFilter = (props: HeaderCellContentProps) => {
        return (
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
    }

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
