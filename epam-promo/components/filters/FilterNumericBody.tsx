import React, { useState } from "react";
import { DropdownBodyProps } from "@epam/uui-components";
import { NumericInput } from "../inputs";
import { Text } from "../typography";
import css from './FilterNumericBody.scss';
import cx from "classnames";
import { IDisableable, IEditable, isMobile } from "@epam/uui-core";
import { DataPickerFooter } from "../pickers";
import { FlexCell, FlexRow } from "../layout";
import { LinkButton } from "../buttons";
import { i18n } from "../../i18n";

interface IFilterNumericBodyProps extends DropdownBodyProps {
}

export const FilterNumericBody = (props: IFilterNumericBodyProps) => {
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(0);

    console.log('props', props);

    const renderFooter = () => {
        const size = isMobile() ? '48' : '36';
        const clearSelection = (e: React.KeyboardEvent<HTMLButtonElement>) => {
            setFrom(0);
            setTo(0);
        };

        return (
            <FlexRow padding="12" background="white" cx={ cx(css.footerWrapper) }>
                <FlexCell width="auto" alignSelf="center">
                    <LinkButton
                        isDisabled={ from === 0 && to === 0 }
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
                <Text cx={ css.label }>From: </Text>
                <NumericInput
                    value={ from }
                    onValueChange={ setFrom }
                    size="30"
                    min={ Number.MIN_SAFE_INTEGER }
                />
            </div>
            <div className={ cx(css.container) }>
                <Text cx={ css.label }>To: </Text>
                <NumericInput
                    value={ to }
                    onValueChange={ setTo }
                    size="30"
                    min={ Number.MIN_SAFE_INTEGER }
                />
            </div>
            { renderFooter() }
        </div>
    );
};