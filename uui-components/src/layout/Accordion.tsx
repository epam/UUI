import React, { useState } from 'react';
import {
    IHasCX, IDisableable, uuiMod, IHasChildren, Icon, cx, IHasRawProps, IControlled,
} from '@epam/uui-core';
import { IconContainer } from './IconContainer';
import css from './Accordion.module.scss';

export interface GeneralAccordionProps extends IHasCX, IDisableable, IHasChildren, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    /** Accordion title */
    title?: string | React.ReactElement;
    /** Overrides default title rendering. */
    renderTitle?: (isOpen: boolean) => React.ReactElement;
    /** Overrides the default dropdown (folding) icon.Pass null to disable the folding icon completely */
    dropdownIcon?: Icon | null;
    /** Renders additional items to component's header (after the title, and before the folding icon) */
    renderAdditionalItems?: (isOpen: boolean) => React.ReactNode;
}

type EditableAccordionProps = GeneralAccordionProps & IControlled<boolean>;

export type AccordionProps = GeneralAccordionProps | EditableAccordionProps;

interface AccordionState {
    opened: boolean;
}

const uuiAccordion = {
    container: 'uui-accordion-container',
    title: 'uui-accordion-title',
    toggler: 'uui-accordion-toggler',
    toggleContainer: 'uui-accordion-toggle-container',
    body: 'uui-accordion-body',
} as const;

const isEditableAccordionProps = (props: AccordionProps): props is EditableAccordionProps => (props as EditableAccordionProps).onValueChange !== undefined;

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>((props, ref) => {
    const [state, setState] = useState<AccordionState>({
        opened: isEditableAccordionProps(props) ? props.value : false,
    });

    const isOpened = () => {
        return isEditableAccordionProps(props) ? props.value : state.opened;
    };

    const toggleAccordion = () => {
        const isAccordionOpened = isOpened();

        if (isEditableAccordionProps(props)) {
            props.onValueChange(!isAccordionOpened);
        } else {
            setState({ opened: !isAccordionOpened });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            toggleAccordion();
        }
    };

    const renderHeader = () => {
        const isAccordionOpened = isOpened();

        return (
            <div
                onKeyDown={ !props.isDisabled ? handleKeyDown : undefined }
                onClick={ !props.isDisabled ? toggleAccordion : undefined }
                tabIndex={ !props.isDisabled ? 0 : -1 }
                className={ cx(uuiAccordion.toggler, isAccordionOpened && uuiMod.opened, props.isDisabled && uuiMod.disabled) }
                { ...props.rawProps }
            >
                <div className={ cx(uuiAccordion.toggleContainer) }>
                    {props.renderTitle ? props.renderTitle(isAccordionOpened) : <div className={ cx(uuiAccordion.title) }>{props.title}</div>}

                    {props.renderAdditionalItems?.(isAccordionOpened)}

                    {props.dropdownIcon !== null && (
                        <IconContainer icon={ props.dropdownIcon } flipY={ isAccordionOpened } cx={ [props.isDisabled && uuiMod.disabled, css.arrow] } />
                    )}
                </div>
            </div>
        );
    };

    const renderBody = () => (
        <div className={ uuiAccordion.body } role="region">
            {props.children}
        </div>
    );

    const isAccordionOpened = isOpened();

    return (
        <div
            ref={ ref }
            aria-disabled={ props.isDisabled }
            aria-expanded={ isAccordionOpened }
            className={ cx(
                uuiAccordion.container,
                css.container,
                isAccordionOpened && !props.isDisabled && uuiMod.opened,
                props.isDisabled && uuiMod.disabled,
                props.cx,
            ) }
        >
            {renderHeader()}
            {props.children && isAccordionOpened ? renderBody() : null}
        </div>
    );
});
