import { ReactElement, ReactNode } from "react";
import { Dayjs } from "dayjs";
import { Placement } from "@popperjs/core";
import { IAnalyticableOnChange, ICanBeReadonly, IDisableable, IDropdownToggler, IEditable, IHasCX } from "../../props";

export interface RangeDatePickerValue {
    from: string | null;
    to: string | null;
}

export type RangeDatePickerPresets = {
    [key: string]: {
        name: string,
        getRange: () => RangeDatePickerPresetValue,
    },
};

export type RangeDatePickerPresetValue = {
    from: string,
    to: string,
    order?: number,
};

export interface BaseRangeDatePickerProps extends IEditable<RangeDatePickerValue>, IHasCX, IDisableable, ICanBeReadonly, IAnalyticableOnChange<RangeDatePickerValue> {
    format?: string;
    filter?(day: Dayjs): boolean;
    renderTarget?(props: IDropdownToggler): ReactNode;
    renderFooter?(value: RangeDatePickerValue): ReactNode;
    renderDay?: (day: Dayjs, onDayClick: (day: Dayjs) => void) => ReactElement<Element>;
    presets?: RangeDatePickerPresets;
    disableClear?: boolean;
    placement?: Placement;
    isHoliday?: (day: Dayjs) => boolean;
}