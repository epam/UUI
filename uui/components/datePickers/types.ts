import type { IDisableable, IHasCX, IHasRawProps, RangeDatePickerPresets, DayProps } from '@epam/uui-core';
import type { Dayjs } from '../../helpers/dayJsHelper';

export interface CommonDatePickerBodyProps extends IHasCX, IDisableable, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    filter?(day: Dayjs): boolean;
    presets?: RangeDatePickerPresets;
    renderDay?: (renderProps: DayProps) => React.ReactElement<Element>;
}
