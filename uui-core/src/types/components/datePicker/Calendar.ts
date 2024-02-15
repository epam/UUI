import { Dayjs } from 'dayjs';
import { HTMLAttributes, ReactElement } from 'react';
import { CX } from '../../objects';
import { IHasCX, IHasRawProps, IHasForwardedRef } from '../../props';
import { DayProps } from './Day';

/** Represents the properties of the Calendar component. */
export interface CalendarProps<TSelection> extends IHasCX, IHasRawProps<HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    value?: TSelection;
    onValueChange: (day: Dayjs) => void;
    month: Dayjs;
    renderDay?: (renderProps: DayProps) => ReactElement<Element>;
    filter?(day: Dayjs): boolean;
    hideAnotherMonths?: boolean;
    cx?: CX;
    isHoliday?: (day: Dayjs) => boolean;
}
