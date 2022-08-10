import React, { useCallback, useState } from "react";
import cx from "classnames";
import { ControlGroup, Dropdown, DropdownMenuButton, FlexRow, Panel, Text, Button, TextInput, FlexCell } from "@epam/promo";
import css from "./PresetsBlock.scss";
import { IPresetsApi, ITablePreset } from "@epam/uui-core";
import { TabButton } from "@epam/uui";
import { ReactComponent as PlusIcon } from "@epam/assets/icons/common/action-add-12.svg";
import { ReactComponent as menuIcon } from '@epam/assets/icons/common/navigation-more_vert-12.svg';
import { ReactComponent as RenameIcon } from '@epam/assets/icons/common/content-edit-18.svg';
import { ReactComponent as CopyIcon } from '@epam/assets/icons/common/action-copy_content-18.svg';
import { ReactComponent as DeleteIcon } from '@epam/assets/icons/common/action-deleteforever-18.svg';
import { ReactComponent as CopyLinkIcon } from '@epam/assets/icons/common/content-link-18.svg';
import { ReactComponent as DiscardChangesIcon } from '@epam/assets/icons/common/content-edit_undo-18.svg';
import { ReactComponent as SaveAsNewIcon } from '@epam/assets/icons/common/save-outline-18.svg';
import { ReactComponent as SaveInCurrentIcon } from '@epam/assets/icons/common/action-update-18.svg';

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

    const setDefaultPreset = () => {
        if (!isDefaultPresetActive) {
            resetToDefault();
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
            resetToDefault();
        }
        deletePreset(preset);
    };

    const renamePreset = (preset?: ITablePreset) => {
        if (!renamedPreset && preset) {
            setRenamedPresetCaption(preset.name);
            setRenamedPreset(preset);
        } else if (renamedPreset) {
            const isPresetCaptionRepeat = presets.filter(p => p.name === renamedPresetCaption).length > 0;
            if (isPresetCaptionRepeat) {
                setIsInvalidPresetCaption(true);
                return;
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
    };

    const saveInCurrent = (preset: ITablePreset) => {
        createNewPreset(preset.name);
        deletePreset(preset);
    };

    const renderPresetBody = (preset: ITablePreset) => {
        return (
            <Panel background="white" shadow={ true }>
                <FlexRow key={ `${ preset.id }-save-in-current` } >
                    <DropdownMenuButton isDisabled={ !(isActivePreset?.id === preset.id && hasPresetChanged(preset)) } icon={ SaveInCurrentIcon } caption="Save in current" onClick={ () => saveInCurrent(preset) }/>
                </FlexRow>
                <FlexRow key={ `${ preset.id }-save-as-new` } >
                    <DropdownMenuButton isDisabled={ !(isActivePreset?.id === preset.id && hasPresetChanged(preset)) } icon={ SaveAsNewIcon } caption="Save as new" onClick={ addPreset }/>
                </FlexRow>
                <FlexRow key={ `${ preset.id }-discard` } borderBottom="gray40">
                    <DropdownMenuButton isDisabled={ !(isActivePreset?.id === preset.id && hasPresetChanged(preset)) } icon={ DiscardChangesIcon } caption="Discard all changes" onClick={ () => choosePreset(preset) }/>
                </FlexRow>
                <FlexRow key={ `${ preset.id }-duplicate` }>
                    <DropdownMenuButton icon={ CopyIcon } caption="Duplicate" onClick={ () => duplicatePreset(preset) }/>
                </FlexRow>
                <FlexRow key={ `${ preset.id }-rename` }>
                    <DropdownMenuButton icon={ RenameIcon } caption="Rename" onClick={ () => renamePreset(preset) }/>
                </FlexRow>
                <FlexRow borderBottom="gray40" key={ `${ preset.id }-copyLink` }>
                    <DropdownMenuButton icon={ CopyLinkIcon } caption="Copy Link" onClick={ () => {} }/>
                </FlexRow>
                <FlexRow key={ `${ preset.id }-delete` } cx={ css.deleteRow }>
                    <DropdownMenuButton icon={ DeleteIcon } caption="Delete" cx={ css.deleteButton } onClick={ () => deletePresetHandler(preset) }/>
                </FlexRow>
            </Panel>
        );
    };

    const renderPreset = (preset: ITablePreset) => {
        return (
            <div key={ preset.id } className={ css.presetButtonWrapper }>
                {
                    (renamedPreset?.id === preset.id)
                        ?
                        <FlexCell cx={ css.renameInputCell } minWidth={ 180 } alignSelf="center">
                            <TextInput
                                onValueChange={ setRenamedPresetCaption }
                                value={ renamedPresetCaption }
                                onCancel={ cancelRenamePreset }
                                onAccept={ renamePreset }
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
                                cx={ css.presetTabButton }
                                caption={ preset.name }
                                onClick={ () => choosePreset(preset) }
                                size="36"
                                withNotify={ isActivePreset?.id === preset.id && hasPresetChanged(preset) }
                            />
                            { isActivePreset?.id === preset.id &&
                                <Dropdown
                                    renderBody={ () => renderPresetBody(preset) }
                                    renderTarget={ (props) =>
                                        <Button { ...props }
                                                cx={ css.presetDropdown }
                                                fill="light"
                                                icon={ menuIcon }
                                                size="36"
                                                isDropdown={ false }
                                        />
                                    }
                                    placement="bottom-end"
                                />
                            }
                        </ControlGroup>
                }
            </div>
        );
    };

    return (
        <FlexRow cx={ css.presetsPanel } background="gray5" borderBottom={ true }>
            <Text fontSize="24" cx={ css.presetsTitle }>Profiles Dashboard</Text>
            <FlexRow spacing="12" cx={ css.presetsWrapper }>
                <ControlGroup
                    key="default-preset"
                    cx={ cx(css.presetBorder, {
                        [css.activePresetBorder]: !isActivePreset?.id,
                    }) }>
                    <TabButton
                        caption={ 'Default Preset' }
                        onClick={ setDefaultPreset }
                        size="36"
                    />
                </ControlGroup>

                { presets.map(renderPreset) }

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
        </FlexRow>
    );
};