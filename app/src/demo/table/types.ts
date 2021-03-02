import { DataQueryFilter } from '@epam/uui';
import { Person, PersonGroup } from '@epam/uui-docs';

type PersonTableRecord = Person | PersonGroup;

type PersonTableRecordId = [PersonTableRecord['__typename'], string | number];

type PersonTableFilter = DataQueryFilter<Person> & { groupBy?: string };

export { PersonTableRecord, PersonTableRecordId, PersonTableFilter };