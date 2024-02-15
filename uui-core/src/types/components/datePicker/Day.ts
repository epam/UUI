import { Dayjs } from 'dayjs';
import { CX } from '../../objects';
import { IEditable, IHasRawProps, IHasForwardedRef } from '../../props';

/** Represents the properties of the Day component. */
export interface DayProps extends IEditable<Dayjs>, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    filter?(day: Dayjs): boolean;
    cx?: CX;
    renderDayNumber?: (param: Dayjs) => any;
    isSelected?: boolean;
    isHoliday?: boolean;
}
