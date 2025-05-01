import { FilterPredicateName, IFilterItemBodyProps } from '@epam/uui-core';
import React, { useEffect, useState } from 'react';
import { DropdownContainer, FilterItemBody, MultiSwitch } from '../index';
import css from './FiltersPanelItem.module.scss';
import { UUI_FILTERS_PANEL_ITEM_BODY } from './constants';
import { settings } from '../../settings';
import cx from 'classnames';

const isRangeTypeValue = (val: string) => val === 'inRange' || val === 'notInRange';

export function FilterColumnBody(props: IFilterItemBodyProps<any>) {
    const isPickersType = props?.type === 'multiPicker' || props?.type === 'singlePicker';

    const [predicate, setPredicate] = useState(null);

    useEffect(() => {
        const newPredicate = Array.isArray(props.predicates)
            ? props.predicates.find((p) => p?.isDefault)?.predicate ?? props.predicates?.[0]?.predicate ?? null
            : null;

        setPredicate(newPredicate as FilterPredicateName);
    }, [props.predicates]);

    useEffect(() => {
        // This effect needs when the filter dropdown was closed and opened again
        if (props.predicates && props.value && Object.keys(props.value).length > 0) {
            const predicateFromValue = Object.keys(props.value)[0];
            if (predicateFromValue !== predicate) {
                setPredicate(predicateFromValue as FilterPredicateName);
            }
        }
    }, [props.value]);

    const getValue = () => {
        return predicate ? props.value?.[predicate] : props.value;
    };

    const onValueChange = (value: any) => {
        if (props.predicates) {
            let isNullishOrUndefined = false;

            if (typeof value === 'object' && value !== null) {
                if (Object.values(value).every((v) => v === null || v === undefined)) {
                    isNullishOrUndefined = true;
                }
            }

            props.onValueChange(isNullishOrUndefined ? undefined : { [predicate]: value });
        } else {
            props.onValueChange(value);
        }
    };

    const changePredicate = (val: FilterPredicateName) => {
        const arePredicatesInSameType = props?.value && isRangeTypeValue(predicate) === isRangeTypeValue(val);

        if (arePredicatesInSameType) {
            props.onValueChange({ [val]: props?.value?.[predicate] });
        } else {
            props.onValueChange(undefined);
        }

        setPredicate(val);
    };

    const renderHeader = () => (
        <div className={ cx(css.header, isPickersType && (props.showSearch ?? css.withSearch)) }>
            <MultiSwitch
                items={ props.predicates.map((i) => ({ id: i.predicate, caption: i.name })) }
                value={ predicate }
                onValueChange={ changePredicate }
                size={ settings.filtersPanel.sizes.pickerBodyMultiSwitch }
            />
        </div>
    );

    return (
        <DropdownContainer cx={ [css.body, UUI_FILTERS_PANEL_ITEM_BODY] } { ...props }>
            { props.predicates && renderHeader() }
            <FilterItemBody
                { ...props }
                selectedPredicate={ predicate }
                value={ getValue() }
                onValueChange={ onValueChange }
            />
        </DropdownContainer>
    );
}
