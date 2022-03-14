import { ICanBeInvalid, ICanBeReadonly, ICheckable, IHasCX, IHasLabel, IAnalyticableOnChange, IHasRawProps, IHasForwardedRef } from "../props";

export interface CheckboxCoreProps extends ICheckable, IHasCX, ICanBeInvalid, IHasLabel, ICanBeReadonly, IAnalyticableOnChange<boolean>, IHasRawProps<HTMLLabelElement>, IHasForwardedRef<HTMLLabelElement> {}