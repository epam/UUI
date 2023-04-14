import { DataQueryFilter } from '@epam/uui-core';
import { Person, PersonGroup, Location } from '@epam/uui-docs';

export type PersonTableRecord = Person | PersonGroup | Location;

export type PersonTableRecordType = PersonTableRecord['__typename'];

export type PersonTableRecordId = [PersonTableRecordType, string | number];

export type PersonTableId = [];

export type PersonTableFilter = DataQueryFilter<Person> & { groupBy?: string };
