import React, { useCallback } from 'react';
import { cx, SortDirection } from '@epam/uui-core';
import { FlexCell } from '../../layout';
import { DropdownMenuButton } from '../../overlays';
import { i18n } from '../../../i18n';
import { settings } from '../../../index';

import css from './SortingPanel.module.scss';

export interface SortingPanelProps {
    sortDirection: SortDirection;
    onSort(dir: SortDirection): void;
}

const SortingPanelImpl: React.FC<SortingPanelProps> = ({ sortDirection, onSort }) => {
    const sortAsc = useCallback(() => onSort(sortDirection === 'asc' ? undefined : 'asc'), [onSort]);
    const sortDesc = useCallback(() => onSort(sortDirection === 'desc' ? undefined : 'desc'), [onSort]);

    return (
        <FlexCell cx={ cx(css.sortingPanelContainer, 'uui-dropdownMenu-body') }>
            <DropdownMenuButton
                isActive={ sortDirection === 'asc' }
                caption={ i18n.pickerFilterHeader.sortAscending }
                icon={ settings.dataTable.icons.header.ascSortIcon }
                onClick={ sortAsc }
            />
            <DropdownMenuButton
                isActive={ sortDirection === 'desc' }
                caption={ i18n.pickerFilterHeader.sortDescending }
                icon={ settings.dataTable.icons.header.descSortIcon }
                onClick={ sortDesc }
            />
        </FlexCell>
    );
};

export const SortingPanel = React.memo(SortingPanelImpl);
