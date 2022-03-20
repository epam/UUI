import { DataTableState, ITablePreset } from "@epam/uui";
import { Person, PersonGroup, Location } from "@epam/uui-docs";

type PersonTableFilter = { [key: string]: any, groupBy?: string };

interface PersonsTableState extends DataTableState {
    isFolded?: boolean;
    presets?: ITablePreset[];
}

type ILocalStoragePresets = (Omit<ITablePreset, "isActive">)[];

export { PersonTableFilter, PersonsTableState, ILocalStoragePresets };