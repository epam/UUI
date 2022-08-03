import { ReactElement, ReactNode } from "react";
import { Dayjs } from "dayjs";
import { Placement } from "@popperjs/core";
import { IAnalyticableOnChange, ICanBeReadonly, ICanFocus, IDisableable, IDropdownToggler, IEditable, IHasCX, IHasPlaceholder } from "../../props";

export interface BaseDatePickerProps extends IEditable<string | null>, ICanFocus<HTMLInputElement>, IHasCX, IDisableable, IHasPlaceholder, ICanBeReadonly, IAnalyticableOnChange<string> {
    format: string;
    filter?(day: Dayjs): boolean;
    renderTarget?(props: IDropdownToggler): ReactNode;
    iconPosition?: 'left' | 'right';
    disableClear?: boolean;
    renderDay?: (day: Dayjs, onDayClick: (day: Dayjs) => void) => ReactElement<Element>;
    isHoliday?: (day: Dayjs) => boolean;
    onBlur?: (e?: React.FocusEvent<HTMLInputElement>) => void;
    placement?: Placement;
}