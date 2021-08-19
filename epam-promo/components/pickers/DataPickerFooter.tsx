import React from "react";
import cx from "classnames";
import css from "./DataPickerFooter.scss";
import { ICheckable, isMobile, uuiMarkers } from "@epam/uui";
import { i18n } from "../../i18n";
import { Switch } from "../inputs";
import { FlexCell, FlexRow, FlexSpacer } from "../layout";
import { LinkButton } from "../buttons";
import { SizeMod } from "../types";

interface DataPickerFooterProps extends SizeMod {
    isSingleSelect?: boolean;
    switchValue: boolean;
    onSwitchValueChange: (newValue: boolean) => void;
    hasSelection: boolean;
    clearSelection: () => void;
    selectAll?: ICheckable;
}

const switchSizes = {
    "24": "12",
    "36": "18",
    "42": "24",
    "48": "24",
} as const;

const DataPickerFooterImpl: React.FC<DataPickerFooterProps> = props => {
    if (props.isSingleSelect) return null;

    const size = isMobile() ? "48" : (props.size || "36");
    const switchSize = switchSizes[size as keyof typeof switchSizes];

    return (
        <FlexRow padding="12" background="white" cx={ cx(css.footerWrapper, css[`footer-size-${ size }`], uuiMarkers.clickable) }>
            <Switch
                size={ switchSize }
                value={ props.switchValue }
                isDisabled={ !props.hasSelection }
                onValueChange={ props.onSwitchValueChange }
                label={ i18n.pickerInput.showOnlySelectedLabel }
            />

            <FlexSpacer/>

            { props.selectAll && (
                <FlexCell width="auto" alignSelf="center">
                    <LinkButton
                        size={ size }
                        caption={ props.hasSelection
                            ? i18n.pickerInput.clearSelectionButton
                            : i18n.pickerInput.selectAllButton
                        }
                        onClick={ props.hasSelection
                            ? props.clearSelection
                            : () => props.selectAll.onValueChange(true)
                        }
                    />
                </FlexCell>
            ) }
        </FlexRow>
    );
};

export const DataPickerFooter = React.memo(DataPickerFooterImpl);