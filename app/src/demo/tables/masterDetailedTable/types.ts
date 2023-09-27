import { DataQueryFilter } from '@epam/uui-core';
import { Person, PersonGroup, Location } from '@epam/uui-docs';
import { UnboxGroupsFromUnion } from './useLazyDataSourceWithGrouping';

export type PersonTableRecord = Person | PersonGroup | Location;
export type PersonTableRecordType = PersonTableRecord['__typename'];

export type PersonTableRecordId =
    ['Location', 'location', string]
    | ['PersonGroup', 'jobTitle' | 'department', number]
    | ['Person', undefined, number];

export type PersonGroupBy = {
    location: 'Location';
    department: 'PersonGroup';
    jobTitle: 'PersonGroup';
};

export type PersonTableFilter = {
    Person: DataQueryFilter<Person> & { groupBy?: 'location' | 'jobTitle' | 'department' };
    Location: DataQueryFilter<Location>;
    PersonGroup: DataQueryFilter<PersonGroup> & { groupBy?: 'jobTitle' | 'department' };
};

export interface Grouping {
    id: string;
    name: string;
}

export type PersonTableGroups = UnboxGroupsFromUnion<'__typename', PersonTableRecord>;
export type PersonTableIdGroups = {
    [K in keyof PersonTableGroups]: PersonTableGroups[K]['id'];
};
