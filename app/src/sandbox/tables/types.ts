import { DataQueryFilter } from '@epam/uui';
import { Person, PersonGroup, Location } from '@epam/uui-docs';

export type PersonTableRecord = Person | PersonGroup | Location;

export type PersonTableRecordId = [PersonTableRecord['__typename'], string | number];

export type PersonTableId = []

export type PersonTableFilter = DataQueryFilter<Person> & { groupBy?: string }
