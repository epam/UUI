import React, { useCallback } from 'react';
import css from './FilterPanelOpener.scss';
import { FlexRow, IconButton } from '@epam/promo';
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
        <FlexRow background="white" borderBottom cx={ css.iconContainer }>
            <IconButton icon={ FilterIcon } color="gray50" onClick={ openPanel } />
        </FlexRow>
    );
};
