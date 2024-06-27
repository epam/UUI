import { ControlSize } from '../types';

export interface PickerCellMods {
    size?: ControlSize | '60';
    padding?: '0' | '12' | '24';
    alignActions?: 'top' | 'center';
}

export interface PickerCellModsOverride {}
