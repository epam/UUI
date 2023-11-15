import * as React from 'react';
import css from './LabeledInput.module.scss';
import { Icon, uuiElement, labelMod, LabeledInputCoreProps, cx } from '@epam/uui-core';
import { TooltipProps } from '../overlays/Tooltip';
import { FlexRow, FlexSpacer } from './flexItems';
import { Svg } from '../widgets/Svg';
import { i18n } from '../i18n';

export interface LabeledInputProps extends LabeledInputCoreProps {
    /** Overrides the default Tooltip component to use for info tooltip */
    Tooltip?: React.ComponentType<TooltipProps>;
    /** Overrides the default info icon */
    infoIcon?: Icon;
}

const uuiLabeledInput = {
    infoIcon: 'uui-labeled-input-info-icon',
    asterisk: 'uui-labeled-input-asterisk',
    optional: 'uui-labeled-input-optional',
    charCounter: 'uui-labeled-input-char-counter',
    footNote: 'uui-labeled-input-footnote',
    sideNote: 'uui-labeled-input-sidenote',
} as const;

export class LabeledInput extends React.Component<LabeledInputProps> {
    getSideNote = (sideNote: React.ReactNode): React.ReactNode => {
        return (typeof sideNote === 'string')
            ? (
                <div className={ uuiLabeledInput.sideNote }>
                    {sideNote}
                </div>
            ) : sideNote;
    };

    getCharCounter = () => (
        <div className={ uuiLabeledInput.charCounter }>
            { `${this.props.value?.length || '0'}/${this.props.maxLength}` }
        </div>
    );

    getInvalidSection = () => {
        const isCharCounterAllow = this.props.charCounter && this.props.maxLength;
        return (
            <FlexRow alignItems="top" columnGap={ 12 }>
                <div role="alert" className={ uuiElement.invalidMessage }>
                    {this.props.validationMessage}
                </div>
                { isCharCounterAllow && this.getCharCounter()}
            </FlexRow>
        );
    };

    getFootnoteSection = () => {
        const isCharCounterAllow = this.props.charCounter && this.props.maxLength && !this.props.isInvalid;
        return (
            <FlexRow alignItems="top" columnGap={ 12 }>
                <div className={ uuiLabeledInput.footNote }>
                    { this.props.footnote }
                </div>
                { isCharCounterAllow && this.getCharCounter() }
            </FlexRow>
        );
    };

    render() {
        const Tooltip = this.props.Tooltip;
        const isCanBeOptional = !this.props.isRequired && this.props.labelPosition !== 'left' && this.props.isOptional;
        const isOnlyCharCounter = !this.props.footnote && (this.props.charCounter && this.props.maxLength && !this.props.isInvalid);

        return (
            <div className={ cx(css.container, this.props.cx) } ref={ this.props.forwardedRef } { ...this.props.rawProps }>
                <div className={ cx(labelMod[this.props.labelPosition ? this.props.labelPosition : 'top']) }>
                    {this.props.label && (
                        <div className={ css.labelWrapper }>
                            <label htmlFor={ this.props.htmlFor } className={ uuiElement.label }>
                                {this.props.label}
                                {this.props.isRequired && <span className={ uuiLabeledInput.asterisk }>*</span>}
                                {this.props.info && Tooltip && (
                                    <Tooltip content={ this.props.info }>
                                        <Svg svg={ this.props.infoIcon } cx={ uuiLabeledInput.infoIcon } />
                                    </Tooltip>
                                )}
                                {isCanBeOptional && (
                                    <div className={ css.optionalFieldWrapper }>
                                        <div className={ uuiLabeledInput.optional }>{i18n.labeledInput.optionalFieldLabel}</div>
                                    </div>
                                )}
                            </label>
                            {this.props.sidenote && (
                                <>
                                    <FlexSpacer />
                                    {this.getSideNote(this.props.sidenote)}
                                </>
                            )}
                        </div>
                    )}
                    <div className={ this.props.labelPosition === 'left' ? css.rightChildrenPosition : undefined }>{this.props.children}</div>
                </div>
                {this.props.isInvalid && this.getInvalidSection()}
                {this.props.footnote && this.getFootnoteSection()}
                { isOnlyCharCounter && this.getCharCounter()}
            </div>
        );
    }
}
