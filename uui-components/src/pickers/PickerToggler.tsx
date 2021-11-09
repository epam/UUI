import * as React from 'react';
import { isChildFocusable, IPickerToggler, IHasIcon, IHasCX, ICanBeReadonly, Icon, uuiMod, uuiElement, uuiMarkers, DataRowProps, closest, cx, IHasRawProps, isChildHasClass } from "@epam/uui";
import { IconContainer } from '../layout';
import * as css from './PickerToggler.scss';
import { i18n } from "../../i18n";

export interface PickerTogglerProps<TItem, TId = any> extends IPickerToggler<TItem, TId>, IHasIcon, IHasCX, ICanBeReadonly, IHasRawProps<HTMLElement>, React.PropsWithRef<any> {
    cancelIcon?: Icon;
    dropdownIcon?: Icon;
    autoFocus?: boolean;
    renderItem?(props: DataRowProps<TItem, TId>): React.ReactNode;
    getName?: (item: DataRowProps<TItem, TId>) => string;
    entityName?: string;
    maxItems?: number;
    isSingleLine?: boolean;
    pickerMode: 'single' | 'multi';
    searchPosition: 'input' | 'body' | 'none';
    onKeyDown?(e: React.KeyboardEvent<HTMLElement>): void;
    onBlur?(e: React.FocusEvent<HTMLElement>): void;
    onFocus?(e?: React.FocusEvent<HTMLElement>): void;
    disableSearch?: boolean;
    disableClear?: boolean;
    minCharsToSearch?: number;
    inputId?: string;
}

interface PickerTogglerState {
    inFocus?: boolean;
    isActive?: boolean;
}

export class PickerToggler<TItem, TId> extends React.Component<PickerTogglerProps<TItem, TId>, PickerTogglerState> {
    state = {
        inFocus: false,
        isActive: false,
    };

    toggleContainer: HTMLDivElement | null = null;

    componentDidMount() {
        window.document.addEventListener('click', this.handleActive);
        if (this.props.autoFocus && !this.props.disableSearch) {
            this.handleFocus();
        }
    }

    componentWillUnmount() {
        window.document.removeEventListener('click', this.handleActive);
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onValueChange && this.props.onValueChange(e.target.value);
    }

    handleFocus = (e?: React.FocusEvent<HTMLInputElement>) => {
        this.props.onFocus && this.props.onFocus(e);
        this.updateFocus(true);
        this.toggleContainer.querySelector('input')?.focus();
    }

    handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        this.props.onBlur && this.props.onBlur(e);
        this.updateFocus(false);
        this.toggleContainer.querySelector('input')?.blur();

        const isPickerChildTriggerBlur = isChildFocusable(e) || closest((e.relatedTarget as HTMLElement), this.toggleContainer);
        const shouldCloseOnBlur = this.props.isOpen && this.props.searchPosition !== 'body' && !isPickerChildTriggerBlur;

