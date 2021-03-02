import * as React from 'react';
import { IDropdownToggler, SortDirection } from '@epam/uui';
import { Dropdown, DropdownBodyProps } from '@epam/uui-components';
import { FlexCell, FlexRow, IconButton, Panel, Text } from '../';
import * as sortIcon from '@epam/assets/icons/common/table-sort_asc-18.svg';
import * as sortIconDesc from '@epam/assets/icons/common/table-sort_desc-18.svg';
import * as css from './ColumnHeaderDropdown.scss';
import { i18n } from "../../i18n";
import { Ref } from 'react';

interface ColumnHeaderDropdownProps {
    isOpen: boolean;
    isSortable: boolean;
    renderTarget: (props: IDropdownToggler & {ref?: Ref<any>}) => React.ReactNode;
    renderFilter?: () => React.ReactNode;
    onOpenChange(nV: boolean): void;
    onSort(dir: SortDirection): void;
    sortDirection: SortDirection;
}

export class ColumnHeaderDropdown extends React.Component<ColumnHeaderDropdownProps> {
    renderSortingPanel = () => {
        return (
            <FlexCell cx={ css.sortingPanelContainer }>
                <FlexRow cx={ css.filterSortButton } spacing='6' onClick={ () => this.props.onSort('asc') }>
                    {
                        this.props.sortDirection === 'asc'
                        ? <>
                            <IconButton color='blue' icon={ sortIcon }/>
                            <Text cx={ css.activeText } color='gray80' fontSize='14' size='24'>{ i18n.pickerFilterHeader.sortAscending }</Text>
                        </>
                        : <>
                            <IconButton color='gray60' icon={ sortIcon }/>
                            <Text cx={ css.sortText } color='gray80' fontSize='14' size='24'>{ i18n.pickerFilterHeader.sortAscending }</Text>
                        </>
                    }
                </FlexRow>
                <FlexRow cx={ css.filterSortButton } spacing='6' onClick={ () => this.props.onSort('desc') }>
                    {
                        this.props.sortDirection === 'desc'
                        ? <>
                            <IconButton color='blue' icon={ sortIconDesc }/>
                            <Text cx={ css.activeText } color='gray80' fontSize='14' size='24'>{ i18n.pickerFilterHeader.sortDescending }</Text>
                        </>
                        : <>
                            <IconButton color='gray60' icon={ sortIconDesc }/>
                            <Text cx={ css.sortText } color='gray80' fontSize='14' size='24'>{ i18n.pickerFilterHeader.sortDescending }</Text>
                        </>
                    }
                </FlexRow>
            </FlexCell>
        );
    }

    render() {
        return <Dropdown
            renderTarget={ this.props.renderTarget }
            renderBody={ (props: DropdownBodyProps) => (
                <Panel background='white' style={ { width: 350 } } shadow>
                    { this.props.isSortable && this.renderSortingPanel() }
                    { this.props.renderFilter() }
                </Panel>
            ) }
            modifiers={ { offset: { offset: '-12, 0' } } }
            value={ this.props.isOpen }
            onValueChange={ this.props.onOpenChange }
        />;
    }
}
