import React, { useCallback, useState } from "react";
import css from "./PresetPanel.scss";
import { FlexRow, TabButton } from "../../index";
import { DataTableState, IPresetsApi } from "@epam/uui-core";
import { Preset } from "./Preset";
import { PresetInput } from "./PresetInput";
import { ReactComponent as PlusIcon } from "@epam/assets/icons/common/action-add-12.svg";

export interface IPresetsBlockProps extends IPresetsApi {
    tableState: DataTableState;
}

export const PresetPanel = (props: IPresetsBlockProps) => {
    const [isAddingPreset, setIsAddingPreset] = useState(false);

    const setAddingPreset = useCallback(() => {
        setIsAddingPreset(true);
    }, []);

    const cancelAddingPreset = useCallback(() => {
        setIsAddingPreset(false);
    }, []);

    const {presets, ...presetApi} = props;

    return (
        <FlexRow spacing='12'>
            <TabButton
                caption='Default Preset'
                onClick={ props.resetToDefault }
                size="60"
                isLinkActive={ !props.activePresetId }
            />
            { props.presets.map(preset => <Preset key={ preset.id } preset={ preset } addPreset={ setAddingPreset } { ...presetApi }/>) }
            <FlexRow>
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
                        onCancel={ cancelAddingPreset }
                        onSuccess={ props.createNewPreset }
                    /> }
            </FlexRow>
        </FlexRow>
    );
};
