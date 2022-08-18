import React, { useCallback, useState } from "react";
import cx from "classnames";
import css from "./PresetPanel.scss";
import { ControlGroup, FlexRow, Text, TabButton } from "../../index";
import { DataTableState, IPresetsApi } from "@epam/uui-core";
import { Preset } from "./presets/Preset";
import { PresetInput } from "./presets/PresetInput";
import { ReactComponent as PlusIcon } from "@epam/assets/icons/common/action-add-12.svg";

export interface IPresetsBlockProps extends IPresetsApi {
    tableState: DataTableState;
}

export const PresetPanel: React.FC<IPresetsBlockProps> = (props) => {
    const [isAddingPreset, setIsAddingPreset] = useState(false);
    const [newPresetCaption, setNewPresetCaption] = useState('');
    const isActivePreset = props.presets.find(p => p.id === props.activePresetId);

    const saveNewPreset = useCallback(() => {
        if (!newPresetCaption) {
            setIsAddingPreset(false);
            return;
        }

        props.createNewPreset(newPresetCaption);
        setIsAddingPreset(false);
        setNewPresetCaption("");
    }, [newPresetCaption, props.createNewPreset]);

    const setDefaultPreset = useCallback(() => {
        if (!props.isDefaultPresetActive) {
            props.resetToDefault();
        }
    }, [props.isDefaultPresetActive]);

    const addPreset = useCallback(() => {
        setIsAddingPreset(true);
    }, [setIsAddingPreset]);

    const cancelNewPreset = useCallback(() => {
        setNewPresetCaption('');
        setIsAddingPreset(false);
    }, [setNewPresetCaption, setIsAddingPreset]);

    const newPresetOnBlurHandler = useCallback(() => {
        if (newPresetCaption.length) {
            return;
        }
        setIsAddingPreset(false);
    }, [newPresetCaption.length]);

    const presetApi = {
        setRenamedPresetCaption: setNewPresetCaption,
        renamedPresetCaption: newPresetCaption,
        isActivePreset,
        addPreset,
        choosePreset: props.choosePreset,
        hasPresetChanged: props.hasPresetChanged,
        duplicatePreset: props.duplicatePreset,
        updatePreset: props.updatePreset,
        tableState: props.tableState,
        resetToDefault: props.resetToDefault,
        deletePreset: props.deletePreset,
        newPresetCaption,
        setNewPresetCaption,
    };

    return (
        <>
            <Text fontSize="24" cx={ css.presetsTitle }>Profiles Dashboard</Text>
            <FlexRow cx={ css.presetsWrapper } spacing="12">
                <ControlGroup
                    key="default-preset"
                    cx={ cx(css.defaultPresetButton, {
                        [css.presetButtonWrapper]: !isActivePreset?.id,
                    }) }>
                    <TabButton
                        caption={ 'Default Preset' }
                        onClick={ setDefaultPreset }
                        size="36"
                    />
                </ControlGroup>
                { props.presets.map(preset => <Preset key={ preset.id } preset={ preset } { ...presetApi }/>) }
            </FlexRow>
            <FlexRow cx={ css.rightBlock }>
                { !isAddingPreset
                    ? <ControlGroup key="add-preset">
                        <TabButton
                            caption={ 'Add Preset' }
                            onClick={ addPreset }
                            size="36"
                            icon={ PlusIcon }
                            iconPosition="left"
                        />
                    </ControlGroup>
                    : <PresetInput
                        value={ newPresetCaption }
                        onValueChange={ setNewPresetCaption }
                        onAccept={ saveNewPreset }
                        onCancel={ cancelNewPreset }
                        onBlur={ newPresetOnBlurHandler }
                    /> }
            </FlexRow>
        </>
    );
};
