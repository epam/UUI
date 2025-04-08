import { ICanBeReadonly, IClickable, IDisableable, IEditable, IHasCX, IHasIcon, IHasPlaceholder, IAnalyticableOnChange,
    IHasRawProps, ICanFocus, IHasTabIndex, IDropdownToggler,
} from '../props';
import * as React from 'react';

export interface TextInputCoreProps
    extends IHasCX,
    IClickable,
    IDisableable,
    IEditable<string | undefined>,
    IHasPlaceholder,
    IHasIcon,
    ICanBeReadonly,
    IDropdownToggler,
    IAnalyticableOnChange<string>,
    IHasRawProps<React.HTMLAttributes<HTMLInputElement>>,
    ICanFocus<HTMLInputElement>,
    IHasTabIndex {
    /** Enables cancel (cross) icon, and fires when the icon is clicked */
    onCancel?(): void;
    /** Enables accept (check) icon, and fires when the icon is clicked */
    onAccept?(): void;
    /** keydown event handler to put on the HTML input element */
    onKeyDown?(e?: React.KeyboardEvent<HTMLInputElement>): void;
    /** Put focus on the element, when component is mounted */
    autoFocus?: boolean;
    /** Standard 'type' attribute to put on the HTML input element (e.g. 'password') */
    type?: string;
    /** Standard [autocomplete attribute]{@link https://www.w3schools.com/tags/att_input_autocomplete.asp} */
    autoComplete?: string;
    /** Standard [name attribute]{@link https://www.w3schools.com/tags/att_input_name.asp} */
    name?: string;
    /** Maximum input length in characters */
    maxLength?: number;
    /** Standard [inputMode attribute]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode} */
    inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode'];
    /** HTML ID attribute for input */
    id?: string;
}
