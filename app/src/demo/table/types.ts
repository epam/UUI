import { DataQueryFilter, DataSourceState, IDataSource } from '@epam/uui';
import { Person, PersonGroup } from '@epam/uui-docs';

type PersonTableRecord = Person | PersonGroup;

type PersonTableRecordId = [PersonTableRecord['__typename'], string | number];

type PersonTableFilter = DataQueryFilter<Person> & { groupBy?: string };

interface ITableFilter<> {
    title: string;
    key: string;
    field?: string;
    selectionMode: 'single' | 'multi';
    dataSource: IDataSource<any, any, any>;
}

interface PersonsTableState extends DataSourceState {
    isFolded?: boolean;
}

export { PersonTableRecord, PersonTableRecordId, PersonTableFilter, ITableFilter, PersonsTableState };