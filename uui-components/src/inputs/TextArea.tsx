import * as React from 'react';
import * as css from './TextArea.scss';
import cx from 'classnames';
import { IHasCX, IDisableable, IEditable, IHasPlaceholder, uuiMod, uuiElement, uuiMarkers, ICanBeReadonly, CX } from '@epam/uui';

export interface TextAreaProps extends IHasCX, IEditable<string>, IHasPlaceholder, IDisableable, ICanBeReadonly {
    rows?: number;
    autoSize?: boolean;
    onBlur?(e?: any): void;
    onFocus?(e?: any): void;
    onKeyDown?(e?: any): void;
    autoFocus?: boolean;
    inputCx?: CX;
    maxLength?: number;
}

interface TextAreaState {
    inFocus?: boolean;
}

export class TextArea extends React.Component<TextAreaProps, TextAreaState> {
    textAreaRef = React.createRef<HTMLTextAreaElement>();

    state = {
        inFocus: false,
    };

    updateHeight() {
        /* https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize */
        if (this.props.autoSize) {
            const node = this.textAreaRef.current;
            if (node) {
                node.style.height = 'auto';
                const borderWidth = node.offsetHeight - node.clientHeight;
                node.style.height = node.scrollHeight + borderWidth + 'px';
            }
        }
    }

    componentDidMount() {
        // Delay auto-size hack to the next tick.
        // Helps with performance if there are many TextAreas on the page
        setTimeout(() => this.updateHeight(), 0);
    }

    componentDidUpdate(prevProps: TextAreaProps) {
        if (prevProps.value !== this.props.value) {
            this.updateHeight();
        }
    }

    handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.props.onValueChange(e.target.value);
    }

    handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        this.props.onFocus && this.props.onFocus(e);
        this.setState({ inFocus: true });
    }

    handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        this.props.onBlur && this.props.onBlur(e);
        this.setState({ inFocus: false });
    }

    render () {
        return (
            <div className={ cx(css.container, uuiElement.inputBox, this.props.cx) }>
                <textarea
                    autoFocus={ this.props.autoFocus }
                    placeholder={ this.props.placeholder }
                    className={ cx(
                        !this.props.isDisabled && uuiMarkers.clickable,
                        (this.props.autoSize || this.props.isDisabled || this.props.isReadonly) ? css.autoSize : css.noAutoSize,
                        uuiElement.input,
                        (!this.props.isReadonly && this.state.inFocus) && uuiMod.focus,
                        this.props.isDisabled && uuiMod.disabled,
                        this.props.isReadonly && uuiMod.readonly,
                        this.props.isInvalid && uuiMod.invalid,
                        this.props.inputCx,
                    ) }
                    rows={ this.props.rows != null
                            ? this.props.rows
                            : this.props.autoSize ? 1 : undefined
                    }
                    disabled={ this.props.isDisabled }
                    readOnly={ this.props.isReadonly }
                    onChange={ this.handleChange }
                    value={ this.props.value || "" }
                    maxLength={ this.props.maxLength }
                    onFocus={ this.handleFocus }
                    onBlur={ this.handleBlur }
                    ref={ this.textAreaRef }
                    onKeyDown={ this.props.onKeyDown }
                />
                {
                    !this.props.isInvalid &&
                    this.props.maxLength &&
                    <div className={ cx(uuiElement.textareaCounter) }>
                        {
                            `${(this.props.value && this.props.value.length) || 0}/${this.props.maxLength}` }
                    </div> }
            </div>
        );
    }
}
