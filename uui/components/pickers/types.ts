import { ControlSize } from '../types';

export interface PickerCellMods {
    size?: ControlSize;
    padding?: '0' | '12' | '24';
    alignActions?: 'top' | 'center';
}

export interface PickerCellModsOverride {}
