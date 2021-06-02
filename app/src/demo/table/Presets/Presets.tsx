import React, { useCallback, useMemo } from "react";
import css from "./Presets.scss";
import { Button, FlexRow } from "@epam/promo";
import { ITablePreset, PersonsTableState } from "../types";
import { DataColumnProps, IEditable } from "@epam/uui";
import { Preset } from "./Preset";
import { svc } from "../../../services";
import { hasPresetChanged, isDefaultColumnsConfig, isDefaultPresetActive } from "../helpers";
import { constants } from "../data";
import { useChoosePreset, useCreateNewPreset } from "../hooks";

interface IPresetsProps extends IEditable<PersonsTableState> {
    columns: DataColumnProps<any>[];
}

const Presets: React.FC<IPresetsProps> = ({ value, onValueChange, columns }) => {
    const newPresetTitle = "New preset";

    const choosePreset = useChoosePreset(value, onValueChange);

    const createNewPreset = useCreateNewPreset({
        choosePreset,
        value,
        onValueChange,
    });
    const saveNewPreset = useCallback(() => createNewPreset(newPresetTitle), [createNewPreset, newPresetTitle]);

    const duplicatePreset = useCallback((preset: ITablePreset) => {
        const maxId = Math.max.apply(null, value.presets.map(p => p.id));

        const newPreset: ITablePreset = {
            id: maxId + 1,
            name: preset.name + "_copy",
            filter: preset.filter,
            columnsConfig: preset.columnsConfig,
            isReadonly: false,
        };

        // onValueChange({
        //     ...value,
        //     presets: [...value.presets, newPreset],
        // });
        choosePreset(newPreset);

        onValueChange({
            ...value,
            filter: newPreset.filter,
            columnsConfig: newPreset.columnsConfig,
            presets: [...value.presets, newPreset],
        });
    }, [value, onValueChange]);

    const deletePreset = useCallback((preset: ITablePreset) => {
        const newPresets = value.presets.filter(p => p.id !== preset.id);
        onValueChange({
            ...value,
            presets: newPresets,
        });
    }, [value, onValueChange]);

    const renamePreset = useCallback((newPreset: ITablePreset) => {
        const newPresets = value.presets.map(p => p.id === newPreset.id ? newPreset : p);
        onValueChange({
            ...value,
            presets: newPresets,
        });
    }, [value, onValueChange]);

    const updatePreset = useCallback((preset: ITablePreset) => {
        const newPresets = [...value.presets];
        const newPreset = {
            ...preset,
            filter: value.filter,
            columnsConfig: value.columnsConfig,
        };
        newPresets.splice(newPresets.findIndex(p => p.id === preset.id), 1, newPreset);
        onValueChange({
            ...value,
            presets: newPresets,
        });
    }, [value, onValueChange]);

    const activePresetId = +svc.uuiRouter.getCurrentLink().query?.presetId;
    const isDefaultActive = useMemo(() => isDefaultPresetActive(value, columns), [value, columns]);

    const activePreset = value.presets.find(p => p.id === activePresetId);
    const hasActivePresetChanged = useMemo(() => {
        return !isDefaultActive && hasPresetChanged(activePreset, value.columnsConfig);
    }, [isDefaultActive, activePreset, value.columnsConfig, value.filter]);

    const resetToDefault = useCallback(() => choosePreset(constants.defaultPreset), [choosePreset]);

    return (
        <FlexRow spacing="6" size="48" padding="18" cx={ css.row }>
            <Button
                size="24"
                caption="Default"
                fill={ isDefaultActive ? "solid" : "white" }
                onClick={ isDefaultActive ? null : resetToDefault }
            />
            { value.presets.map(preset => (
                <Preset
                    preset={ preset }
                    isActive={ preset.id === activePresetId }
                    hasChanged={ preset.id === activePresetId && hasActivePresetChanged }
                    choosePreset={ choosePreset }
                    duplicatePreset={ duplicatePreset }
                    deletePreset={ deletePreset }
                    renamePreset={ renamePreset }
                    updatePreset={ updatePreset }
                    key={ preset.id }
                    value={ value }
                    onValueChange={ onValueChange }
                />
            )) }

            { hasActivePresetChanged && (
                <Button
                    caption={ `Save as ${ newPresetTitle }` }
                    onClick={ saveNewPreset }
                    color="green"
                    fill="solid"
                    size="24"
                />
            ) }
        </FlexRow>
    );
};

export default React.memo(Presets);