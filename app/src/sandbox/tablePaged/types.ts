import { DataTableState, ITablePreset } from '@epam/uui-core';
import { Person } from '@epam/uui-docs';

type PersonTableRecord = Person;

type PersonTableFilter = Record<string, any>;

interface PersonsTableState extends DataTableState {
    isFolded?: boolean;
    presets?: ITablePreset[];
}

type ILocalStoragePresets = Omit<ITablePreset, 'isActive'>[];

export type {
    PersonTableRecord, PersonTableFilter, PersonsTableState, ILocalStoragePresets,
};
