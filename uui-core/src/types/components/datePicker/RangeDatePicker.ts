import { IHasRawProps } from '../../props';
import { BaseRangeDatePickerProps } from './BaseRangeDatePicker';

export type RangeDatePickerInputType = 'from' | 'to';

export interface RangeDatePickerCoreProps extends BaseRangeDatePickerProps {
    getPlaceholder?(type: RangeDatePickerInputType): string;
    rawProps?: {
        from?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        to?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        body?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
    };
}
