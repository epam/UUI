import React from 'react';
import css from './DataPickerBody.scss';
import cx from 'classnames';
import { uuiMarkers } from '@epam/uui';
import { i18n } from "../../i18n";
import { Switch } from '../inputs';
import { FlexSpacer } from '../layout';
import { LinkButton } from "../buttons";
import { SizeMod } from "../types";
import { DataPickerBody, DataPickerBodyProps } from "./DataPickerBody";

export type DataPickerInputBodyProps<TItem, TId> = DataPickerBodyProps<TItem, TId> & SizeMod & {
    isSingleSelect?: boolean;
    hasSelection: boolean;
    clearSelection: () => void;
    switchValue: boolean;
    onSwitchValueChange: (newValue: boolean) => void;
};

export class DataPickerInputBody<TItem, TId> extends React.Component<DataPickerInputBodyProps<TItem, TId>, any> {
    render() {
        const isNotDisabled = this.props.hasSelection && !this.props.isSingleSelect;
        const switchSize = this.props.size === '24' ? '12' : (this.props.size === '42' || this.props.size === '48') ? '24' : '18';
        
        return (
            <>
                <DataPickerBody { ...this.props }/>
                
                { !this.props.isSingleSelect && (
                    <div
                        className={ cx(css.footerWrapper, css[`footer-size-${ this.props.size || 36 }`], uuiMarkers.clickable) }
                    >
                        <Switch
                            size={ switchSize }
                            value={ this.props.switchValue }
                            isDisabled={ !isNotDisabled }
                            onValueChange={ this.props.onSwitchValueChange }
                            label={ i18n.pickerInput.showOnlySelectedLabel }
                        />
                        <FlexSpacer/>
                        { this.props.selectAll && <LinkButton
                            size={ +this.props.size < 36 ? '30' : '36' }
                            caption={ this.props.hasSelection
                                ? i18n.pickerInput.clearSelectionButton
                                : i18n.pickerInput.selectAllButton
                            }
                            onClick={ this.props.hasSelection
                                ? this.props.clearSelection
                                : () => this.props.selectAll.onValueChange(true)
                            }
                        /> }
                    </div>
                ) }
            </>
        );
    }
}
