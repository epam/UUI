import { ICanBeReadonly, IClickable, IDisableable, IDropdownToggler, IEditable, IHasCX, IHasIcon, IHasPlaceholder, IAnalyticableOnChange } from "../props";

export interface TextInputCoreProps extends IHasCX, IClickable, IDisableable, IEditable<string>, IHasPlaceholder,
    IHasIcon, ICanBeReadonly, IDropdownToggler, IAnalyticableOnChange<string> {
    onCancel?(): void;
    onAccept?(): void;
    onKeyDown?(e?: any): void;
    onFocus?(e?: any): void;
    onBlur?(e?: any): void;
    autoFocus?: boolean;
    type?: string;
    autoComplete?: string;
    name?: string;
    maxLength?: number;
};