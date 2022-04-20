import { IHasRawProps } from "../../props";
import { BaseRangeDatePickerProps } from "./BaseRangeDatePicker";

export type RangeDatePickerInputType = 'from' | 'to';

export interface RangeDatePickerCoreProps extends BaseRangeDatePickerProps {
    getPlaceholder?(type: RangeDatePickerInputType): string;
    rawProps?: {
        from?: IHasRawProps<HTMLDivElement>['rawProps'];
        to?: IHasRawProps<HTMLDivElement>['rawProps'];
        body?: IHasRawProps<HTMLDivElement>['rawProps'];
    };
}