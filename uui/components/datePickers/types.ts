import { IDisableable, IHasCX, IHasRawProps } from '@epam/uui-core';
import { DayProps, RangeDatePickerPresets } from '@epam/uui-components';
import type { Dayjs } from '../../helpers/dayJsHelper';

/**
 * Represents RangeDatePicker value
*/
export type RangeDatePickerValue = {
    /**
     * Defines DatePicker value 'from'.
     */
    from: string | null;
    /**
     * Defines DatePicker value 'to'.
     */
    to: string | null;
};

/**
 * Represents RangeDatePicker input type
 */
export type RangeDatePickerInputType = 'from' | 'to' | null;

export interface CommonDatePickerBodyProps extends IHasCX, IDisableable, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    filter?(day: Dayjs): boolean;
    presets?: RangeDatePickerPresets;
    renderDay?: (renderProps: DayProps) => React.ReactElement<Element>;
}

export type ViewType = 'DAY_SELECTION' | 'MONTH_SELECTION' | 'YEAR_SELECTION';

/**
 * Represents date picker body value
 */
export interface RangeDatePickerBodyValue<TSelection> {
    /**
     * Currently setting date
     */
    inFocus: RangeDatePickerInputType;
    /**
     * Date currently set
     */
    selectedDate: TSelection;
}
