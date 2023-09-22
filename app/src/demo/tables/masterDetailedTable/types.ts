import { DataQueryFilter } from '@epam/uui-core';
import { Person, PersonGroup, Location } from '@epam/uui-docs';
import { UnboxGroupsFromUnion } from './useLazyDataSourceWithGrouping';

export type PersonTableRecord = Person | PersonGroup | Location;
export type PersonTableRecordType = PersonTableRecord['__typename'];
type GroupBy = 'jobTitle' | 'department' | 'location';
export type PersonTableRecordId = [PersonTableRecordType, GroupBy, string | number];
export type PersonTableFilter = DataQueryFilter<Person> & { groupBy?: GroupBy | GroupBy[] };
export interface Grouping {
    id: string;
    name: string;
}

export type PersonTableGroups = UnboxGroupsFromUnion<'__typename', PersonTableRecord>;
export type PersonTableIdGroups = {
    [K in keyof PersonTableGroups]: PersonTableGroups[K]['id'];
};
