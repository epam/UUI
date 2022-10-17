import { ITablePreset } from '../../types';

const defaultPreset: ITablePreset<any> = {
    name: 'Default',
    id: null,
    filter: undefined,
    columnsConfig: undefined,
    filtersConfig: undefined,
    isReadonly: true,
    order: 'a',
} as const;

export const constants = {
    defaultPreset,
};