import React, { useCallback } from 'react';
import { offset } from '@floating-ui/react';
import type { IPresetsApi, IDropdownToggler, ITablePreset, DataTableState, DropdownBodyProps } from '@epam/uui-core';
import { useUuiContext } from '@epam/uui-core';
import { Dropdown, DropdownMenuBody, DropdownMenuButton, SuccessNotification, DropdownMenuSplitter } from '../../overlays';
import { IconButton } from '../../buttons';
import { settings } from '../../../settings';

import css from './PresetActionsDropdown.module.scss';

interface ITubButtonDropdownProps extends Omit<IPresetsApi, 'presets'> {
    preset: ITablePreset;
    addPreset: () => void;
    tableState: DataTableState;
    renamePreset: () => void;
    onCopyLink?: ((tableState: DataTableState) => string) | null;
}

export function PresetActionsDropdown(props: ITubButtonDropdownProps) {
    const { uuiNotifications } = useUuiContext();

    const successNotificationHandler = useCallback((text: string) => {
        uuiNotifications
            .show(
                (props) => (
                    <SuccessNotification { ...props }>
                        <div className="uui-presets-panel-notification-text">
                            {text}
                        </div>
                    </SuccessNotification>
                ),
                { duration: 3 },
            )
            .catch(() => null);
    }, []);

    function getCopyLink(): string {
        const getPresetLink = props.onCopyLink || props.getPresetLink;
        const isPresetChanged = props.activePresetId === props.preset.id && props.hasPresetChanged(props.preset);
        if (isPresetChanged) {
            return getPresetLink({ ...props.preset, ...props.tableState });
        }
        return getPresetLink(props.preset);
    }

    const copyUrlToClipboard = useCallback(async (): Promise<void> => {
        const link = getCopyLink();
        await navigator.clipboard.writeText(link);
        successNotificationHandler('Link copied!');
    }, [props.activePresetId, props.preset, props.hasPresetChanged, props.getPresetLink, props.tableState, props.onCopyLink]);

    const saveInCurrent = useCallback(
        async (preset: ITablePreset) => {
            const newPreset: ITablePreset = {
                ...preset,
                filter: props.tableState.filter,
                sorting: props.tableState.sorting,
                columnsConfig: props.tableState.columnsConfig,
                filtersConfig: props.tableState.filtersConfig,
                viewState: props.tableState.viewState,
            };
            await props.updatePreset(newPreset);
            successNotificationHandler('Changes saved!');
        },
        [
            props.tableState.filter, props.tableState.columnsConfig, props.tableState.filtersConfig,
        ],
    );

    const saveInCurrentHandler = useCallback(() => {
        saveInCurrent(props.preset);
    }, [props.preset]);

    const discardAllChangesHandler = useCallback(() => {
        props.choosePreset(props.preset);
    }, [props.preset]);

    const duplicateHandler = useCallback(() => {
        props.duplicatePreset(props.preset);
    }, [props.preset]);

    const deleteHandler = useCallback(async () => {
        await props.deletePreset(props.preset);
    }, [
        props.activePresetId, props.deletePreset, props.preset,
    ]);

    const renderBody = (dropdownProps: DropdownBodyProps): React.ReactNode => {
        const isReadonlyPreset = props.preset.isReadonly;
        const isPresetChanged = props.activePresetId === props.preset.id && props.hasPresetChanged(props.preset);
        const isRenameAvailable = props.preset.id === props.activePresetId && !isReadonlyPreset;

        return (
            <DropdownMenuBody { ...dropdownProps }>
                { isPresetChanged && (
                    <>
                        {!isReadonlyPreset && (
                            <DropdownMenuButton
                                key={ `${props.preset.id}-save-in-current` }
                                icon={ settings.presetsPanel.icons.saveInCurrentIcon }
                                caption="Save in current"
                                onClick={ () => { dropdownProps.onClose(); saveInCurrentHandler(); } }
                            />
                        )}
                        <DropdownMenuButton
                            key={ `${props.preset.id}-save-as-new` }
                            icon={ settings.presetsPanel.icons.saveAsNewIcon }
                            caption="Save as new"
                            // We add setTimeout to call addPreset after dropdown will be closed, since dropdown has focus lock, and it broke autofocus on add new preset input
                            onClick={ () => { dropdownProps.onClose(); setTimeout(() => props.addPreset(), 0); } }
                        />
                        <DropdownMenuButton
                            key={ `${props.preset.id}-discard` }
                            icon={ settings.presetsPanel.icons.discardChangesIcon }
                            caption="Discard all changes"
                            onClick={ () => { dropdownProps.onClose(); discardAllChangesHandler(); } }
                        />
                        <DropdownMenuSplitter key="discard-splitter" />
                    </>
                )}
                { isRenameAvailable && (
                    <DropdownMenuButton
                        key={ `${props.preset.id}-rename` }
                        icon={ settings.presetsPanel.icons.renameIcon }
                        caption="Rename"
                        onClick={ props.renamePreset }
                    />
                )}
                { !isPresetChanged && (
                    <DropdownMenuButton
                        key={ `${props.preset.id}-duplicate` }
                        icon={ settings.presetsPanel.icons.copyIcon }
                        caption="Duplicate"
                        onClick={ () => { dropdownProps.onClose(); duplicateHandler(); } }
                    />
                )}
                {props.onCopyLink !== null && (
                    <DropdownMenuButton
                        key={ `${props.preset.id}-copyLink` }
                        icon={ settings.presetsPanel.icons.copyLinkIcon }
                        caption="Copy Link"
                        onClick={ copyUrlToClipboard }
                    />
                )}
                {!isReadonlyPreset && (
                    <>
                        <DropdownMenuSplitter key="delete-splitter" />
                        <DropdownMenuButton
                            icon={ settings.presetsPanel.icons.deleteIcon }
                            caption="Delete"
                            cx={ css.deleteButton }
                            onClick={ deleteHandler }
                        />
                    </>
                )}
            </DropdownMenuBody>
        );
    };

    const renderTarget = useCallback((dropdownProps: IDropdownToggler) => {
        return (
            <IconButton
                cx={ [css.tabButton, dropdownProps.isOpen && css.targetOpen] }
                color={ props.preset.id === props.activePresetId ? 'primary' : 'neutral' }
                { ...dropdownProps }
                icon={ settings.presetsPanel.icons.menuIcon }
                size={ settings.presetsPanel.sizes.dropdownTargetIconButton }
            />
        );
    }, []);

    return (
        <Dropdown renderBody={ renderBody } renderTarget={ renderTarget } placement="bottom-end" middleware={ [offset(22)] } />
    );
}
