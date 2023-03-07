import React, { useState } from "react";
import { FlexCell, LabeledInput, NumericInput } from "@epam/promo";
import css from "./BasicExample.scss";

const NumericExample = ({
    label,
    initialValue,
    disableLocaleFormatting,
    formatOptions,
    formatValue,
}: {
    label: string;
    initialValue?: number,
    disableLocaleFormatting?: boolean;
    formatOptions?: Intl.NumberFormatOptions;
    formatValue?(value: number): string;
}) => {
    const [value, onValueChange] = useState(initialValue || 1005001.23);

    return (
        <LabeledInput label={ label }>
            <NumericInput
                value={ value }
                onValueChange={ onValueChange }
                disableLocaleFormatting={ disableLocaleFormatting }
                formatOptions={ formatOptions }
                formatValue={ formatValue }
            />
        </LabeledInput>
    );
};

export default function BasicExample() {
    return (
        <FlexCell width="auto" cx={ css.container }>
            <NumericExample
                key="n1"
                initialValue={ 1005001 }
                label="Default locale formatting"
            />
            <NumericExample
                key="n2"
                initialValue={ 1005001 }
                label="With disableLocaleFormatting"
                disableLocaleFormatting={ true }
            />
            <NumericExample
                key="n3"
                initialValue={ 1005001 }
                label="No fraction digits"
                formatOptions={ { maximumFractionDigits: 0 } }
            />
            <NumericExample
                key="n4"
                label="Min 2 fractional digits"
                formatOptions={ { minimumFractionDigits: 2 } }
            />
            <NumericExample
                key="n5"
                label="Max 2 fractional digits"
                formatOptions={ { maximumFractionDigits: 2 } }
            />
            <NumericExample
                key="n6"
                label="Exactly 2 fractional digits"
                formatOptions={ {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                } }
            />
            <NumericExample
                key="n7"
                label="Currency"
                formatOptions={ {
                    style: "currency",
                    currency: "USD",
                    currencyDisplay: "name",
                } }
            />
            <NumericExample
                key="n8"
                label="Custom formatting with max 2 fraction digits"
                formatOptions={ { maximumFractionDigits: 2 } }
                formatValue={ (value) => "USD " + value }
            />
            <NumericExample
                key="n9"
                label="Units (meters)"
                formatOptions={ { style: "unit", unit: "meter" } }
            />
        </FlexCell>
    );
}
