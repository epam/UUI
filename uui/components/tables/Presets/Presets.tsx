import React, { useCallback, useMemo } from 'react';
import { DataTableState, IPresetsApi, ITablePreset } from "@epam/uui-core";
import { Button } from '../../index';
import { FlexRow } from '../../layout';
import { Preset } from './Preset';
import css from './Presets.scss';

interface IPresetsProps extends IPresetsApi {
    presets: ITablePreset[];
    tableState: DataTableState;
}

const PresetsImpl: React.FC<IPresetsProps> = ({ tableState, presets, createNewPreset, activePresetId, isDefaultPresetActive, hasPresetChanged, resetToDefault, choosePreset, duplicatePreset, deletePreset, updatePreset }) => {
    const newPresetTitle = "New preset";

    const saveNewPreset = useCallback(() => {
        createNewPreset(newPresetTitle);
    }, [createNewPreset, newPresetTitle]);

    const activePreset = presets.find(p => p.id === activePresetId);
    const hasActivePresetChanged = useMemo(() => {
        return !isDefaultPresetActive && hasPresetChanged(activePreset);
    }, [isDefaultPresetActive, activePreset, tableState.filter]);
    
    return (
        <FlexRow spacing="6" size="48" padding="18" cx={ css.row }>
            <Button
                size="24"
                caption="Default"
                mode={ isDefaultPresetActive ? 'solid' : 'outline' }
                onClick={ isDefaultPresetActive ? null : resetToDefault }
            />
            { presets.map(preset => (
                <Preset
                    preset={ preset }
                    isActive={ preset.id === activePresetId }
                    hasChanged={ preset.id === activePresetId && hasActivePresetChanged }
                    choosePreset={ choosePreset }
                    duplicatePreset={ duplicatePreset }
                    deletePreset={ deletePreset }
                    updatePreset={ updatePreset }
                    resetToDefault={ resetToDefault }
                    key={ preset.id }
                />
            )) }

            { hasActivePresetChanged && (
                <Button
                    caption={ `Save as ${ newPresetTitle }` }
                    onClick={ saveNewPreset }
                    color='accent'
                    mode='solid'
                    size='24'
                />
            ) }
        </FlexRow>
    );
};

export const Presets = React.memo(PresetsImpl);