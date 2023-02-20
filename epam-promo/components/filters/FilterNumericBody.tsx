import React from 'react';
import { FlexSpacer } from '@epam/uui-components';
import { NumericInput } from '../inputs';
import { DropdownBodyProps, isMobile } from '@epam/uui-core';
import { FlexCell, FlexRow } from '../layout';
import { LinkButton } from '../buttons';
import { i18n } from '../../i18n';

interface INumericRangeValue {
    from: number | null;
    to: number | null;
}

interface IFilterNumericBodyProps extends DropdownBodyProps {
    onValueChange: (value: number | INumericRangeValue) => void;
    value: undefined | number | INumericRangeValue;
    selectedPredicate?: string;
}

export const FilterNumericBody = (props: IFilterNumericBodyProps) => {
    const isInRangePredicate = props?.selectedPredicate === 'inRange' || props?.selectedPredicate === 'notInRange';

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
        const size = isMobile() ? '48' : '36';
        const clearSelection = () => {
            if (isInRangePredicate) {
                props.onValueChange({ from: null, to: null });
            } else {
                props.onValueChange(null);
            }
        };

        const isClearDisabled = typeof props.value !== 'number' && typeof props.value !== 'object';

        return (
            <FlexRow padding="12" background="white">
                <FlexSpacer />
                <FlexCell width="auto" alignSelf="center">
                    <LinkButton
                        isDisabled={isClearDisabled}
                        size={size}
                        caption={i18n.pickerInput.clearSelectionButtonSingle}
                        onClick={clearSelection}
                    />
                </FlexCell>
            </FlexRow>
        );
    };

    if (isInRangePredicate) {
        const value = props.value as INumericRangeValue;
        return (
            <div>
                <FlexRow padding="12" vPadding="24" alignItems="center" spacing="12" borderBottom="gray40">
                    <FlexCell width={'100%'}>
                        <NumericInput
                            value={value?.from ?? null}
                            onValueChange={rangeValueHandler('from')}
                            size="30"
                            placeholder="Min"
                            formatOptions={{ maximumFractionDigits: 2 }}
                        />
                    </FlexCell>
                    <FlexCell width={'100%'}>
                        <NumericInput
                            value={value?.to ?? null}
                            onValueChange={rangeValueHandler('to')}
                            size="30"
                            placeholder="Max"
                            formatOptions={{ maximumFractionDigits: 2 }}
                        />
                    </FlexCell>
                </FlexRow>
                {renderFooter()}
            </div>
        );
    }

    return (
        <div>
            <FlexRow padding="12" vPadding="24" alignItems="center" borderBottom="gray40">
                <FlexCell width={130}>
                    <NumericInput
                        value={typeof props.value === 'number' ? props.value : null}
                        onValueChange={props.onValueChange}
                        size="30"
                        placeholder={'Enter a number'}
                        formatOptions={{ maximumFractionDigits: 2 }}
                    />
                </FlexCell>
            </FlexRow>
            {renderFooter()}
        </div>
    );
};
