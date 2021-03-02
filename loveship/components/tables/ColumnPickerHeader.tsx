import * as React from 'react';
import { SortDirection } from '@epam/uui';
import { LinkButton, FlexCell, FlexRow, FlexSpacer } from '../index';
import * as sortIcon from '../icons/sort_asc-12.svg';
import * as sortIconDesc from '../icons/sort_desc-12.svg';
import * as sortActive from '../icons/tick-24.svg';
import * as css from './ColumnPickerHeader.scss';
import { i18n } from "../../i18n";

interface PickerFilterHeaderProps {
    onSort(dir: SortDirection): void;
    sortDirection: SortDirection;
}

export class ColumnPickerHeader extends React.Component<PickerFilterHeaderProps> {
    render() {
        return <FlexCell cx={ css.sortingPanelContainer }>
            <FlexRow>
                <LinkButton size='24' fontSize='14' lineHeight='30' color='night600' caption={ i18n.pickerFilterHeader.sortAscending } icon={ sortIcon } font='sans' onClick={ () => this.props.onSort('asc') } cx={ css.filterSortButton } />
                <FlexSpacer/>
                { this.props.sortDirection === 'asc' && <LinkButton size='30' icon={ sortActive } color='sky' cx={ css.sortActive }/> }
            </FlexRow>
            <FlexRow>
                <LinkButton size='24' fontSize='14' lineHeight='30' color='night600' caption={ i18n.pickerFilterHeader.sortDescending } icon={ sortIconDesc } font='sans' onClick={ () => this.props.onSort('desc') } cx={ css.filterSortButton } />
                <FlexSpacer/>
                { this.props.sortDirection === 'desc' && <LinkButton size='30' icon={ sortActive } color='sky' cx={ css.sortActive }/> }
            </FlexRow>
        </FlexCell>;
    }
}
