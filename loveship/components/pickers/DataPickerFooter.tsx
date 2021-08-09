import React from "react";
import cx from "classnames";
import css from "./DataPickerFooter.scss";
import { ICheckable, isMobile, uuiMarkers } from "@epam/uui";
import { i18n } from "../../i18n";
import { Switch } from "../inputs";
import { FlexCell, FlexSpacer } from "../layout";
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

const DataPickerFooterImpl: React.FC<DataPickerFooterProps> = props => {
    if (props.isSingleSelect) return null;

    const size = isMobile() ? "48" : (props.size || "36");
    const switchSize = size === '24'
        ? '12'
        : (props.size === '42' || props.size === '48')
            ? '24'
            : '18';

    return (
        <div className={ cx(css.footerWrapper, css[`footer-size-${ size }`], uuiMarkers.clickable) }>
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
                        size={ +size < 36 ? '30' : '36' }
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
        </div>
    );
};

export const DataPickerFooter = React.memo(DataPickerFooterImpl);