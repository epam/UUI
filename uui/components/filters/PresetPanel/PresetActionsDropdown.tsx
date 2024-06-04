import React, { useCallback } from 'react';
import { IPresetsApi, IDropdownToggler, ITablePreset, useUuiContext, DataTableState, DropdownBodyProps } from '@epam/uui-core';
import { Dropdown, DropdownMenuBody, DropdownMenuButton, SuccessNotification } from '../../overlays';
import { IconButton } from '../../buttons';
import { Text } from '../../typography';
import { FlexRow } from '../../layout';
import { ReactComponent as MenuIcon } from '@epam/assets/icons/navigation-more_vert-outline.svg';
import { ReactComponent as SaveInCurrentIcon } from '@epam/assets/icons/navigation-refresh-outline.svg';
import { ReactComponent as SaveAsNewIcon } from '@epam/assets/icons/action-save-outline.svg';
import { ReactComponent as DiscardChangesIcon } from '@epam/assets/icons/content-edit_undo-outline.svg';
import { ReactComponent as CopyIcon } from '@epam/assets/icons/action-copy_content-outline.svg';
import { ReactComponent as RenameIcon } from '@epam/assets/icons/content-edit-fill.svg';
import { ReactComponent as CopyLinkIcon } from '@epam/assets/icons/content-link-outline.svg';
import { ReactComponent as DeleteIcon } from '@epam/assets/icons/action-delete_forever-fill.svg';
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
                        <Text size="36" fontSize="14">
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
                            <FlexRow key={ `${props.preset.id}-save-in-current` }>
                                <DropdownMenuButton icon={ SaveInCurrentIcon } caption="Save in current" onClick={ saveInCurrentHandler } />
                            </FlexRow>
                        )}
                        <FlexRow key={ `${props.preset.id}-save-as-new` }>
                            <DropdownMenuButton icon={ SaveAsNewIcon } caption="Save as new" onClick={ props.addPreset } />
                        </FlexRow>
                        <FlexRow key={ `${props.preset.id}-discard` }>
                            <DropdownMenuButton icon={ DiscardChangesIcon } caption="Discard all changes" onClick={ discardAllChangesHandler } />
                        </FlexRow>
                    </>
                )}
                { isRenameAvailable && (
                    <FlexRow key={ `${props.preset.id}-rename` } borderTop={ isPresetChanged }>
                        <DropdownMenuButton icon={ RenameIcon } caption="Rename" onClick={ props.renamePreset } />
                    </FlexRow>
                )}
                <FlexRow key={ `${props.preset.id}-duplicate` }>
                    <DropdownMenuButton icon={ CopyIcon } caption="Duplicate" onClick={ duplicateHandler } />
                </FlexRow>
                <FlexRow key={ `${props.preset.id}-copyLink` }>
                    <DropdownMenuButton icon={ CopyLinkIcon } caption="Copy Link" onClick={ copyUrlToClipboard } />
                </FlexRow>
                {!isReadonlyPreset && (
                    <FlexRow key={ `${props.preset.id}-delete` } cx={ css.deleteRow } borderTop={ true }>
                        <DropdownMenuButton icon={ DeleteIcon } caption="Delete" cx={ css.deleteButton } onClick={ deleteHandler } />
                    </FlexRow>
                )}
            </DropdownMenuBody>
        );
    };

    const renderTarget = useCallback((dropdownProps: IDropdownToggler) => {
        return (
            <IconButton
                cx={ [css.tabButton, dropdownProps.isOpen && css.targetOpen] }
                color={ props.preset.id === props.activePresetId ? 'info' : 'neutral' }
                { ...dropdownProps }
                icon={ MenuIcon }
                size="18"
            />
        );
    }, []);

    return (
        <Dropdown renderBody={ renderBody } renderTarget={ renderTarget } placement="bottom-end" modifiers={ [{ name: 'offset', options: { offset: [0, 22] } }] } />
    );
}
