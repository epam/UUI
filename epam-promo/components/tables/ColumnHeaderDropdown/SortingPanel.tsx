import React, { useCallback } from "react";
import css from "./SortingPanel.scss";
import sortIcon from '@epam/assets/icons/common/table-sort_asc-18.svg';
import sortIconDesc from '@epam/assets/icons/common/table-sort_desc-18.svg';
import { SortDirection } from "@epam/uui";
import { FlexCell, FlexRow } from "../../layout";
import { IconButton } from "../../buttons";
import { i18n } from "../../../i18n";
import { Text } from "../../typography";

export interface SortingPanelProps {
    sortDirection: SortDirection;
    onSort(dir: SortDirection): void;
}

const SortingPanelImpl: React.FC<SortingPanelProps> = ({ sortDirection, onSort }) => {
    const sortAsc = useCallback(() => onSort('asc'), [onSort]);
    const sortDesc = useCallback(() => onSort('desc'), [onSort]);

    return (
        <FlexCell cx={ css.sortingPanelContainer }>
            <FlexRow cx={ css.filterSortButton } spacing="6" onClick={ sortAsc }>
                <IconButton
                    color={ sortDirection === 'asc' ? "blue" : "gray60" }
                    icon={ sortIcon }
                />
                <Text
                    cx={ sortDirection === 'asc' ? css.activeText : css.sortText }
                    color="gray80"
                    fontSize="14"
                    size="24"
                >
                    { i18n.pickerFilterHeader.sortAscending }
                </Text>
            </FlexRow>

            <FlexRow cx={ css.filterSortButton } spacing="6" onClick={ sortDesc }>
                <IconButton
                    color={ sortDirection === 'desc' ? "blue" : "gray60" }
                    icon={ sortIconDesc }
                />
                <Text
                    cx={ sortDirection === 'desc' ? css.activeText : css.sortText }
                    color="gray80"
                    fontSize="14"
                    size="24"
                >
                    { i18n.pickerFilterHeader.sortDescending }
                </Text>
            </FlexRow>
        </FlexCell>
    );
};

export const SortingPanel = React.memo(SortingPanelImpl);