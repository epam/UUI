import * as React from 'react';
import { Icon, uuiElement, labelMod, LabeledInputCoreProps, cx } from '@epam/uui-core';
import { TooltipProps } from '../overlays/Tooltip';
import { FlexRow, FlexSpacer } from './flexItems';
import { IconContainer } from './IconContainer';
import { i18n } from '../i18n';
import css from './LabeledInput.module.scss';

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

export const LabeledInput = /* @__PURE__ */React.forwardRef<HTMLDivElement, LabeledInputProps>((props, ref) => {
    const Tooltip = props.Tooltip;
    const isCanBeOptional = !props.isRequired && props.labelPosition !== 'left' && props.isOptional;
    const isOnlyCharCounter = !props.footnote && (props.charCounter && props.maxLength && !props.isInvalid);

    const getSideNote = (sideNote: React.ReactNode): React.ReactNode => {
        return (typeof sideNote === 'string')
            ? (
                <div className={ uuiLabeledInput.sideNote }>
                    {sideNote}
                </div>
            ) : sideNote;
    };

    const getCharCounter = () => (
        <div className={ uuiLabeledInput.charCounter }>
            { `${props.value?.length || '0'}/${props.maxLength}` }
        </div>
    );

    const getInvalidSection = () => {
        const isCharCounterAllow = props.charCounter && props.maxLength;
        return (
            <FlexRow alignItems="top" columnGap={ 12 }>
                <div role="alert" className={ uuiElement.invalidMessage }>
                    {props.validationMessage}
                </div>
                { isCharCounterAllow && getCharCounter()}
            </FlexRow>
        );
    };

    const getFootnoteSection = () => {
        const isCharCounterAllow = props.charCounter && props.maxLength && !props.isInvalid;
        return (
            <FlexRow alignItems="top" columnGap={ 12 }>
                <div className={ uuiLabeledInput.footNote }>
                    { props.footnote }
                </div>
                { isCharCounterAllow && getCharCounter() }
            </FlexRow>
        );
    };

    return (
        <div className={ cx(css.container, props.cx) } ref={ ref } { ...props.rawProps }>
            <div className={ cx(labelMod[props.labelPosition ? props.labelPosition : 'top']) }>
                {props.label && (
                    <div className={ css.labelWrapper }>
                        <label htmlFor={ props.htmlFor } className={ uuiElement.label }>
                            {props.label}
                            {props.isRequired && <span className={ uuiLabeledInput.asterisk }>*</span>}
                            {props.info && Tooltip && (
                                <Tooltip content={ props.info }>
                                    <IconContainer icon={ props.infoIcon } cx={ uuiLabeledInput.infoIcon } />
                                </Tooltip>
                            )}
                            {isCanBeOptional && (
                                <div className={ css.optionalFieldWrapper }>
                                    <div className={ uuiLabeledInput.optional }>{i18n.labeledInput.optionalFieldLabel}</div>
                                </div>
                            )}
                        </label>
                        {props.sidenote && (
                            <>
                                <FlexSpacer />
                                {getSideNote(props.sidenote)}
                            </>
                        )}
                    </div>
                )}
                <div className={ props.labelPosition === 'left' ? css.rightChildrenPosition : undefined }>{props.children}</div>
            </div>
            {props.isInvalid && getInvalidSection()}
            {props.footnote && getFootnoteSection()}
            { isOnlyCharCounter && getCharCounter()}
        </div>
    );
});