        if (shouldCloseOnBlur) {
            this.props.toggleDropdownOpening(false);
        }
    }

    handleActive = (e: Event) => {
        if (closest((e.target as HTMLElement), this.toggleContainer)) {
            this.setState({ isActive: true });
        }
        if (this.state.isActive && !closest((e.target as HTMLElement), this.toggleContainer)) {
            this.setState({ isActive: false });
        }
    }

    updateFocus = (value: boolean) => {
        this.setState({ ...this.state, inFocus: value });
    }

    handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        this.props.onKeyDown && this.props.onKeyDown(e);
    }

    handleCrossIconClick = (e: React.SyntheticEvent<HTMLElement>) => {
        if (this.props.onClear) {
            this.props.onClear();
            this.props.onValueChange('');
        }
        e.stopPropagation();
    }

    renderItems() {
        let maxItems = (this.props.maxItems || this.props.maxItems === 0) ? this.props.maxItems : 100;
        if (this.props.selection && this.props.selection.length > maxItems) {
            let item = {
                value: i18n.pickerToggler.createItemValue(this.props.selection.length, this.props.entityName || ''),
                onCheck: () => this.props.onClear && this.props.onClear(),
            };
            return this.props.renderItem && this.props.renderItem(item as any);
        } else {
            return this.props.selection && this.props.selection.map(row => this.props.renderItem && this.props.renderItem(row));
        }
    }

    renderInput() {
        const isActivePlaceholder = this.props.pickerMode === 'single' && this.props.selection && !!this.props.selection[0];
        const placeholder = isActivePlaceholder ? this.props.getName(this.props.selection[0]) : this.props.placeholder;
        const value = this.props.disableSearch ? null : this.props.value;

        if (this.props.disableSearch && this.props.pickerMode === 'multi' && this.props.selection.length > 0) {
            return null;
        }

        return <input
            type='text'
            tabIndex={ -1 }
            aria-haspopup={ true }
            id={ this.props.inputId }
            autoComplete='no'
            aria-required={ this.props.isRequired }
            aria-disabled={ this.props.isDisabled }
            aria-readonly={ this.props.isReadonly }
            className={ cx(
                uuiElement.input,
                this.props.pickerMode === 'single' && css.singleInput,
                isActivePlaceholder && (!this.state.inFocus || this.props.isReadonly) && uuiElement.placeholder)
            }
            disabled={ this.props.isDisabled }
            placeholder={ placeholder }
            value={ value || '' }
            readOnly={ this.props.isReadonly || this.props.disableSearch }
            onChange={ this.handleChange }
        />;
    }

    togglerPickerOpened = (e: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLInputElement>) => {
        if (this.props.isDisabled || this.props.isReadonly) {
            return;
        }

        e.preventDefault();
        if (this.state.inFocus && this.props.value && !this.props.disableSearch) return;
        this.props.onClick();
    }

    render() {
        const icon = this.props.icon && <IconContainer icon={ this.props.icon } onClick={ this.props.onIconClick } />;

        return (
            <div
                onClick={ this.togglerPickerOpened }
                ref={ el => this.toggleContainer = el }
                className={ cx(css.container,
                    uuiElement.inputBox,
                    this.props.isDisabled && uuiMod.disabled,
                    this.props.isReadonly && uuiMod.readonly,
                    this.props.isInvalid && uuiMod.invalid,
                    (!this.props.isReadonly && !this.props.isDisabled && this.props.onClick) && uuiMarkers.clickable,
                    (!this.props.isReadonly && !this.props.isDisabled && this.state.inFocus) && uuiMod.focus,
                    (!this.props.isReadonly && !this.props.isDisabled && this.state.isActive) && uuiMod.active,
                    this.props.cx,
                ) }
                tabIndex={ this.state.inFocus ? -1 : 0 }
                onFocus={ this.handleFocus }
                onBlur={ this.handleBlur }
                onKeyDown={ this.handleKeyDown }
                { ...this.props.rawProps }
            >
                <div className={ cx(css.body, !this.props.isSingleLine && this.props.pickerMode !== 'single' && css.multiline) }>
                    { this.props.iconPosition !== 'right' && icon }
                    { this.props.pickerMode !== 'single' && this.renderItems() }
                    { this.renderInput() }
                    { this.props.iconPosition === 'right' && icon }
                </div>
                <div className={ cx(css.actions) }>
                    { !this.props.disableClear && (this.props.value || this.props.selection && this.props.selection.length > 0) && <IconContainer
                        cx={ cx('uui-icon-cancel', uuiMarkers.clickable) }
                        isDisabled={ this.props.isDisabled }
                        icon={ this.props.cancelIcon }
                        tabIndex={ -1 }
                        onClick={ this.handleCrossIconClick }
                    /> }
                    { this.props.isDropdown && <IconContainer
                        icon={ this.props.dropdownIcon }
                        flipY={ this.props.isOpen }
                        cx={ 'uui-icon-dropdown' }
                    /> }
                </div>
            </div>
        );
    }
}
