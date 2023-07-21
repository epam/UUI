import { IEditable } from '../props';
import { IDropdownBodyProps } from '../pickers';
import { TableFiltersConfig } from '../tables';

export type IFilterItemBodyProps<TFilter> = TableFiltersConfig<TFilter> &
IEditable<any> &
IDropdownBodyProps & {
    selectedPredicate?: string;
    onClose?: () => void;
    showSearch?: boolean;
};
