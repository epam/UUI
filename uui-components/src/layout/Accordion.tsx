import * as React from 'react';
import { IHasCX, IDisableable, uuiMod, IHasChildren, Icon, IEditable, cx, IHasRawProps, IHasForwardedRef } from '@epam/uui-core';
import { IconContainer } from '../layout';
import css from './Accordion.scss';

export interface AccordionProps extends Partial<IEditable<boolean>>, IHasCX, IDisableable, IHasChildren, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    /** Accordion title */
    title?: string | React.ReactElement;
    /** Overrides default title rendering. */
    renderTitle?: (isOpen: boolean) => React.ReactElement;
    /** Overrides the default dropdown (folding) icon.Pass null to disable the folding icon completely */
    dropdownIcon?: Icon | null;
    /** Renders additional items to component's header (after the title, and before the folding icon) */
    renderAdditionalItems?: (isOpen: boolean) => React.ReactNode;
}

export interface AccordionState {
    opened: boolean;
}

const uuiAccordion = {
    title: 'uui-accordion-title',
    toggler: 'uui-accordion-toggler',
    toggleContainer: 'uui-accordion-toggle-container',
    body: 'uui-accordion-body',
};

export class Accordion extends React.Component<AccordionProps, AccordionState> {
    state = {
        opened: this.props.value || false,
    };

    private toggleAccordion = () => {
        const opened = this.isOpened();
        this.props.onValueChange ? this.props.onValueChange(!opened) : this.setState({ opened: !opened });
    }

    private handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (e.key === ' ' || e.key === 'Enter') {
            this.toggleAccordion();
        }
    }

    isOpened = () => {
        return this.props.value !== undefined ? this.props.value : this.state.opened;
    }

    renderHeader = () => {
        const isAccordionOpened = this.isOpened();

        return (
            <div
                onKeyDown={ !this.props.isDisabled ? this.handleKeyDown : undefined }
                onClick={ !this.props.isDisabled ? this.toggleAccordion : undefined }
                tabIndex={ !this.props.isDisabled ? 0 : -1 }
                className={ cx(
                    uuiAccordion.toggler,
                    isAccordionOpened && uuiMod.opened,
                    this.props.isDisabled && uuiMod.disabled,
                ) }
                ref={ this.props.forwardedRef }
                { ...this.props.rawProps }
            >
                <div className={ cx(uuiAccordion.toggleContainer) }>
                    { this.props.renderTitle ?
                        this.props.renderTitle(this.state.opened) :
                        <div className={ cx(uuiAccordion.title) }>
                            { this.props.title }
                        </div>
                    }

                    { this.props.renderAdditionalItems?.(this.state.opened) }

                    { this.props.dropdownIcon !== null && (
                        <IconContainer
                            icon={ this.props.dropdownIcon }
                            flipY={ isAccordionOpened }
                            cx={ [this.props.isDisabled && uuiMod.disabled, css.arrow] }
                        />
                    ) }
                </div>
            </div>
        );
    }

    renderBody = () => (
        <div className={ uuiAccordion.body } role='region'>
            { this.props.children }
        </div>
    )

    render() {
        const isAccordionOpened = this.isOpened();

        return (
            <div
                aria-disabled={ this.props.isDisabled }
                aria-expanded={ isAccordionOpened }
                className={ cx(
                    css.container,
                    isAccordionOpened && !this.props.isDisabled && uuiMod.opened,
                    this.props.isDisabled && uuiMod.disabled,
                    this.props.cx,
                ) }>
                { this.renderHeader() }
                { this.props.children && isAccordionOpened ? this.renderBody() : null }
            </div>
        );
    }
}
