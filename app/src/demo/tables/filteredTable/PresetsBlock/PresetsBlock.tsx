import React, { useCallback, useState } from "react";
import { ControlGroup, Dropdown, DropdownMenuButton, FlexRow, Panel, Text, Button, TextInput, FlexCell } from "@epam/promo";
import css from "./PresetsBlock.scss";
import { IPresetsApi, ITablePreset } from "@epam/uui-core";
import { TabButton } from "@epam/uui";
import { ReactComponent as PlusIcon } from "@epam/assets/icons/common/action-add-12.svg";
import { ReactComponent as menuIcon } from '@epam/assets/icons/common/navigation-more_vert-12.svg';
import cx from "classnames";

const enum PresetCommand {
    'DEFAULT' = 'DEFAULT',
    'ADD_PRESET' = 'ADD_PRESET',
    'SAVE_NEW_PRESET' = 'SAVE_NEW_PRESET',
    'CANCEL_NEW_PRESET' = 'CANCEL_NEW_PRESET',
    'CHOOSE_PRESET' = 'CHOOSE_PRESET',
    'DELETE_PRESET' = 'DELETE_PRESET',
    'RENAME_PRESET' = 'RENAME_PRESET',
    'CANCEL_RENAMING_PRESET' = 'CANCEL_RENAMING_PRESET',
}

interface IPresetsBlockProps {
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
}

