import { FilterPredicateName, IFilterItemBodyProps } from '@epam/uui-core';
import React, { useEffect, useState } from 'react';
import { getDefaultPredicate } from '../index';
import { FilterPredicatePanel } from './FilterPredicatePanel';
import { FilterPredicateBody } from './FilterPredicateBody';

export function FilterColumnBody(props: IFilterItemBodyProps<any>) {
    const isPickersType = props?.type === 'multiPicker' || props?.type === 'singlePicker';

    const [predicate, setPredicate] = useState<FilterPredicateName>(getDefaultPredicate(props.predicates, props.value));

    useEffect(() => {
        // This effect needs when the filter dropdown was closed and opened again
        if (props.predicates && props.value && Object.keys(props.value).length > 0) {
            const predicateFromValue = Object.keys(props.value)[0];
            if (predicateFromValue !== predicate) {
                setPredicate(predicateFromValue as FilterPredicateName);
            }
        }
    }, [props.value]);

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
        <FilterPredicateBody
            { ...props }
            filterType="column"
            predicate={ predicate }
            renderHeader={ renderHeader }
            isPickersType={ isPickersType }
            value={ props.value }
            onValueChange={ props.onValueChange }
        />
    );
}
