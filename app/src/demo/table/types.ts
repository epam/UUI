import { DataSourceState, IDataSource } from '@epam/uui';
import { Person, PersonGroup } from '@epam/uui-docs';

type PersonTableRecord = Person | PersonGroup;

type PersonTableRecordId = [PersonTableRecord['__typename'], string | number];

// type PersonTableFilter = DataQueryFilter<Person> & { groupBy?: string };
type PersonTableFilter = { [key: string]: any, groupBy?: string };

interface ITableFilter<> {
    title: string;
    id: string;
    field?: string;
    selectionMode: 'single' | 'multi';
    dataSource: IDataSource<any, any, any>;
}

interface PersonsTableState extends DataSourceState {
    isFolded?: boolean;
}

export { PersonTableRecord, PersonTableRecordId, PersonTableFilter, ITableFilter, PersonsTableState };