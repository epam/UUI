import { ReactNode, HTMLAttributes  } from "react";
import { IHasRawProps } from "../../props";
import { BaseDatePickerProps } from "./BaseDatePicker";

export interface DatePickerCoreProps extends BaseDatePickerProps {
    /** render prop to add a custom footer inside the DatePicker dropdown body */
    renderFooter?(): ReactNode;
    /** HTML attributes to put on various elements of the component (input, body) */
    rawProps?: {
        input?: IHasRawProps<HTMLAttributes<HTMLDivElement>>['rawProps'];
        body?: IHasRawProps<HTMLAttributes<HTMLDivElement>>['rawProps'];
    };
}