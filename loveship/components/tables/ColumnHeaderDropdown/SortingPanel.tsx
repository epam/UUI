import React, { useCallback } from 'react';
import css from './SortingPanel.scss';
import { SortDirection } from '@epam/uui';
import sortIcon from '../../icons/sort_asc-12.svg';
import sortIconDesc from '../../icons/sort_desc-12.svg';
import sortActive from '../../icons/tick-24.svg';
import { i18n } from "../../../i18n";
import { LinkButton } from '../../buttons';
import { FlexCell, FlexRow, FlexSpacer } from "../../layout";

export interface SortingPanelProps {
    onSort(dir: SortDirection): void;
    sortDirection: SortDirection;
}

const SortingPanelImpl: React.FC<SortingPanelProps> = props => {
    const sortAsc = useCallback(() => props.onSort('asc'), [props.onSort]);
    const sortDesc = useCallback(() => props.onSort('desc'), [props.onSort]);
    
    return (
        <FlexCell cx={ css.sortingPanelContainer }>
            <FlexRow>
                <LinkButton
                    size="24"
                    fontSize="14"
                    lineHeight="30"
                    color="night600"
                    caption={ i18n.pickerFilterHeader.sortAscending }
                    icon={ sortIcon }
                    font="sans"
                    onClick={ sortAsc }
                    cx={ css.filterSortButton }
                />

                <FlexSpacer/>

                { props.sortDirection === 'asc' && (
                    <LinkButton size="30" icon={ sortActive } color="sky" cx={ css.sortActive }/>
                ) }
            </FlexRow>

            <FlexRow>
                <LinkButton
                    size="24"
                    fontSize="14"
                    lineHeight="30"
                    color="night600"
                    caption={ i18n.pickerFilterHeader.sortDescending }
                    icon={ sortIconDesc }
                    font="sans"
                    onClick={ sortDesc }
                    cx={ css.filterSortButton }
                />

                <FlexSpacer/>

                { props.sortDirection === 'desc' && (
                    <LinkButton size="30" icon={ sortActive } color="sky" cx={ css.sortActive }/>
                ) }
            </FlexRow>
        </FlexCell>
    );
};

export const SortingPanel = React.memo(SortingPanelImpl);
