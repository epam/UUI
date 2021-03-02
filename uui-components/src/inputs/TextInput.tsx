import * as React from 'react';
import cx from 'classnames';
import * as css from './TextInput.scss';
import { Icon, uuiMod, uuiElement, uuiMarkers, CX, TextInputCoreProps, uuiContextTypes, UuiContexts } from '@epam/uui';
import { IconContainer } from '../layout';

export interface TextInputProps extends TextInputCoreProps {
    acceptIcon?: Icon;
    cancelIcon?: Icon;
    dropdownIcon?: Icon;
    inputCx?: CX;
}

interface TextInputState {
    inFocus?: boolean;
}

export class TextInput extends React.Component<TextInputProps, TextInputState> {
    static contextTypes = uuiContextTypes;
    context: UuiContexts;

    state = {
        inFocus: false,
    };

    inputElement: Element | null = null;
    inputContainer: Element | null = null;

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onValueChange(e.target.value);

        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(e.target.value, this.props.value);
            this.context.uuiAnalytics.sendEvent(event);
        }
    }

    handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        this.props.onKeyDown && this.props.onKeyDown(e);
        if (e.keyCode === 13) {
            this.props.onAccept && this.props.onAccept();
        } else if (e.keyCode === 27) {
            this.props.onCancel && this.props.onCancel();
        }
    }

    handleFocus = () => {
        this.setState({inFocus: true});
        this.props.onFocus && this.props.onFocus();
    }

    handleBlur = (e: React.SyntheticEvent<HTMLElement>) => {
        this.props.onBlur && !this.props.isReadonly && this.props.onBlur(e);
        this.setState({inFocus: false});
    }

    public focus() {
        this.inputElement && (this.inputElement as any).focus();
    }

    handleClick = (e: any) => {
        if (e.target.classList.contains(uuiMarkers.clickable)) {
            return e.preventDefault();
        }
        this.props.onClick && this.props.onClick(e);
    }

    render() {
        let icon = this.props.icon && <IconContainer icon={ this.props.icon } onClick={ this.props.onIconClick }/>;

        return (
            <div onClick={ this.props.onClick && this.handleClick } ref={ el => {
                this.inputContainer = el;
            } } className={
                cx(
                    css.container,
                    uuiElement.inputBox,
                    this.props.isDisabled && uuiMod.disabled,
                    this.props.isReadonly && uuiMod.readonly,
                    this.props.isInvalid && uuiMod.invalid,
                    (!this.props.isReadonly && !this.props.isDisabled) && uuiMarkers.clickable,
                    (!this.props.isReadonly && this.state.inFocus) && uuiMod.focus,
                    this.props.cx,
                ) }
                 onFocus={ this.handleFocus }
                 onBlur={ this.handleBlur }
                 tabIndex={ -1 }
            >
                { this.props.iconPosition !== 'right' && icon }
                <input
                    type={ this.props.type || "text" }
                    className={ cx(uuiElement.input, this.props.inputCx) }
                    disabled={ this.props.isDisabled }
                    placeholder={ this.props.placeholder }
                    value={ this.props.value || '' }
                    readOnly={ this.props.isReadonly }
                    onKeyDown={ this.handleKeyDown }
                    onChange={ this.handleChange }
                    autoFocus={ this.props.autoFocus }
                    ref={ ref => this.inputElement = ref }
                    autoComplete={ this.props.autoComplete }
                    name={ this.props.name }
                    maxLength={ this.props.maxLength }
                />
                { this.props.onAccept && <IconContainer
                    cx={ cx('uui-icon-accept', (this.props.isReadonly || this.props.isDisabled) && css.hidden) }
                    isDisabled={ this.props.isDisabled || !this.props.value }
                    icon={ this.props.acceptIcon }
                    onClick={ this.props.value ? this.props.onAccept : undefined }
                /> }
                { this.props.onCancel && <IconContainer
                    cx={ cx('uui-icon-cancel', uuiMarkers.clickable, (this.props.isReadonly || this.props.isDisabled) && css.hidden) }
                    isDisabled={ this.props.isDisabled }
                    icon={ this.props.cancelIcon }
                    onClick={ this.props.onCancel }
                /> }
                { this.props.iconPosition === 'right' && icon }
                { this.props.isDropdown && <IconContainer
                    cx={ cx((this.props.isReadonly || this.props.isDisabled) && css.hidden, uuiMarkers.clickable) }
                    icon={ this.props.dropdownIcon }
                    flipY={ this.props.isOpen }
                /> }
            </div>
        );
    }
}