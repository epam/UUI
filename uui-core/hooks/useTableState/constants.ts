import { ITablePreset } from '../../types';

const defaultPreset: ITablePreset<any> = {
    name: 'Default',
    id: null,
    filter: undefined,
    columnsConfig: undefined,
    isReadonly: true,
} as const;

export const constants = {
    defaultPreset,
};