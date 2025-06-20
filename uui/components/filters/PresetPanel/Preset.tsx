import React, { useCallback, useState } from 'react';
import type { DataTableState, IPresetsApi, ITablePreset } from '@epam/uui-core';
import { TabButton } from '../../buttons';
import { PresetActionsDropdown } from './PresetActionsDropdown';
import { PresetInput } from './PresetInput';
import { FlexCell } from '../../layout';
import { UUI_PRESETS_PANEL_PRESET } from './constants';
import { settings } from '../../../settings';

import css from './Preset.module.scss';

interface IPresetProps extends Omit<IPresetsApi, 'presets'> {
    preset: ITablePreset;
    addPreset: () => void;
    tableState: DataTableState;
    onCopyLink?: ((tableState: DataTableState) => string) | null;
}

export function Preset(props: IPresetProps) {
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

    const handlePresetRename = useCallback(
        (name: string) => {
            const newPreset: ITablePreset = {
                ...props.preset,
                name: name,
            };
            return props.updatePreset(newPreset);
        },
        [props.preset],
    );

    const isPresetActive = props.activePresetId === props.preset.id;

    const PresetActionsDropdownComponent = useCallback(
        () => <PresetActionsDropdown renamePreset={ setPresetForRename } { ...props } />,
        [props.preset, props.tableState, props.activePresetId],
    );

    return (
        <FlexCell key={ props.preset.id } alignSelf="center" width="auto">
            {isRenamePreset ? (
                <PresetInput
                    onCancel={ cancelRenamePreset }
                    onSuccess={ handlePresetRename }
                    preset={ props.preset }
                />
            ) : (
                <TabButton
                    caption={ props.preset.name }
                    onClick={ !isPresetActive && choosePresetHandler }
                    cx={ [css.preset, isPresetActive && css.activePreset, UUI_PRESETS_PANEL_PRESET] }
                    size={ settings.presetsPanel.sizes.tabButton }
                    withNotify={ isPresetActive && props.hasPresetChanged(props.preset) }
                    icon={ PresetActionsDropdownComponent }
                    iconPosition="right"
                    isLinkActive={ isPresetActive }
                />
            )}
        </FlexCell>
    );
}
