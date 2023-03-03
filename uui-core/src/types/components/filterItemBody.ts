import { IDropdownBodyProps, IEditable } from "../props";
import { TableFiltersConfig } from '../tables';

export type IFilterItemBodyProps<TFilter> = TableFiltersConfig<TFilter> & IEditable<any> & IDropdownBodyProps & {
    selectedPredicate?: string;
    onClose?: () => void;
};