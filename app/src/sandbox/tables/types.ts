import { DataQueryFilter } from '@epam/uui-core';
import { Person, PersonGroup, Location } from '@epam/uui-docs';
import { DataSourceState, LazyDataSourceApiResponse } from '@epam/uui-core';

export type PersonTableRecord = Person | PersonGroup | Location;

export type PersonTableRecordType = PersonTableRecord['__typename'];

export type PersonTableRecordId = [PersonTableRecordType, string | number];

export type PersonTableId = [];

export type PersonTableFilter = DataQueryFilter<Person> & { groupBy?: string };

export interface PersonsTableState extends DataSourceState {
    isFolded?: boolean;
}

export interface PersonsApiResponse extends LazyDataSourceApiResponse<Person | PersonGroup> {
    summary: PersonsSummary;
    totalCount: number;
}

export interface PersonsSummary extends Pick<PersonsApiResponse, 'totalCount'> {
    totalSalary: string;
}
