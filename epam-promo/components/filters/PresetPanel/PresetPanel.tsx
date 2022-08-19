import React, { useCallback, useState } from "react";
import css from "./PresetPanel.scss";
import { FlexRow, Text, TabButton } from "../../index";
import { DataTableState, IPresetsApi } from "@epam/uui-core";
import { Preset } from "./presets/Preset";
import { InputActionType, PresetInput } from "./presets/PresetInput";
import { ReactComponent as PlusIcon } from "@epam/assets/icons/common/action-add-12.svg";

export interface IPresetsBlockProps extends IPresetsApi {
    tableState: DataTableState;
}

export const PresetPanel: React.FC<IPresetsBlockProps> = (props) => {
    const [isAddingPreset, setIsAddingPreset] = useState(false);
    const isActivePreset = props.presets.find(p => p.id === props.activePresetId);

    const setDefaultPreset = useCallback(() => {
        props.resetToDefault();
    }, [props]);

    const setAddingPreset = useCallback(() => {
        setIsAddingPreset(true);
    }, [setIsAddingPreset]);

    const cancelAddingPreset = useCallback(() => {
        setIsAddingPreset(false);
    }, [setIsAddingPreset, props]);

    const presetApi = {
        isActivePreset,
        addPreset: setAddingPreset,
        choosePreset: props.choosePreset,
        hasPresetChanged: props.hasPresetChanged,
        duplicatePreset: props.duplicatePreset,
        updatePreset: props.updatePreset,
        tableState: props.tableState,
        resetToDefault: props.resetToDefault,
        deletePreset: props.deletePreset,
    };

    return (
        <>
            <Text fontSize="24" cx={ css.presetsTitle }>Profiles Dashboard</Text>
            <FlexRow cx={ css.presetsWrapper } spacing="12">
                <div className={ css.presetButtonWrapper }>
                    <TabButton
                        cx={ css.presetTabButton }
                        caption={ 'Default Preset' }
                        onClick={ setDefaultPreset }
                        size="36"
                        isLinkActive={ !isActivePreset?.id }
                    />
                </div>
                { props.presets.map(preset => <Preset key={ preset.id } preset={ preset } { ...presetApi }/>) }
            </FlexRow>
            <FlexRow cx={ css.rightBlock }>
                { !isAddingPreset
                    ?
                    <TabButton
                        caption={ 'Add Preset' }
                        onClick={ setAddingPreset }
                        size="36"
                        icon={ PlusIcon }
                        iconPosition="left"
                    />
                    : <PresetInput
                        actionType={ InputActionType.SAVE_NEW }
                        onCancel={ cancelAddingPreset }
                        createNewAction={ props.createNewPreset }
                    /> }
            </FlexRow>
        </>
    );
};
