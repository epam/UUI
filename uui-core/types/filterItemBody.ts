import { IDataSource } from "../data";
import { IDropdownBodyProps } from "./props";


export type IFilterItemBodyProps<TFilter extends Record<string, any>> = & {
    title: string;
    type: "singlePicker" | "multiPicker" | "datePicker" | "rangeDatePicker";
    dropdownProps?: IDropdownBodyProps;
    onValueChange: (value: any) => void;
    value: any;
    dataSource?: IDataSource<any, any, any>;
};