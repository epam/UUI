import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
    IHasCX, IDisableable, IEditable, IHasPlaceholder, uuiMod, uuiElement, uuiMarkers, ICanBeReadonly, IHasRawProps,
    CX, cx, ICanFocus,
} from '@epam/uui-core';
import css from './TextArea.module.scss';
import { browserBugFixDirAuto } from '../helpers';

export interface TextAreaProps
    extends IHasCX,
    IEditable<string>,
    IHasPlaceholder,
    IDisableable,
    ICanBeReadonly,
    IHasRawProps<React.TextareaHTMLAttributes<HTMLDivElement>>,
    ICanFocus<HTMLTextAreaElement> {
    /** Adjust height to fit specified number or text rows. HTML TextArea attribute. */
    rows?: number;
    /**
     * Enables auto-resizing height to fit text. Rows prop is ignored in this mode
     */
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
    /** Defines boolean state of element focus. */
    inFocus?: boolean;
}

export const TextArea = React.forwardRef<HTMLDivElement, TextAreaProps>((props, ref) => {
    const [state, setState] = useState<TextAreaState>({
        inFocus: false,
    });
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const prevValue = useRef(null);

    const getParentOverflows = (el: Element) => {
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
    };

    const updateHeight = () => {
        /* https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize */
        if (props.autoSize) {
            const node = textAreaRef.current;
            if (node) {
                const overflows = getParentOverflows(node);
                node.style.height = 'auto';
                const borderWidth = node.offsetHeight - node.clientHeight;
                node.style.height = node.scrollHeight + borderWidth + 'px';
                overflows.forEach((el) => {
                    el.node.scrollTop = el.scrollTop;
                });
            }
        }
    };

    useEffect(() => {
        // Delay auto-size hack to the next tick.
        // Helps with performance if there are many TextAreas on the page
        setTimeout(() => updateHeight(), 0);
    }, []);

    useEffect(() => {
        if (prevValue?.current !== props.value) {
            updateHeight();
        }
        prevValue.current = props.value;
    }, [props.value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // Android does not support maxLength
        // https://studysection.com/blog/the-html-maxlength-attribute-is-not-working-as-expected-on-android-phones/
        const targetValue = e.target.value;
        let newValue;
        if (props.maxLength && targetValue.length > props.maxLength) {
            newValue = targetValue.slice(0, props.maxLength);
        } else {
            newValue = targetValue;
        }

        props.onValueChange(newValue);
    };

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        props.onFocus && props.onFocus(e);
        setState(() => ({ inFocus: true }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        props.onBlur && props.onBlur(e);
        setState(() => ({ inFocus: false }));
    };

    const handleWrapperFocus = () => {
        textAreaRef.current?.focus();
    };

    return (
        <div
            className={ cx(css.container, uuiElement.inputBox, props.cx) }
            { ...props.rawProps }
            tabIndex={ -1 }
            onFocus={ handleWrapperFocus }
            ref={ ref }
        >
            <textarea
                autoFocus={ props.autoFocus }
                placeholder={ props.placeholder }
                className={ cx(
                    !props.isDisabled && uuiMarkers.clickable,
                    props.autoSize || props.isDisabled || props.isReadonly ? css.autoSize : css.noAutoSize,
                    uuiElement.input,
                    !props.isReadonly && state.inFocus && uuiMod.focus,
                    props.isDisabled && uuiMod.disabled,
                    props.isReadonly && uuiMod.readonly,
                    props.isInvalid && uuiMod.invalid,
                    props.inputCx,
                ) }
                rows={ props.rows != null ? props.rows : props.autoSize ? 1 : undefined }
                id={ props.id }
                readOnly={ props.isReadonly }
                aria-readonly={ props.isReadonly }
                required={ props.isRequired }
                disabled={ props.isDisabled }
                aria-disabled={ props.isDisabled }
                onChange={ handleChange }
                value={ props.value || '' }
                maxLength={ props.maxLength }
                onFocus={ handleFocus }
                onBlur={ handleBlur }
                ref={ textAreaRef }
                onKeyDown={ props.onKeyDown }
                tabIndex={ (state.inFocus || props.isReadonly || props.isDisabled) ? -1 : 0 }
                dir={ props.rawProps?.dir === 'auto'
                    ? browserBugFixDirAuto(props.value || props.placeholder)
                    : props?.rawProps?.dir } // TODO: remove after browser bug fix
            />
        </div>
    );
});
