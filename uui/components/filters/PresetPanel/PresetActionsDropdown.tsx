import React, { useCallback } from 'react';
import { offset } from '@floating-ui/react';
import { IPresetsApi, IDropdownToggler, ITablePreset, useUuiContext, DataTableState, DropdownBodyProps } from '@epam/uui-core';
import { Dropdown, DropdownMenuBody, DropdownMenuButton, SuccessNotification, DropdownMenuSplitter } from '../../overlays';
import { IconButton } from '../../buttons';
import { Text } from '../../typography';
import { ReactComponent as MenuIcon } from '@epam/assets/icons/navigation-more_vert-outline.svg';
import { ReactComponent as SaveInCurrentIcon } from '@epam/assets/icons/navigation-refresh-outline.svg';
import { ReactComponent as SaveAsNewIcon } from '@epam/assets/icons/action-save-outline.svg';
import { ReactComponent as DiscardChangesIcon } from '@epam/assets/icons/content-edit_undo-outline.svg';
import { ReactComponent as CopyIcon } from '@epam/assets/icons/action-copy_content-outline.svg';
import { ReactComponent as RenameIcon } from '@epam/assets/icons/content-edit-fill.svg';
import { ReactComponent as CopyLinkIcon } from '@epam/assets/icons/content-link-outline.svg';
import { ReactComponent as ActionDeleteOutlineIcon } from '@epam/assets/icons/action-delete-outline.svg';
import css from './PresetActionsDropdown.module.scss';

interface ITubButtonDropdownProps extends Omit<IPresetsApi, 'presets'> {
    preset: ITablePreset;
    addPreset: () => void;
    tableState: DataTableState;
    renamePreset: () => void;
}

export function PresetActionsDropdown(props: ITubButtonDropdownProps) {
    const { uuiNotifications } = useUuiContext();

    const copyUrlToClipboard = useCallback(async () => {
        await navigator.clipboard.writeText(props.getPresetLink(props.preset));
        successNotificationHandler('Link copied!');
    }, []);

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

    const successNotificationHandler = useCallback((text: string) => {
        uuiNotifications
            .show(
                (props) => (
                    <SuccessNotification { ...props }>
                        <Text fontSize="14">
                            {text}
                        </Text>
                    </SuccessNotification>
                ),
                { duration: 3 },
            )
            .catch(() => null);
    }, []);

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

    const renderBody = (dropdownProps: DropdownBodyProps) => {
        const isReadonlyPreset = props.preset.isReadonly;
        const isPresetChanged = props.activePresetId === props.preset.id && props.hasPresetChanged(props.preset);
        const isRenameAvailable = props.preset.id === props.activePresetId && !isReadonlyPreset;

        return (
            <DropdownMenuBody { ...dropdownProps }>
                { isPresetChanged && (
                    <>
                        {!isReadonlyPreset && (
                            <DropdownMenuButton key={ `${props.preset.id}-save-in-current` } icon={ SaveInCurrentIcon } caption="Save in current" onClick={ () => { dropdownProps.onClose(); saveInCurrentHandler(); } } />
                        )}
                        <DropdownMenuButton
                            key={ `${props.preset.id}-save-as-new` }
                            icon={ SaveAsNewIcon }
                            caption="Save as new"
                            // We add setTimeout to call addPreset after dropdown will be closed, since dropdown has focus lock, and it broke autofocus on add new preset input
                            onClick={ () => { dropdownProps.onClose(); setTimeout(() => props.addPreset(), 0); } }
                        />
                        <DropdownMenuButton key={ `${props.preset.id}-discard` } icon={ DiscardChangesIcon } caption="Discard all changes" onClick={ () => { dropdownProps.onClose(); discardAllChangesHandler(); } } />
                        <DropdownMenuSplitter key="discard-splitter" />
                    </>
                )}
                { isRenameAvailable && (
                    <DropdownMenuButton key={ `${props.preset.id}-rename` } icon={ RenameIcon } caption="Rename" onClick={ props.renamePreset } />
                )}
                <DropdownMenuButton key={ `${props.preset.id}-duplicate` } icon={ CopyIcon } caption="Duplicate" onClick={ () => { dropdownProps.onClose(); duplicateHandler(); } } />
                <DropdownMenuButton key={ `${props.preset.id}-copyLink` } icon={ CopyLinkIcon } caption="Copy Link" onClick={ copyUrlToClipboard } />
                {!isReadonlyPreset && (
                    <>
                        <DropdownMenuSplitter key="delete-splitter" />
                        <DropdownMenuButton icon={ ActionDeleteOutlineIcon } caption="Delete" cx={ css.deleteButton } onClick={ deleteHandler } />
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
                icon={ MenuIcon }
                size="18"
            />
        );
    }, []);

    return (
        <Dropdown renderBody={ renderBody } renderTarget={ renderTarget } placement="bottom-end" middleware={ [offset(22)] } />
    );
}
