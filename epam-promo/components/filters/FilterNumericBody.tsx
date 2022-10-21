import React, { useEffect, useLayoutEffect, useRef } from "react";
import cx from "classnames";
import css from './FilterNumericBody.scss';
import { DropdownBodyProps, FlexSpacer } from "@epam/uui-components";
import { NumericInput } from "../inputs";
import { isMobile } from "@epam/uui-core";
import { FlexCell, FlexRow } from "../layout";
import { LinkButton } from "../buttons";
import { i18n } from "../../i18n";

interface NumericRangeValueType {
    from: number | null;
    to: number | null;
}

type Value = undefined | number | NumericRangeValueType;

interface IFilterNumericBodyProps extends DropdownBodyProps {
    onValueChange: (value: number | NumericRangeValueType) => void;
    value: Value;
    selectedPredicate?: string;
}

export const FilterNumericBody = (props: IFilterNumericBodyProps) => {
    const isInRangePredicate = props?.selectedPredicate === 'inRange' || props?.selectedPredicate === 'notInRange';

    useEffect(() => {
        if (isInRangePredicate) {
            if (typeof props.value !== 'object') {
                props.onValueChange({from: null, to: null});
            }
        } else {
            props.onValueChange(null);
        }
    }, [isInRangePredicate]);

    const getNumberValue = () => {
        if (typeof props.value === 'number') {
            return props.value;
        } else if (typeof props.value === 'object') {
            return (props.value && "from" in props.value) ? props.value?.from : null;
        }
        return null;
    };

    const getRangeValue = (type: 'from' | 'to') => {
        switch (type) {
            case "from":
                if (typeof props.value === "number") {
                    return props.value;
                }
                return ((props.value && typeof props.value === 'object') && ("from" in props.value)) ? props.value?.from : null;
            case "to":
                return ((props.value && typeof props.value === 'object') && ("to" in props.value)) ? props.value?.to : null;
        }
    };

    const rangeValueHandler = (type: 'from' | 'to') => (val: number) => {
        switch (type) {
            case "from": {
                props.onValueChange({
                    from: val,
                    to: ((props.value && typeof props.value === "object") && ("to" in props.value)) ? props.value?.to : null,
                });
                break;
            }
            case "to": {
                props.onValueChange({
                    from: ((props.value && typeof props.value === "object") && ("from" in props.value)) ? props.value?.from : null,
                    to: val,
                });
                break;
            }
        }
    };

    const renderFooter = () => {
        const size = isMobile() ? '48' : '36';
        const clearSelection = () => {
            if (isInRangePredicate) {
                props.onValueChange({ from: null, to: null });
            } else {
                props.onValueChange(null);
            }
        };

        const isClearDisabled = (!props.value && props.value !== 0) && (typeof props.value === "object" && !props.value?.from && !props.value?.to);

        return (
            <FlexRow padding="12" background="white" cx={ cx(css.footerWrapper) }>
                <FlexSpacer/>
                <FlexCell width="auto" alignSelf="center">
                    <LinkButton
                        isDisabled={ isClearDisabled }
                        size={ size }
                        caption={ i18n.pickerInput.clearSelectionButtonSingle }
                        onClick={ clearSelection }
                    />
                </FlexCell>
            </FlexRow>
        );
    };

    if (isInRangePredicate) {
        return (
            <div>
                <div className={ cx(css.container) }>
                    <NumericInput
                        cx={ cx(css.inRange) }
                        value={ getRangeValue('from') }
                        onValueChange={ rangeValueHandler('from') }
                        size="30"
                        placeholder="Min"
                    />
                    <NumericInput
                        cx={ cx(css.inRange) }
                        value={ getRangeValue('to') }
                        onValueChange={ rangeValueHandler('to') }
                        size="30"
                        placeholder="Max"
                    />
                </div>
                { renderFooter() }
            </div>
        );
    }

    return (
        <div>
            <div className={ cx(css.container) }>
                <NumericInput
                    value={ getNumberValue() }
                    onValueChange={ props.onValueChange }
                    size="30"
                    placeholder={ "Enter a number" }
                />
            </div>
            { renderFooter() }
        </div>
    );
};