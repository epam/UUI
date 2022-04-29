import { ICanBeReadonly, IClickable, IDisableable, IDropdownToggler, IEditable, IHasCX, IHasIcon, IHasPlaceholder, IAnalyticableOnChange, IHasRawProps, ICanFocus } from "../props";

export interface TextInputCoreProps extends IHasCX, IClickable, IDisableable, IEditable<string | undefined>, IHasPlaceholder,
    IHasIcon, ICanBeReadonly, IDropdownToggler, IAnalyticableOnChange<string>, IHasRawProps<HTMLDivElement>, ICanFocus<HTMLInputElement> {
    onCancel?(): void;
    onAccept?(): void;
    onKeyDown?(e?: any): void;
    autoFocus?: boolean;
    type?: string;
    autoComplete?: string;
    name?: string;
    maxLength?: number;
    inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode'];
    tabIndex?: number;
    id?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
}