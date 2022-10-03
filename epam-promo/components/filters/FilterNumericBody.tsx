import React, { useEffect, useState } from "react";
import { DropdownBodyProps, FlexSpacer } from "@epam/uui-components";
import { NumericInput } from "../inputs";
import { Text } from "../typography";
import css from './FilterNumericBody.scss';
import cx from "classnames";
import { isMobile } from "@epam/uui-core";
import { FlexCell, FlexRow } from "../layout";
import { LinkButton } from "../buttons";
import { i18n } from "../../i18n";

type NumericRangeValueType = { from: number | null, to: number | null };

interface IFilterNumericBodyProps extends DropdownBodyProps {
    onValueChange: (value: NumericRangeValueType) => void;
    value: { from: number, to: number } | undefined;
}

export const FilterNumericBody = (props: IFilterNumericBodyProps) => {
    const [value, setValue] = useState<NumericRangeValueType>({ from: null, to: null });

    useEffect(() => {
        if (props?.value) {
            setValue(props.value);
        }
    }, []);

    const changeValueHandler = (type: 'from' | 'to') => (val: number) => {
        switch (type) {
            case "from":
                setValue(prev => ({ ...prev, from: val }));
                props.onValueChange({ from: val, to: value.to });
                break;
            case "to":
                setValue(prev => ({ ...prev, to: val }));
                props.onValueChange({ from: value.from, to: val });
                break;
        }
    };

    const renderFooter = () => {
        const size = isMobile() ? '48' : '36';
        const clearSelection = () => {
            setValue({ from: null, to: null });
            props.onValueChange({ from: null, to: null });
        };

        return (
            <FlexRow padding="12" background="white" cx={ cx(css.footerWrapper) } >
                <FlexSpacer/>
                <FlexCell width="auto" alignSelf="center">
                    <LinkButton
                        isDisabled={ (value?.from === null) && (value?.to === null) }
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
                <Text cx={ css.label }>From:</Text>
                <NumericInput
                    value={ value.from }
                    onValueChange={ changeValueHandler('from') }
                    size="30"
                    placeholder='-'
                />
            </div>
            <div className={ cx(css.container) }>
                <Text cx={ css.label }>To:</Text>
                <NumericInput
                    value={ value.to }
                    onValueChange={ changeValueHandler('to') }
                    size="30"
                    placeholder='-'
                />
            </div>
            { renderFooter() }
        </div>
    );
};