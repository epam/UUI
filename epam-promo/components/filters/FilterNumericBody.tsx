import React, { useEffect, useState } from "react";
import cx from "classnames";
import css from './FilterNumericBody.scss';
import { DropdownBodyProps, FlexSpacer } from "@epam/uui-components";
import { NumericInput } from "../inputs";
import { isMobile } from "@epam/uui-core";
import { FlexCell, FlexRow } from "../layout";
import { LinkButton } from "../buttons";
import { i18n } from "../../i18n";

type NumericRangeValueType = { from: number | null, to: number | null };

interface IFilterNumericBodyProps extends DropdownBodyProps {
    onValueChange: (value: number | NumericRangeValueType) => void;
    value: number | NumericRangeValueType;
    currentPredicate?: { predicate: string, name: string };
}

export const FilterNumericBody = (props: IFilterNumericBodyProps) => {
    const [value, setValue] = useState<NumericRangeValueType>({ from: null, to: null });
    const isInRangePredicate = props?.currentPredicate.predicate === 'inRange' || props?.currentPredicate.predicate === 'notInRange';

    useEffect(() => {
        if ((!props?.value) && isInRangePredicate) {
            value.from && props.onValueChange(value);
        }
        if (props?.value && !isInRangePredicate && typeof props.value !== 'number') {
            value.from && props.onValueChange(value?.from);
        }
    }, [props.currentPredicate]);


    useEffect(() => {
        if (isInRangePredicate) {
            if ((props?.value || props?.value === 0) && typeof props?.value === 'number') {
                setValue({ from: props.value, to: null });
            } else if (props?.value && typeof props?.value !== 'number') {
                setValue({ ...props.value });
            }
        } else {
            if ((props?.value || props?.value === 0) && typeof props?.value === 'number') {
                setValue({ from: props.value, to: null });
            } else if (props?.value && typeof props?.value !== 'number') {
                setValue({ from: props.value.from, to: null });
            }
        }
    }, []);

    const changeValueHandler = (type: 'from' | 'to') => (val: number) => {
        if (isInRangePredicate) {
            switch (type) {
                case "from":
                    setValue({ from: val, to: value.to });
                    props.onValueChange({ from: val, to: value.to });
                    break;
                case "to":
                    setValue({ from: value.from, to: val });
                    props.onValueChange({ from: value.from, to: val });
                    break;
            }
        } else {
            setValue({ from: val, to: null });
            props.onValueChange(val);
        }
    };

    const renderFooter = () => {
        const size = isMobile() ? '48' : '36';
        const clearSelection = () => {
            setValue({ from: null, to: null });
            props.onValueChange(null);
        };

        return (
            <FlexRow padding="12" background="white" cx={ cx(css.footerWrapper) }>
                <FlexSpacer/>
                <FlexCell width="auto" alignSelf="center">
                    <LinkButton
                        isDisabled={ value.from === null && value.to === null }
                        size={ size }
                        caption={ i18n.pickerInput.clearSelectionButtonSingle }
                        onClick={ clearSelection }
                    />
                </FlexCell>
            </FlexRow>
        );
    };

    return (
        <div>
            <div className={ cx(css.container) }>
                <NumericInput
                    value={ value.from }
                    onValueChange={ changeValueHandler('from') }
                    size="30"
                    placeholder={ isInRangePredicate ? "Min" : "Enter a number" }
                />
                {
                    isInRangePredicate
                    &&
                    <NumericInput
                        value={ value.to }
                        onValueChange={ changeValueHandler('to') }
                        size="30"
                        placeholder="Max"
                    />
                }
            </div>
            { renderFooter() }
        </div>
    );
};