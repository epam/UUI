import React, { useCallback, useState } from 'react';
import { DropdownBodyProps, IDropdownToggler, ITablePreset } from '@epam/uui-core';
import { Button, Dropdown, TextInput, DropdownMenuBody, DropdownMenuButton, DropdownMenuSplitter, ControlGroup } from '../../';
import { ReactComponent as MenuIcon } from '@epam/assets/icons/common/navigation-more_vert-12.svg';
import css from './Preset.scss';

interface IPresetProps {
    preset: ITablePreset;
    isActive: boolean;
    hasChanged: boolean;
    choosePreset: (preset: ITablePreset) => void;
    duplicatePreset: (preset: ITablePreset) => void;
    deletePreset: (preset: ITablePreset) => void;
    updatePreset: (preset: ITablePreset) => void;
}

export const Preset: React.FC<IPresetProps> = ({ preset, isActive, hasChanged, choosePreset, duplicatePreset, deletePreset, updatePreset }) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [renamingValue, setRenamingValue] = useState('');

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

    const renderBody = useCallback(
        (props: DropdownBodyProps) => {
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
                <DropdownMenuBody {...props}>
                    <DropdownMenuButton caption="Duplicate" onClick={handleDuplicate} />
                    <DropdownMenuButton caption="Rename" onClick={startRenaming} />
                    <DropdownMenuButton caption="Update" onClick={update} isDisabled={!hasChanged} />
                    <DropdownMenuButton caption="Delete" onClick={handleDelete} />
                    <DropdownMenuSplitter />
                    <DropdownMenuButton caption="Discard all changes" onClick={choose} isDisabled={!hasChanged} />
                </DropdownMenuBody>
            );
        },
        [preset, duplicatePreset, deletePreset, isActive, choosePreset, hasChanged]
    );

    const renderTarget = useCallback(
        (props: IDropdownToggler) => {
            return (
                <Button
                    {...props}
                    icon={MenuIcon}
                    size="24"
                    isDropdown={false}
                    mode={isActive ? 'solid' : 'outline'}
                    cx={[css.target, hasChanged && css.notification]}
                />
            );
        },
        [preset, isActive, hasChanged]
    );

    return (
        <>
            {isRenaming ? (
                <TextInput
                    value={renamingValue}
                    onValueChange={setRenamingValue}
                    size="24"
                    onAccept={acceptRenaming}
                    onBlur={acceptRenaming}
                    cx={css.input}
                    autoFocus
                />
            ) : (
                <ControlGroup cx={css.container}>
                    <Button
                        key={preset.id}
                        size="24"
                        caption={preset.name}
                        mode={isActive ? 'solid' : 'outline'}
                        onClick={isActive ? null : handleChoose}
                    />

                    {!preset.isReadonly && <Dropdown renderBody={renderBody} renderTarget={renderTarget} placement="bottom-end" />}
                </ControlGroup>
            )}
        </>
    );
};
