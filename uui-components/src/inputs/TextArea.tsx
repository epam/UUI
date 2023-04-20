import * as React from 'react';
import {
    IHasCX,
    IDisableable,
    IEditable,
    IHasPlaceholder,
    uuiMod,
    uuiElement,
    uuiMarkers,
    ICanBeReadonly,
    IHasRawProps,
    IHasForwardedRef,
    CX,
    cx,
    ICanFocus,
} from '@epam/uui-core';
import css from './TextArea.scss';

export interface TextAreaProps
    extends IHasCX,
    IEditable<string>,
    IHasPlaceholder,
    IDisableable,
    ICanBeReadonly,
    IHasRawProps<React.TextareaHTMLAttributes<HTMLDivElement>>,
    IHasForwardedRef<HTMLDivElement>,
    ICanFocus<HTMLTextAreaElement> {
    /** Adjust height to fit specified number or text rows. HTML TextArea attribute. */
    rows?: number;
    /** Enables auto-resizing height to fit text. Rows prop is ignored in this mode */
    autoSize?: boolean;
    /** onKeyDown event handler to put on HTML Input  */
    onKeyDown?(e?: any): void;
    /** Automatically sets input focus to component, when its mounted */
    autoFocus?: boolean;
    /** CSS class names to put to the HTML Input element */
    inputCx?: CX;
    /** Maximum text length, in characters */
    maxLength?: number;
    /** HTML id attribute to put on the HTML Input element */
    id?: string;
}

interface TextAreaState {
    inFocus?: boolean;
}

export class TextArea extends React.Component<TextAreaProps, TextAreaState> {
    textAreaRef = React.createRef<HTMLTextAreaElement>();

    state = {
        inFocus: false,
    };

    getParentOverflows(el: Element) {
        const arr = [];

        while (el && el.parentNode && el.parentNode instanceof Element) {
            if (el.parentNode.scrollTop) {
                arr.push({
                    node: el.parentNode,
                    scrollTop: el.parentNode.scrollTop,
                });
            }
            el = el.parentNode;
        }

        return arr;
    }

    updateHeight() {
        /* https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize */
        if (this.props.autoSize) {
            const node = this.textAreaRef.current;
            if (node) {
                const overflows = this.getParentOverflows(node);
                node.style.height = 'auto';
                const borderWidth = node.offsetHeight - node.clientHeight;
                node.style.height = node.scrollHeight + borderWidth + 'px';
                overflows.forEach((el) => {
                    el.node.scrollTop = el.scrollTop;
                });
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
    };

    handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        this.props.onFocus && this.props.onFocus(e);
        this.setState({ inFocus: true });
    };

    handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        this.props.onBlur && this.props.onBlur(e);
        this.setState({ inFocus: false });
    };

    render() {
        return (
            <div className={ cx(css.container, uuiElement.inputBox, this.props.cx) } ref={ this.props.forwardedRef } { ...this.props.rawProps }>
                <textarea
                    autoFocus={ this.props.autoFocus }
                    placeholder={ this.props.placeholder }
                    className={ cx(
                        !this.props.isDisabled && uuiMarkers.clickable,
                        this.props.autoSize || this.props.isDisabled || this.props.isReadonly ? css.autoSize : css.noAutoSize,
                        uuiElement.input,
                        !this.props.isReadonly && this.state.inFocus && uuiMod.focus,
                        this.props.isDisabled && uuiMod.disabled,
                        this.props.isReadonly && uuiMod.readonly,
                        this.props.isInvalid && uuiMod.invalid,
                        this.props.inputCx,
                    ) }
                    rows={ this.props.rows != null ? this.props.rows : this.props.autoSize ? 1 : undefined }
                    id={ this.props.id }
                    readOnly={ this.props.isReadonly }
                    aria-readonly={ this.props.isReadonly }
                    required={ this.props.isRequired }
                    aria-required={ this.props.isRequired }
                    disabled={ this.props.isDisabled }
                    aria-disabled={ this.props.isDisabled }
                    onChange={ this.handleChange }
                    value={ this.props.value || '' }
                    maxLength={ this.props.maxLength }
                    onFocus={ this.handleFocus }
                    onBlur={ this.handleBlur }
                    ref={ this.textAreaRef }
                    onKeyDown={ this.props.onKeyDown }
                />
                {!this.props.isInvalid && this.props.maxLength && (
                    <div className={ cx(uuiElement.textareaCounter) }>{`${(this.props.value && this.props.value.length) || 0}/${this.props.maxLength}`}</div>
                )}
            </div>
        );
    }
}
