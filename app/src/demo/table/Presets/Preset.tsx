import React, { useCallback, useState } from "react";
import css from "./Preset.scss";
import { Button, ControlGroup, Dropdown, Panel, TextInput } from "@epam/promo";
import { IDropdownToggler } from "@epam/uui";
import { ReactComponent as MenuIcon } from '@epam/assets/icons/common/navigation-more_vert-12.svg';
import { DropdownBodyProps } from "@epam/uui-components";
import { ITablePreset } from "../types";
import DropdownMenuItem from "./DropdownMenuItem";

interface IPresetProps {
    preset: ITablePreset;
    isActive: boolean;
    hasChanged: boolean;
    choosePreset: (preset: ITablePreset) => void;
    duplicatePreset: (preset: ITablePreset) => void;
    deletePreset: (preset: ITablePreset) => void;
    updatePreset: (preset: ITablePreset) => void;
    resetToDefault: () => void;
}

export const Preset: React.FC<IPresetProps> = ({ preset, isActive, hasChanged, choosePreset, duplicatePreset, deletePreset, updatePreset, resetToDefault }) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [renamingValue, setRenamingValue] = useState("");

    const handleChoose = useCallback(() => choosePreset(preset), [preset, choosePreset]);
    const handleUpdate = useCallback(() => updatePreset(preset), [preset, updatePreset]);

    const acceptRenaming = useCallback(() => {
        if (renamingValue) {
            const newPreset: ITablePreset = {
                ...preset,
                name: renamingValue,
            };
            updatePreset(newPreset);
        }
        setIsRenaming(false);
    }, [renamingValue, updatePreset]);

    const renderBody = useCallback((props: DropdownBodyProps) => {
        const handleDuplicate = () => {
            duplicatePreset(preset);
            props.onClose();
        };
        const startRenaming = () => {
            setIsRenaming(true);
            setRenamingValue(preset.name);
            props.onClose();
        };
        const handleDelete = () => {
            deletePreset(preset);
            if (isActive) {
                resetToDefault();
            }
            props.onClose();
        };
        const update = () => {
            handleUpdate();
            props.onClose();
        };
        const choose = () => {
            choosePreset(preset);
            props.onClose();
        };

        return (
            <Panel background="white" shadow={ true } cx={ css.panel }>
                <DropdownMenuItem caption="Duplicate" onClick={ handleDuplicate }/>
                <DropdownMenuItem caption="Rename" onClick={ startRenaming }/>
                <DropdownMenuItem caption="Update" onClick={ update } isDisabled={ !hasChanged }/>
                <DropdownMenuItem caption="Delete" onClick={ handleDelete }/>
                <div className={ css.divider }/>
                <DropdownMenuItem caption="Discard all changes" onClick={ choose } isDisabled={ !hasChanged }/>
            </Panel>
        );
    }, [preset, duplicatePreset, deletePreset, isActive, choosePreset, hasChanged]);

    const renderTarget = useCallback((props: IDropdownToggler & { ref?: React.Ref<any> }) => {
        return (
            <Button
                { ...props }
                icon={ MenuIcon }
                size="24"
                isDropdown={ false }
                fill={ isActive ? "solid" : "white" }
                cx={ [css.target, hasChanged && css.notification] }
            />
        );
    }, [preset, isActive, hasChanged]);

    return (
        <>
            { isRenaming
                ? (
                    <TextInput
                        value={ renamingValue }
                        onValueChange={ setRenamingValue }
                        size="24"
                        onAccept={ acceptRenaming }
                        onBlur={ acceptRenaming }
                        cx={ css.input }
                        autoFocus
                    />
                )
                : (
                    <ControlGroup cx={ css.container }>
                        <Button
                            key={ preset.id }
                            size="24"
                            caption={ preset.name }
                            fill={ isActive ? "solid" : "white" }
                            onClick={ isActive ? null : handleChoose }
                        />

                        { !preset.isReadonly && (
                            <Dropdown
                                renderBody={ renderBody }
                                renderTarget={ renderTarget }
                                placement="bottom-end"
                            />
                        ) }
                    </ControlGroup>
                ) }
        </>
    );
};