import { DataQueryFilter, IDataSource } from '@epam/uui';
import { Person, PersonGroup } from '@epam/uui-docs';

type PersonTableRecord = Person | PersonGroup;

type PersonTableRecordId = [PersonTableRecord['__typename'], string | number];

type PersonTableFilter = DataQueryFilter<Person> & { groupBy?: string };

interface ITableFilter<> {
    title: string;
    key: string;
    field?: string;
    type: 'single' | 'multi';
    dataSource: IDataSource<any, any, any>;
}

export { PersonTableRecord, PersonTableRecordId, PersonTableFilter, ITableFilter };