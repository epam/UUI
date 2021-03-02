import React from 'react';
import cx from 'classnames';
import { DataTableHeaderCellProps, uuiMarkers } from '@epam/uui';
import { Dropdown, DropdownBodyProps, DataTableHeaderCell as UuiDataTableHeaderCell, HeaderCellContentProps } from '@epam/uui-components';
import { FlexCell, Checkbox, LinkButton, Text, Tooltip, Panel, DropMarker } from '../';
import { ColumnPickerHeader, DataTableHeaderCellMods } from './';
import * as css from './DataTableHeaderCell.scss';
import * as defaultSortIcon from './../icons/sort.svg';
import * as sortIcon from './../icons/sort_asc-12.svg';
import * as sortIconDesc from './../icons/sort_desc-12.svg';
import * as filterIcon from './../icons/filter.svg';
import * as dropdownIcon from './../icons/chevron-down-24.svg';
import * as openedDropdownIcon from './../icons/chevron-up-24.svg';

interface DataTableHeaderCellState {
    isDropdownOpen: boolean;
}

export class DataTableHeaderCell extends React.Component<DataTableHeaderCellProps<any, any> & DataTableHeaderCellMods, DataTableHeaderCellState> {
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

    getColumnCaption = (props?: any) => {
        let captionContent = <div className={ cx(css.iconCell, css['align-' + this.props.column.textAlign]) }>
            <Text
                key='text'
                cx={ cx(css.caption, css.overflowedCell, this.getTextStyle()) }
            >
                { this.props.column.caption }
            </Text>
            { this.props.column.info && <div><Text key='tooltip-marker'>*</Text></div> }
            { this.props.isFilterActive && <LinkButton key='filter' cx={ css.icon } size='30' color='night600' icon={ filterIcon } /> }
            { this.props.column.isSortable && (!this.props.column.renderFilter || this.props.sortDirection) && <LinkButton
                key='sort'
                cx={ cx(css.icon, css.sortIcon, this.props.sortDirection && css.sortIconActive) }
                size='24'
                color='night400'
                icon={ this.props.sortDirection === 'desc' ? sortIconDesc : this.props.sortDirection === 'asc' ? sortIcon : defaultSortIcon }
            /> }
            { this.props.column.renderFilter && <LinkButton key='dropdown' cx={ cx(css.icon, css.dropdownIcon) } size='30' color='night600' icon={ this.state.isDropdownOpen ? openedDropdownIcon : dropdownIcon } /> }
        </div>;

        return <div ref={ props && props.ref } onClick={ props && props.onClick || null } className={ css.tooltipWrapper }>
            <Tooltip
                trigger="hover"
                placement='bottom-start'
                renderContent={ (!this.state.isDropdownOpen && this.props.column.info) ? () => this.props.column.info : null }
                color='white'
                cx={ css.cellTooltip }
                offset={ '-12, 12' }
            >
                { captionContent }
            </Tooltip>
        </div>;
    }

    renderHeaderCheckbox = () => {
        return this.props.selectAll && this.props.isFirstColumn && <Checkbox size={ +this.props.size < 36 ? '12' : '18' } { ...this.props.selectAll } cx={ css.checkbox }/>;
    }

    renderColumnCaption() {
        if (this.props.column.renderFilter) {
            return <Dropdown
                renderTarget={ (props) => this.getColumnCaption(props) }
                renderBody={ (props: DropdownBodyProps) => (
                    <Panel background='white' style={ { width: 350 } } shadow>
                        { this.props.column.isSortable && <ColumnPickerHeader onSort={ this.props.onSort } sortDirection={ this.props.sortDirection }/> }
                        { this.props.renderFilter() }
                    </Panel>
                ) }
                modifiers={ { offset: { offset: '-12, 0' } } }
                value={ this.state.isDropdownOpen }
                onValueChange={ (isDropdownOpen) => this.setState({ isDropdownOpen }) }
            />;
        } else {
            return this.getColumnCaption();
        }
    }


    renderResizeMark(props: HeaderCellContentProps) {
        return (
            <div onMouseDown={ props.onResizeStart } className={ css.resizeMark } />
        );
    }

    renderCellContent = (props: HeaderCellContentProps) => {
        return (
            <FlexCell
                cx={ [
                    (this.props.column.isSortable || this.props.isDropdown) && uuiMarkers.clickable,
                    css.cell, css['size-' + (this.props.size || '36')],
                    this.props.isFirstColumn && css[`padding-left-${this.props.size === '30' ? 18 : 24}`],
                    this.props.isLastColumn && css['padding-right-24'],
                    this.props.cx,
                ] }
                onClick={ !this.props.column.renderFilter && props.toggleSort }
                { ...this.props.column }
                rawProps={ props.eventHandlers }
            >
                { this.renderHeaderCheckbox() }
                { this.renderColumnCaption() }
                { this.renderResizeMark(props) }
                <DropMarker { ...props } />
            </FlexCell >
        );
    }

    render() {
        return (
            <UuiDataTableHeaderCell
                { ...this.props }
                renderCellContent={ this.renderCellContent }
            />
        );
    }
}
