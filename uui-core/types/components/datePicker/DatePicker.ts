import { ReactNode } from "react";
import { IHasRawProps } from "../../props";
import { BaseDatePickerProps } from "./BaseDatePicker";

export interface DatePickerCoreProps extends BaseDatePickerProps {
    renderFooter?(): ReactNode;
    rawProps?: {
        input?: IHasRawProps<HTMLDivElement>['rawProps'];
        body?: IHasRawProps<HTMLDivElement>['rawProps'];
    };
}