import React from 'react';
import css from './DataPickerBody.scss';
import cx from 'classnames';
import { uuiMarkers } from '@epam/uui';
import closeIcon from "@epam/assets/icons/common/navigation-close-24.svg";
import { i18n } from "../../i18n";
import { Switch } from '../inputs';
import { FlexSpacer } from '../layout';
import { IconButton, LinkButton } from "../buttons";
import { SizeMod } from "../types";
import { Text } from "../typography";
import { DataPickerBody, DataPickerBodyProps } from "./DataPickerBody";

export type DataPickerInputBodyProps<TItem, TId> = DataPickerBodyProps<TItem, TId> & SizeMod & {
    isSingleSelect?: boolean;
    hasSelection: boolean;
    clearSelection: () => void;
    switchValue: boolean;
    onSwitchValueChange: (newValue: boolean) => void;
    title?: string;
    close?: () => void;
};

export class DataPickerInputBody<TItem, TId> extends React.Component<DataPickerInputBodyProps<TItem, TId>, any> {
    render() {
        const isNotDisabled = this.props.hasSelection && !this.props.isSingleSelect;
        const switchSize = this.props.size === '24' ? '12' : (this.props.size === '42' || this.props.size === '48') ? '24' : '18';
        const size = this.props.size || 36;

        return (
            <>
                { this.props.title && (
                    <>
                        <div className={ cx(css.header, css[`size-${ size }`]) }>
                            <Text font="sans-semibold">{ this.props.title }</Text>
                            <IconButton
                                icon={ closeIcon }
                                onClick={ () => this.props.close?.() }
                                cx={ cx(css.close, css[`close-size-${ size }`]) }
                            />
                        </div>
                    </>
                ) }

                <DataPickerBody { ...this.props }/>

                { !this.props.isSingleSelect && (
                    <div className={ cx(css.footerWrapper, css[`footer-size-${ size }`], uuiMarkers.clickable) }>
                        <Switch
                            size={ switchSize }
                            value={ this.props.switchValue }
                            isDisabled={ !isNotDisabled }
                            onValueChange={ this.props.onSwitchValueChange }
                            label={ i18n.pickerInput.showOnlySelectedLabel }
                        />
                        
                        <FlexSpacer/>
                        
                        { this.props.selectAll && (
                            <LinkButton
                                size={ +this.props.size < 36 ? '30' : '36' }
                                caption={ this.props.hasSelection
                                    ? i18n.pickerInput.clearSelectionButton
                                    : i18n.pickerInput.selectAllButton
                                }
                                onClick={ this.props.hasSelection
                                    ? this.props.clearSelection
                                    : () => this.props.selectAll.onValueChange(true)
                                }
                            />
                        ) }
                    </div>
                ) }

                <LinkButton
                    caption="DONE"
                    onClick={ () => this.props.close?.() }
                    cx={ cx(css.done, css[`size-${ size }`]) }
                />
            </>
        );
    }
}