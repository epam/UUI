import { IEditable } from '../props';
import { IDropdownBodyProps } from '../props';
import { TableFiltersConfig } from '../tables';

export type IFilterItemBodyProps<TFilter> = TableFiltersConfig<TFilter> & IEditable<any> & IDropdownBodyProps & {
    /** Name of currently selected predicate */
    selectedPredicate?: string;
};
