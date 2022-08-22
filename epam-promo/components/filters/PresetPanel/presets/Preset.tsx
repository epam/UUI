import React, { useCallback, useState } from "react";
import css from "../PresetPanel.scss";
import { DataTableState, ITablePreset } from "@epam/uui-core";
import { TabButton } from "../../../buttons";
import { TabButtonDropdown } from "./TabButtonDropdown";
import { InputActionType, PresetInput } from "./PresetInput";

interface IPresetProps {
    preset: ITablePreset;
    choosePreset: (preset: ITablePreset) => void;
    hasPresetChanged: (preset: ITablePreset) => boolean;
    duplicatePreset: (preset: ITablePreset) => void;
    updatePreset: (preset: ITablePreset) => Promise<void>;
    isActivePreset: ITablePreset;
    addPreset: () => void;
    tableState: DataTableState;
    resetToDefault: () => void;
    deletePreset: (preset: ITablePreset) => Promise<void>;
}

export const Preset = (props: IPresetProps) => {
    const [isRenamePreset, setIsRenamePreset] = useState<Boolean>(false);
    const choosePresetHandler = useCallback(() => props.choosePreset(props.preset), [props]);

    const cancelRenamePreset = useCallback(() => {
        setIsRenamePreset(() => false);
    }, []);

    const setPresetForRename = useCallback(() => {
        if (!isRenamePreset) {
            setIsRenamePreset(() => true);
        }
    }, []);

    const tabButtonDropdownApi = {
        renamePreset: setPresetForRename,
        addPreset: props.addPreset,
        choosePreset: props.choosePreset,
        duplicatePreset: props.duplicatePreset,
        hasPresetChanged: props.hasPresetChanged,
        isActivePreset: props.isActivePreset,
        resetToDefault: props.resetToDefault,
        deletePreset: props.deletePreset,
        preset: props.preset,
        tableStateFilter: props.tableState.filter,
        tableStateColumnConfig: props.tableState.columnsConfig,
        updatePreset: props.updatePreset,
    };

    const renderTabButtonDropdown = useCallback(() => <TabButtonDropdown { ...tabButtonDropdownApi }/>, [tabButtonDropdownApi]);

    return (
        <div key={ props.preset.id } className={ css.presetButtonWrapper }>
            {
                isRenamePreset
                    ? <PresetInput
                        actionType={ InputActionType.RENAME }
                        onCancel={ cancelRenamePreset }
                        renamePreset={ props.updatePreset }
                        preset={ props.preset }
                    />
                    :
                    <TabButton
                        cx={ css.presetTabButton }
                        caption={ props.preset.name }
                        onClick={ choosePresetHandler }
                        size="36"
                        withNotify={ props.isActivePreset?.id === props.preset.id && props.hasPresetChanged(props.preset) }
                        icon={ renderTabButtonDropdown }
                        iconPosition="right"
                        isLinkActive={ props.isActivePreset?.id === props.preset.id }
                    />
            }
        </div>
    );
};
