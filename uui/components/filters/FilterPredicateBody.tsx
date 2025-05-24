import React, { useCallback } from 'react';
import { DropdownBodyProps, FilterPredicate, FilterType, isMobile, TableFiltersConfig } from '@epam/uui-core';
import { PickerBodyMobileView } from '../pickers';
import { UUI_FILTERS_PANEL_ITEM_BODY } from './constants';
import { settings } from '../../settings';
import { FilterItemBody } from './FilterItemBody';
import { DropdownContainer } from '../overlays';
import { getValue } from './helpers/predicateHelpers';
import css from './FiltersPanelItem.module.scss';

type IPredicatesBodyProps = TableFiltersConfig<any> & DropdownBodyProps & {
    filterType: FilterType;
    isPickersType?: boolean;
    title?: string;
    isOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen?: boolean;
    renderHeader: (hideTitle: boolean, onValueChange: (value: any) => void) => React.ReactNode;
    predicate?: keyof FilterPredicate<any>;
    value?: any;
    onValueChange: (value: any) => void;
};

export function FilterPredicateBody(props: IPredicatesBodyProps) {
    const isMobileScreen = isMobile();
    const hideHeaderTitle = props.isPickersType && isMobileScreen;

    const onValueChange = useCallback(
        (value: any) => {
            if (props.predicates) {
                props.onValueChange({ [props.predicate]: value });
            } else {
                props.onValueChange(value);
            }
        },
        [props.onValueChange, props.predicate],
    );

    const renderDefaultBody = () => (
        <DropdownContainer style={ { minWidth: '360px' } } cx={ [css.body, UUI_FILTERS_PANEL_ITEM_BODY] } { ...props }>
            {props.renderHeader(hideHeaderTitle, onValueChange)}
            <FilterItemBody
                { ...props }
                selectedPredicate={ props.predicate }
                value={ getValue(props.predicate, props.value) }
                onValueChange={ onValueChange }
            />
        </DropdownContainer>
    );

    const renderMobileBody = () => (
        <PickerBodyMobileView
            { ...props }
            cx={ [css.body, UUI_FILTERS_PANEL_ITEM_BODY] }
            title={ props.title }
            width={ settings.filtersPanel.sizes.pickerBodyMinWidth }
            onClose={ () => props.isOpenChange(false) }
        >
            {props.renderHeader(hideHeaderTitle, onValueChange)}
            <FilterItemBody
                { ...props }
                field={ props.field }
                selectedPredicate={ props.predicate }
                value={ getValue(props.predicate, props.value) }
                onValueChange={ onValueChange }
            />
        </PickerBodyMobileView>
    );

    if (props.filterType === 'column') {
        renderDefaultBody();
    }

    return props.isPickersType ? (
        renderMobileBody()
    ) : (
        renderDefaultBody()
    );
}
