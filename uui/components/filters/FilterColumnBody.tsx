import { FilterPredicateName, IFilterItemBodyProps } from '@epam/uui-core';
import React, { useState } from 'react';
import { DropdownContainer, FilterItemBody, getDefaultPredicate } from '../index';
import { FilterPredicatePanel } from './FilterPredicatePanel';
import { UUI_FILTERS_PANEL_ITEM_BODY } from './constants';
import { getValue } from './helpers/predicateHelpers';
import css from './FiltersPanelItem.module.scss';

export function FilterColumnBody(props: IFilterItemBodyProps<any>) {
    const [predicate, setPredicate] = useState<FilterPredicateName>(getDefaultPredicate(props.predicates, props.value));

    const onValueChange = (value: any) => {
        if (props.predicates) {
            props.onValueChange({ [predicate]: value });
        } else {
            props.onValueChange(value);
        }
    };

    const renderHeader = () => {
        const panelProps = {
            predicates: props.predicates,
            predicate,
            type: props.type,
            onValueChange: props.onValueChange,
            value: props.value,
            setPredicate,
        };

        return props.predicates?.length > 0 && (
            <div className={ css.header }>
                <FilterPredicatePanel { ...panelProps } />
            </div>
        );
    };

    return (
        <DropdownContainer style={ { minWidth: '360px' } } cx={ [css.body, UUI_FILTERS_PANEL_ITEM_BODY] } { ...props } focusLock={ false } rawProps={ { 'aria-modal': true } }>
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
