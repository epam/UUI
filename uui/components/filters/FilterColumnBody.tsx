import { FilterPredicateName, IFilterItemBodyProps } from '@epam/uui-core';
import React, { useState } from 'react';
import { DropdownContainer, FilterItemBody, getDefaultPredicate } from '../index';
import { FilterPredicatePanel } from './FilterPredicatePanel';
import { UUI_FILTERS_PANEL_ITEM_BODY } from './constants';
import { getValue } from './helpers/predicateHelpers';
import css from './FiltersPanelItem.module.scss';

export function FilterColumnBody(props: IFilterItemBodyProps<any>) {
    const isPickersType = props?.type === 'multiPicker' || props?.type === 'singlePicker';

    const [predicate, setPredicate] = useState<FilterPredicateName>(getDefaultPredicate(props.predicates, props.value));

    const onValueChange = (value: any) => {
        if (props.predicates) {
            props.onValueChange({ [predicate]: value });
        } else {
            props.onValueChange(value);
        }
    };

    const renderHeader = () => (
        <FilterPredicatePanel
            filterType="column"
            predicates={ props.predicates }
            predicate={ predicate }
            isPickersType={ isPickersType }
            type={ props.type }
            onValueChange={ props.onValueChange }
            value={ props.value }
            setPredicate={ setPredicate }
        />
    );

    return (
        <DropdownContainer style={ { minWidth: '360px' } } cx={ [css.body, UUI_FILTERS_PANEL_ITEM_BODY] } { ...props }>
            {renderHeader()}
            <FilterItemBody
                { ...props }
                selectedPredicate={ predicate }
                value={ getValue(predicate, props.value) }
                onValueChange={ onValueChange }
            />
        </DropdownContainer>
    );
}
