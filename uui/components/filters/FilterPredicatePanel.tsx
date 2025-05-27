import React, { useEffect } from 'react';
import { FilterPredicate, FilterPredicateName, IFilterPredicate } from '@epam/uui-core';
import { settings } from '../../settings';
import { MultiSwitch } from '../inputs';
import { getValue } from './helpers/predicateHelpers';

interface IPredicatesHeaderProps {
    predicates: IFilterPredicate[];
    predicate: keyof FilterPredicate<any>;
    isPickersType: boolean;
    type: 'singlePicker' | 'multiPicker' | 'datePicker' | 'numeric' | 'rangeDatePicker' | 'custom';
    onValueChange: (newValue: any) => void;
    value: unknown;
    setPredicate: React.Dispatch<React.SetStateAction<keyof FilterPredicate<any>>>;
}

export function FilterPredicatePanel(props: IPredicatesHeaderProps) {
    if (!props.predicates) return null;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        // This effect needs when the filter dropdown was closed and opened again
        if (props.predicates && props.value && Object.keys(props.value).length > 0) {
            const predicateFromValue = Object.keys(props.value)[0];
            if (predicateFromValue !== props.predicate) {
                props.setPredicate(predicateFromValue as FilterPredicateName);
            }
        }
    }, [props.value]);

    const changePredicate = (val: FilterPredicateName) => {
        const isInRange = (p: FilterPredicateName) => p === 'inRange' || p === 'notInRange';
        if (props.type === 'numeric') {
            let predicateValue = { [val]: getValue(props.predicate, props.value) };

            if (isInRange(val) && !isInRange(props.predicate as FilterPredicateName)) {
                // from simple predicate -> to Range
                predicateValue = { [val]: { from: null, to: null } };
            } else if (!isInRange(val) && isInRange(props.predicate as FilterPredicateName)) {
                // from Range -> to simple predicate
                predicateValue = { [val]: null };
            }
            props.onValueChange(predicateValue);
        } else {
            props.onValueChange({ [val]: getValue(props.predicate, props.value) });
        }
        props.setPredicate(val);
    };

    return (
        <MultiSwitch
            items={ props.predicates?.map((i) => ({ id: i.predicate, caption: i.name })) }
            value={ props.predicate }
            onValueChange={ changePredicate }
            size={ settings.filtersPanel.sizes.pickerBodyMultiSwitch }
        />
    );
}