export const PresetsBlock: React.FC<IPresetsBlockProps> = ({ presets, createNewPreset, isDefaultPresetActive, resetToDefault, activePresetId, hasPresetChanged, choosePreset, duplicatePreset, updatePreset, deletePreset }) => {
    const [isAddingPreset, setIsAddingPreset] = useState(false);
    const [renamedPreset, setRenamedPreset] = useState<ITablePreset | null>(null);
    const [renamedPresetCaption, setRenamedPresetCaption] = useState('');
    const [newPresetCaption, setNewPresetCaption] = useState('');
    const [isInvalidPresetCaption, setIsInvalidPresetCaption] = useState(false);
    const isActivePreset = presets.find(p => p.id === activePresetId);

    const saveNewPreset = useCallback(() => {
        const isPresetCaptionRepeat = presets.filter(p => p.name === newPresetCaption).length > 0;

        if (!newPresetCaption) {
            setIsAddingPreset(false);
            return;
        }
        if (isPresetCaptionRepeat) {
            setIsInvalidPresetCaption(true);
            return;
        }

        setIsInvalidPresetCaption(false);
        createNewPreset(newPresetCaption);
        setIsAddingPreset(false);
        setNewPresetCaption("");
    }, [newPresetCaption, createNewPreset]);

    const presetBtnHandler = (commandName: PresetCommand, preset?: ITablePreset<Record<string, any>>) => {
        switch (commandName) {
            case PresetCommand.DEFAULT: {
                if (!isDefaultPresetActive) {
                    resetToDefault();
                }
                break;
            }
            case PresetCommand.ADD_PRESET: {
                setIsAddingPreset(true);
                break;
            }
            case PresetCommand.SAVE_NEW_PRESET: {
                saveNewPreset();
                break;
            }
            case PresetCommand.CANCEL_NEW_PRESET: {
                setNewPresetCaption('');
                setIsInvalidPresetCaption(false);
                setIsAddingPreset(false);
                break;
            }
            case PresetCommand.CHOOSE_PRESET: {
                choosePreset(preset);
                break;
            }
            case PresetCommand.DELETE_PRESET: {
                if (isActivePreset && isActivePreset.id === preset.id) {
                    resetToDefault();
                }
                deletePreset(preset);
                break;
            }
            case PresetCommand.RENAME_PRESET: {
                if (!renamedPreset) {
                    setRenamedPresetCaption(preset.name);
                    setRenamedPreset(preset);
                    break;
                } else if (renamedPreset) {
                    const isPresetCaptionRepeat = presets.filter(p => p.name === renamedPresetCaption).length > 0;
                    if (isPresetCaptionRepeat) {
                        setIsInvalidPresetCaption(true);
                        break;
                    }
                    const newPreset: ITablePreset = {
                        ...renamedPreset,
                        name: renamedPresetCaption,
                    };
                    updatePreset(newPreset);
                    setRenamedPreset(null);
                    setRenamedPresetCaption("");
                    setIsInvalidPresetCaption(false);
                }
                break;
            }
            case PresetCommand.CANCEL_RENAMING_PRESET: {
                setRenamedPresetCaption("");
                setRenamedPreset(null);
                break;
            }
            default:
                const _: never = commandName;
                console.error(`Wrong command ${ commandName } in presetBtnHandler`);
        }
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

    const renderPresetBody = (preset: ITablePreset) => {
        return (
            <Panel background="white" shadow={ true }>
                <DropdownMenuButton key={ `${ preset.id }-duplicate` } caption="Duplicate" onClick={ () => duplicatePreset(preset) }/>
                <DropdownMenuButton key={ `${ preset.id }-rename` } caption="Rename" onClick={ () => presetBtnHandler(PresetCommand.RENAME_PRESET, preset) }/>
                <DropdownMenuButton key={ `${ preset.id }-delete` } caption="Delete" onClick={ () => presetBtnHandler(PresetCommand.DELETE_PRESET, preset) }/>
            </Panel>
        );
    };

    const renderPreset = (preset: ITablePreset) => {
        return (
            <div key={ preset.id }>
                {
                    (renamedPreset?.id === preset.id)
                        ?
                        <FlexCell minWidth={ 180 }>
                            <TextInput
                                onValueChange={ setRenamedPresetCaption }
                                value={ renamedPresetCaption }
                                onCancel={ () => presetBtnHandler(PresetCommand.CANCEL_RENAMING_PRESET) }
                                onAccept={ () => presetBtnHandler(PresetCommand.RENAME_PRESET) }
                                isInvalid={ isInvalidPresetCaption }
                                onBlur={ renamePresetOnBlurHandler }
                                autoFocus
                            />
                        </FlexCell>
                        : <ControlGroup
                            cx={ cx(css.presetBorder, {
                                [css.activePresetBorder]: isActivePreset?.id === preset.id,
                            }) }>
                            <TabButton
                                caption={ preset.name }
                                onClick={ () => presetBtnHandler(PresetCommand.CHOOSE_PRESET, preset) }
                                size="36"
                            />
                            <Dropdown
                                renderBody={ () => renderPresetBody(preset) }
                                renderTarget={ (props) =>
                                    <Button { ...props }
                                            fill="light"
                                            icon={ menuIcon }
                                            size="36"
                                            isDropdown={ false }
                                    />
                                }
                                placement="bottom-end"
                            />
                        </ControlGroup>
                }
            </div>
        );
    };

    return (
        <FlexRow cx={ css.presetsPanel } background="gray5" borderBottom={ true }>
            <Text fontSize="24">Profiles Dashboard</Text>
            <FlexRow margin="12" spacing="12">
                <ControlGroup
                    key="default-preset"
                    cx={ cx(css.presetBorder, {
                        [css.activePresetBorder]: !isActivePreset?.id,
                    }) }>
                    <TabButton
                        caption={ 'Default Preset' }
                        onClick={ () => presetBtnHandler(PresetCommand.DEFAULT) }
                        size="36"
                    />
                </ControlGroup>

                { presets.map(preset => renderPreset(preset)) }

                { !isAddingPreset
                    ? <ControlGroup key="add-preset">
                        <TabButton
                            caption={ 'Add Preset' }
                            onClick={ () => presetBtnHandler(PresetCommand.ADD_PRESET) }
                            size="36"
                            icon={ PlusIcon }
                            iconPosition="left"
                        />
                    </ControlGroup>
                    : <FlexCell minWidth={ 180 } key="add-input">
                        <TextInput
                            onValueChange={ setNewPresetCaption }
                            value={ newPresetCaption }
                            onCancel={ () => presetBtnHandler(PresetCommand.CANCEL_NEW_PRESET) }
                            onAccept={ () => presetBtnHandler(PresetCommand.SAVE_NEW_PRESET) }
                            isInvalid={ isInvalidPresetCaption }
                            onBlur={ newPresetOnBlurHandler }
                            autoFocus
                        />
                    </FlexCell> }
            </FlexRow>
        </FlexRow>
    );
};