import { ColumnsConfig, DataSourceState, DataTableState, IDataSource } from '@epam/uui';
import { Person, PersonGroup } from '@epam/uui-docs';

type PersonTableRecord = Person | PersonGroup;

type PersonTableRecordId = [PersonTableRecord['__typename'], string | number];

// type PersonTableFilter = DataQueryFilter<Person> & { groupBy?: string };
type PersonTableFilter = { [key: string]: any, groupBy?: string };

// field: string; вместо id
// filterKey(key): string;
interface ITableFilter {
    title: string;
    id: string; // key
    field?: string; // columnKey
    type: 'singlePicker' | 'multiPicker' | 'datePicker' | 'rangeDatePicker';
    dataSource: IDataSource<any, any, any>;
}

interface PersonsTableState extends DataTableState {
    isFolded?: boolean;
}

interface ITablePreset {
    name: string;
    id: number | null;
    filter: PersonTableFilter;
    isReadonly?: boolean;
    columnsConfig: ColumnsConfig;
}

type ILocalStoragePresets = (Omit<ITablePreset, "isActive">)[];

export { PersonTableRecord, PersonTableRecordId, PersonTableFilter, ITableFilter, PersonsTableState, ITablePreset, ILocalStoragePresets };