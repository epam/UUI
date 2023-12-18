import { DataQueryFilter } from '@epam/uui-core';
import { Person, PersonEmploymentGroup, PersonLocationGroup } from '@epam/uui-docs';
import { UnboxGroupsFromUnion } from './useLazyDataSourceWithGrouping';

export type PersonTableRecord = Person | PersonEmploymentGroup | PersonLocationGroup;
export type PersonTableRecordType = PersonTableRecord['__typename'];

type GroupByLocation = 'country' | 'city';
type GroupByEmployment = 'jobTitle' | 'department';

export type PersonTableRecordId =
    ['PersonLocationGroup', GroupByLocation, string]
    | ['PersonEmploymentGroup', GroupByEmployment, number]
    | ['Person', undefined, number];

export type PersonGroupBy = {
    country: 'PersonLocationGroup';
    city: 'PersonLocationGroup';
    department: 'PersonEmploymentGroup';
    jobTitle: 'PersonEmploymentGroup';
};

export type PersonFilters = {
    Person: DataQueryFilter<Person>;
    PersonLocationGroup: DataQueryFilter<PersonLocationGroup>;
    PersonEmploymentGroup: DataQueryFilter<PersonEmploymentGroup>;
};

export type PersonTableFilter = DataQueryFilter<Person> & { groupBy?: Array<GroupByLocation | GroupByEmployment> };
export interface Grouping {
    id: string;
    name: string;
}

export type PersonTableGroups = UnboxGroupsFromUnion<'__typename', PersonTableRecord>;
export type PersonTableIdGroups = {
    [K in keyof PersonTableGroups]: PersonTableGroups[K]['id'];
};
