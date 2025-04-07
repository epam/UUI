import React from 'react';
import { DropdownBodyProps, isMobile } from '@epam/uui-core';
import { FlexSpacer } from '@epam/uui-components';
import { NumericInput } from '../inputs';
import { FlexCell, FlexRow } from '../layout';
import { LinkButton } from '../buttons';
import { i18n } from '../../i18n';

import css from './FilterNumericBody.module.scss';
import { settings } from '../../settings';

interface INumericRangeValue {
    /**
     * Defines range value 'from'
     */
    from: number | null;
    /**
     * Defines range value 'to'
     */
    to: number | null;
}

interface IFilterNumericBodyProps extends DropdownBodyProps {
    /**
     * Called when numeric body value needs to be changed
     */
    onValueChange: (value: number | INumericRangeValue) => void;
    /**
     * Defines numeric body value
     */
    value: undefined | number | INumericRangeValue;
    /**
     * Defines the selected predicate
     */
    selectedPredicate?: string;
}

export function FilterNumericBody(props: IFilterNumericBodyProps) {
    const isInRangePredicate = props?.selectedPredicate === 'inRange' || props?.selectedPredicate === 'notInRange';
    const isWrongRange = (from: number | undefined, to: number | undefined) => {
        if (!to && to !== 0) return false;
        return from > to;
    };

    const rangeValueHandler = (type: 'from' | 'to') => (val: number) => {
        const value = props.value as INumericRangeValue;
        switch (type) {
            case 'from': {
                props.onValueChange({
                    from: val,
                    to: value?.to ?? null,
                });
                break;
            }
            case 'to': {
                props.onValueChange({
                    from: value?.from ?? null,
                    to: val,
                });
                break;
            }
        }
    };

    const renderFooter = () => {
        const clearSelection = () => {
            if (isInRangePredicate) {
                props.onValueChange({
                    from: undefined,
                    to: undefined,
                });
            } else {
                props.onValueChange(undefined);
            }
        };

        const isClearDisabled = typeof props.value !== 'number' && typeof props.value !== 'object';

        return (
            <FlexRow padding="12">
                <FlexSpacer />
                <FlexCell width="auto" alignSelf="center">
                    <LinkButton
                        isDisabled={ isClearDisabled }
                        size={ settings.filtersPanel.sizes[isMobile() ? 'mobileFooterLinkButton' : 'default'] }
                        caption={ i18n.pickerInput.clearSelectionButtonSingle }
                        onClick={ clearSelection }
                    />
                </FlexCell>
            </FlexRow>
        );
    };

    if (isInRangePredicate) {
        const value = props.value as INumericRangeValue;
        return (
            <div>
                <FlexRow
                    padding="12"
                    alignItems="center"
                    spacing="12"
                    borderBottom={ true }
                    cx={ css.container }
                >
                    <FlexCell width="100%">
                        <NumericInput
                            size={ settings.filtersPanel.sizes.default }
                            value={ value?.from ?? null }
                            onValueChange={ rangeValueHandler('from') }
                            placeholder="Min"
                            formatOptions={ { maximumFractionDigits: 2 } }
                        />
                    </FlexCell>
                    <FlexCell width="100%">
                        <NumericInput
                            size={ settings.filtersPanel.sizes.default }
                            value={ value?.to ?? null }
                            onValueChange={ rangeValueHandler('to') }
                            placeholder="Max"
                            formatOptions={ { maximumFractionDigits: 2 } }
                            isInvalid={ isWrongRange(value?.from, value?.to) }
                        />
                    </FlexCell>
                </FlexRow>
                {renderFooter()}
            </div>
        );
    }

    return (
        <div>
            <FlexRow
                padding="12"
                alignItems="center"
                borderBottom={ true }
                cx={ css.container }
            >
                <FlexCell width={ 130 }>
                    <NumericInput
                        size={ settings.filtersPanel.sizes.default }
                        value={ typeof props.value === 'number' ? props.value : null }
                        onValueChange={ props.onValueChange }
                        placeholder="Enter a number"
                        formatOptions={ { maximumFractionDigits: 2 } }
                    />
                </FlexCell>
            </FlexRow>
            {renderFooter()}
        </div>
    );
}
