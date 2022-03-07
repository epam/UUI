import { ColumnsConfig } from '@epam/uui-core';
import { ControlSize } from '..';

export interface DataTableCellMods {
    size?: ControlSize | '60';
    padding?: '0' | '12' | '24';
    isFirstColumn?: boolean;
    isLastColumn?: boolean;
    alignActions?: 'top' | 'center';
}

export interface ITablePreset<TFilter = Record<string, any>> {
    name: string;
    id: number | null;
    filter: TFilter;
    isReadonly?: boolean;
    columnsConfig: ColumnsConfig;
}

export interface IPresetsApi {
    activePresetId: number;
    isDefaultPresetActive: boolean;
    choosePreset(preset: ITablePreset): void;
    createNewPreset(name: string): void;
    resetToDefault(): void;
    hasPresetChanged(preset: ITablePreset): boolean;
    duplicatePreset(preset: ITablePreset): void;
    deletePreset(preset: ITablePreset): void;
    updatePreset(preset: ITablePreset): void;
}