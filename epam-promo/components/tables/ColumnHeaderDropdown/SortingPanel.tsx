import React, { useCallback } from 'react';
import css from './SortingPanel.scss';
import { ReactComponent as SortIcon } from '@epam/assets/icons/common/table-sort_asc-18.svg';
import { ReactComponent as SortIconDesc } from '@epam/assets/icons/common/table-sort_desc-18.svg';
import { SortDirection } from '@epam/uui-core';
import { FlexCell } from '../../layout';
import { i18n } from '../../../i18n';
import { DropdownMenuButton } from '../../overlays';

export interface SortingPanelProps {
    sortDirection: SortDirection;
    onSort(dir: SortDirection): void;
}

const SortingPanelImpl: React.FC<SortingPanelProps> = ({ sortDirection, onSort }) => {
    const sortAsc = useCallback(() => onSort(sortDirection === 'asc' ? undefined : 'asc'), [onSort]);
    const sortDesc = useCallback(() => onSort(sortDirection === 'desc' ? undefined : 'desc'), [onSort]);

    return (
        <FlexCell cx={css.sortingPanelContainer}>
            <DropdownMenuButton
                isActive={sortDirection === 'asc'}
                caption={i18n.pickerFilterHeader.sortAscending}
                icon={SortIcon}
                onClick={sortAsc}
            />
            <DropdownMenuButton
                isActive={sortDirection === 'desc'}
                caption={i18n.pickerFilterHeader.sortDescending}
                icon={SortIconDesc}
                onClick={sortDesc}
            />
        </FlexCell>
    );
};

export const SortingPanel = React.memo(SortingPanelImpl);
