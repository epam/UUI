import React, { useCallback, useState } from "react";
import cx from "classnames";
import css from "./PresetPanel.scss";
import { ControlGroup, FlexRow, Text, TextInput, FlexCell, SuccessNotification, TabButton } from "../../index";
import { DataTableState, IPresetsApi, ITablePreset, useUuiContext } from "@epam/uui-core";
import { ReactComponent as PlusIcon } from "@epam/assets/icons/common/action-add-12.svg";
import { Preset } from "./presets/Preset";

export interface IPresetsBlockProps {
    presets: ITablePreset[];
    createNewPreset: IPresetsApi["createNewPreset"];
    isDefaultPresetActive: IPresetsApi["isDefaultPresetActive"];
    resetToDefault: IPresetsApi["resetToDefault"];
    activePresetId: IPresetsApi["activePresetId"];
    hasPresetChanged: IPresetsApi["hasPresetChanged"];
    choosePreset: IPresetsApi["choosePreset"];
    duplicatePreset: (preset: ITablePreset) => void;
    deletePreset: (preset: ITablePreset) => void;
    updatePreset: (preset: ITablePreset) => void;
    tableState: DataTableState;
}

export const PresetPanel: React.FC<IPresetsBlockProps> = (props) => {
    const [isAddingPreset, setIsAddingPreset] = useState(false);
    const [renamedPreset, setRenamedPreset] = useState<ITablePreset | null>(null);
    const [renamedPresetCaption, setRenamedPresetCaption] = useState('');
    const [newPresetCaption, setNewPresetCaption] = useState('');
    const [isInvalidPresetCaption, setIsInvalidPresetCaption] = useState(false);
    const isActivePreset = props.presets.find(p => p.id === props.activePresetId);
    const { uuiNotifications } = useUuiContext();

    const saveNewPreset = useCallback(() => {
        const isPresetCaptionRepeat = props.presets.filter(p => p.name === newPresetCaption).length > 0;

        if (!newPresetCaption) {
            setIsAddingPreset(false);
            return;
        }
        if (isPresetCaptionRepeat) {
            setIsInvalidPresetCaption(true);
            return;
        }

        setIsInvalidPresetCaption(false);
        props.createNewPreset(newPresetCaption);
        setIsAddingPreset(false);
        setNewPresetCaption("");
    }, [newPresetCaption, props.createNewPreset]);

    const setDefaultPreset = () => {
        if (!props.isDefaultPresetActive) {
            props.resetToDefault();
        }
    };

    const addPreset = () => {
        setIsAddingPreset(true);
    };

    const cancelNewPreset = () => {
        setNewPresetCaption('');
        setIsInvalidPresetCaption(false);
        setIsAddingPreset(false);
    };

    const newPresetOnBlurHandler = () => {
        if (newPresetCaption.length) {
            return;
        }
        setIsAddingPreset(false);
    };

    const renamePresetOnBlurHandler = () => {
        if (renamedPresetCaption.length) {
            return;
        }
        setRenamedPreset(null);
    };

    const cancelRenamePreset = () => {
        setRenamedPresetCaption("");
        setRenamedPreset(null);
    };

    const deletePresetHandler = (preset: ITablePreset) => {
        if (isActivePreset && isActivePreset.id === preset.id) {
            props.resetToDefault();
        }
        props.deletePreset(preset);
    };

    const renamePreset = (preset?: ITablePreset) => {
        if (!renamedPreset && preset) {
            setRenamedPresetCaption(preset.name);
            setRenamedPreset(preset);
        } else if (renamedPreset) {
            const isPresetCaptionRepeat = props.presets.filter(p => p.name === renamedPresetCaption).length > 0;
            if (isPresetCaptionRepeat) {
                setIsInvalidPresetCaption(true);
                return;
            }
            const newPreset: ITablePreset = {
                ...renamedPreset,
                name: renamedPresetCaption,
            };
            props.updatePreset(newPreset);
            setRenamedPreset(null);
            setRenamedPresetCaption("");
            setIsInvalidPresetCaption(false);
        }
    };

    const saveInCurrent = (preset: ITablePreset) => {
        const newPreset = {
            ...preset,
            filter: props.tableState.filter,
            columnsConfig: props.tableState.columnsConfig,
        };
        props.updatePreset(newPreset);
        successNotificationHandler('Changes saved!');
    };

    const copyUrlToClipboard = async () => {
        await navigator.clipboard.writeText(location.href);
        successNotificationHandler('Link copied!');
    };

    const successNotificationHandler = (text: string) => {
        uuiNotifications.show((props) => (
            <SuccessNotification { ...props } >
                <Text size="36" font="sans" fontSize="14">{ text }</Text>
            </SuccessNotification>
        ), { position: 'top-right', duration: 3 }).catch(() => null);
    };

    return (
        <>
            <Text fontSize="24" cx={ css.presetsTitle }>Profiles Dashboard</Text>
            <FlexRow cx={ css.dynamicPresetsWrapper } spacing="12">
                <ControlGroup
                    key="default-preset"
                    cx={ cx(css.presetControlGroup, {
                        [css.activePresetBorder]: !isActivePreset?.id,
                    }) }>
                    <TabButton
                        caption={ 'Default Preset' }
                        onClick={ setDefaultPreset }
                        size="36"
                    />
                </ControlGroup>
                { props.presets.map(preset => <Preset
                    key={ preset.id }
                    preset={ preset }
                    renamedPreset={ renamedPreset }
                    setRenamedPresetCaption={ setRenamedPresetCaption }
                    renamedPresetCaption={ renamedPresetCaption }
                    cancelRenamePreset={ cancelRenamePreset }
                    renamePreset={ renamePreset }
                    isInvalidPresetCaption={ isInvalidPresetCaption }
                    renamePresetOnBlurHandler={ renamePresetOnBlurHandler }
                    isActivePreset={ isActivePreset }
                    choosePreset={ props.choosePreset }
                    hasPresetChanged={ props.hasPresetChanged }
                    addPreset={ addPreset }
                    copyUrlToClipboard={ copyUrlToClipboard }
                    deletePresetHandler={ deletePresetHandler }
                    duplicatePreset={ props.duplicatePreset }
                    saveInCurrent={ saveInCurrent }
                />) }
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
                    : <FlexCell minWidth={ 180 } key="add-input">
                        <TextInput
                            cx={ css.addNewPreset }
                            onValueChange={ setNewPresetCaption }
                            value={ newPresetCaption }
                            onCancel={ cancelNewPreset }
                            onAccept={ saveNewPreset }
                            isInvalid={ isInvalidPresetCaption }
                            onBlur={ newPresetOnBlurHandler }
                            autoFocus
                        />
                    </FlexCell> }
            </FlexRow>
        </>
    );
};