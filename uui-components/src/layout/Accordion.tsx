import React from 'react';
import { IHasCX, IDisableable, uuiMod, IHasChildren, Icon, IEditable } from '@epam/uui';
import { IconContainer } from '../layout';
import * as css from './Accordion.scss';
import cx from 'classnames';

export interface AccordionProps extends Partial<IEditable<boolean>>, IHasCX, IDisableable, IHasChildren {
    title: string;
    dropdownIcon?: Icon;
}

export interface AccordionState {
    opened: boolean;
}

const uuiAccordion: Record<string, string> = {
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

    isOpened = () => {
        return this.props.value !== undefined ? this.props.value : this.state.opened;
    }

    renderHeader = () => {
        const isAccordionOpened = this.isOpened();

        return (
            <div className={ cx(
                uuiAccordion.toggler,
                isAccordionOpened && uuiMod.opened,
                this.props.isDisabled && uuiMod.disabled,
            ) }
                 onClick={ !this.props.isDisabled ? this.toggleAccordion : undefined }>
                <div className={ cx(uuiAccordion.toggleContainer) }>
                    <div className={ cx(uuiAccordion.title) }>
                        { this.props.title }
                    </div>
                    <div className={ css.spacer } />
                    <IconContainer
                        icon={ this.props.dropdownIcon }
                        flipY={ isAccordionOpened }
                        cx={ this.props.isDisabled && uuiMod.disabled }
                    />
                </div>
            </div>
        );
    }

    renderBody = () => (
        <div className={ uuiAccordion.body }>
            { this.props.children }
        </div>
    )

    render() {
        const isAccordionOpened = this.isOpened();

        return (
            <div className={ cx(
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
