import React, { useCallback } from 'react';
import css from './FilterPanelOpener.module.scss';
import { FlexRow, IconButton } from '@epam/uui';
import { ReactComponent as FilterIcon } from '@epam/assets/icons/common/content-filter_list-24.svg';

interface IFilterPanelOpenerProps {
    isFilterPanelOpened: boolean;
    setIsFilterPanelOpened(isOpened: boolean): void;
}

export const FilterPanelOpener: React.FC<IFilterPanelOpenerProps> = (props) => {
    const openPanel = useCallback(() => {
        props.setIsFilterPanelOpened(true);
    }, [props.setIsFilterPanelOpened]);

    if (props.isFilterPanelOpened) return null;

    return (
        <FlexRow borderBottom cx={ css.iconContainer }>
            <IconButton icon={ FilterIcon } color="neutral" onClick={ openPanel } />
        </FlexRow>
    );
};
