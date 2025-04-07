import * as React from 'react';
import { uuiElement, labelMod, cx } from '@epam/uui-core';
import type { Icon, LabeledInputCoreProps } from '@epam/uui-core';
import type { TooltipProps } from '../overlays';
import { FlexSpacer } from './flexItems';
import { IconContainer } from './IconContainer';
import { i18n } from '../i18n';
import css from './LabeledInput.module.scss';

export interface LabeledInputProps extends LabeledInputCoreProps, React.RefAttributes<HTMLDivElement> {
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

export const LabeledInput = (props: LabeledInputProps) => {
    const Tooltip = props.Tooltip;
    const isCanBeOptional = !props.isRequired && props.labelPosition !== 'left' && props.isOptional;
    const isOnlyCharCounter = !props.footnote && (props.charCounter && props.maxLength && !props.isInvalid);

    const getSideNote = (sideNote: React.ReactNode): React.ReactNode => {
        return (typeof sideNote === 'string')
            ? (
                <div dir="auto" className={ uuiLabeledInput.sideNote }>
                    {sideNote}
                </div>
            ) : sideNote;
    };

    const getCharCounter = () => (
        <div dir="auto" className={ uuiLabeledInput.charCounter }>
            { `${props.value?.length || '0'}/${props.maxLength}` }
        </div>
    );

    const getInvalidSection = () => {
        const isCharCounterAllow = props.charCounter && props.maxLength;
        return (
            <div className={ css.invalidSectionWrapper }>
                <div role="alert" dir="auto" className={ uuiElement.invalidMessage }>
                    {props.validationMessage}
                </div>
                { isCharCounterAllow && getCharCounter()}
            </div>
        );
    };

    const getFootnoteSection = () => {
        const isCharCounterAllow = props.charCounter && props.maxLength && !props.isInvalid;
        return (
            <div className={ css.footnoteSectionWrapper }>
                <div dir="auto" className={ uuiLabeledInput.footNote }>
                    { props.footnote }
                </div>
                { isCharCounterAllow && getCharCounter() }
            </div>
        );
    };

    return (
        <div className={ cx(css.container, props.cx) } ref={ props.ref } { ...props.rawProps }>
            <div className={ cx(labelMod[props.labelPosition ? props.labelPosition : 'top']) }>
                {props.label && (
                    <div className={ css.labelWrapper }>
                        <label htmlFor={ props.htmlFor } className={ uuiElement.label } dir={ props?.rawProps?.dir }>
                            {props.label}
                            {props.isRequired && <span className={ uuiLabeledInput.asterisk }>*</span>}
                            {props.info && Tooltip && (
                                <Tooltip content={ props.info }>
                                    <IconContainer icon={ props.infoIcon } cx={ uuiLabeledInput.infoIcon } />
                                </Tooltip>
                            )}
                            {isCanBeOptional && (
                                <div className={ css.optionalFieldWrapper }>
                                    <div dir="auto" className={ uuiLabeledInput.optional }>{i18n.labeledInput.optionalFieldLabel}</div>
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
};
