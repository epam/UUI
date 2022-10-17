import { IHasRawProps } from "../../props";
import { BaseRangeDatePickerProps } from "./BaseRangeDatePicker";

export type RangeDatePickerInputType = 'from' | 'to';

export interface RangeDatePickerCoreProps extends BaseRangeDatePickerProps {
    getPlaceholder?(type: RangeDatePickerInputType): string;
    rawProps?: {
        from?: IHasRawProps<React.ReactHTMLElement<HTMLDivElement>>['rawProps'];
        to?: IHasRawProps<React.ReactHTMLElement<HTMLDivElement>>['rawProps'];
        body?: IHasRawProps<React.ReactHTMLElement<HTMLDivElement>>['rawProps'];
    };
}