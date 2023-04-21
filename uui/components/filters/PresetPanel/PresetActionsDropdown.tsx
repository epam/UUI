import React, { useCallback } from 'react';
import css from './PresetActionsDropdown.scss';
import {
    IPresetsApi, IDropdownToggler, ITablePreset, useUuiContext, DataTableState,
} from '@epam/uui-core';
import { Dropdown, DropdownMenuButton, SuccessNotification } from '../../overlays';
import { IconButton } from '../../buttons';
import { Text } from '../../typography';
import { ReactComponent as menuIcon } from '@epam/assets/icons/common/navigation-more_vert-18.svg';
import { FlexRow, Panel } from '../../layout';
import { ReactComponent as SaveInCurrentIcon } from '@epam/assets/icons/common/action-update-18.svg';
import { ReactComponent as SaveAsNewIcon } from '@epam/assets/icons/common/save-outline-18.svg';
import { ReactComponent as DiscardChangesIcon } from '@epam/assets/icons/common/content-edit_undo-18.svg';
import { ReactComponent as CopyIcon } from '@epam/assets/icons/common/action-copy_content-18.svg';
import { ReactComponent as RenameIcon } from '@epam/assets/icons/common/content-edit-18.svg';
import { ReactComponent as CopyLinkIcon } from '@epam/assets/icons/common/content-link-18.svg';
import { ReactComponent as DeleteIcon } from '@epam/assets/icons/common/action-deleteforever-18.svg';

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
                        <Text size="36" font="regular" fontSize="14">
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

    const renderBody = () => {
        const isReadonlyPreset = props.preset.isReadonly;
        return (
            <Panel shadow={ true } cx={ css.presetDropdownPanel }>
                {props.activePresetId === props.preset.id && props.hasPresetChanged(props.preset) && (
                    <>
                        {!isReadonlyPreset && (
                            <FlexRow key={ `${props.preset.id}-save-in-current` }>
                                <DropdownMenuButton icon={ SaveInCurrentIcon } caption="Save in current" onClick={ saveInCurrentHandler } />
                            </FlexRow>
                        )}
                        <FlexRow key={ `${props.preset.id}-save-as-new` }>
                            <DropdownMenuButton icon={ SaveAsNewIcon } caption="Save as new" onClick={ props.addPreset } />
                        </FlexRow>
                        <FlexRow key={ `${props.preset.id}-discard` } borderBottom={ true }>
                            <DropdownMenuButton icon={ DiscardChangesIcon } caption="Discard all changes" onClick={ discardAllChangesHandler } />
                        </FlexRow>
                    </>
                )}
                {props.preset.id === props.activePresetId && !isReadonlyPreset && (
                    <FlexRow key={ `${props.preset.id}-rename` }>
                        <DropdownMenuButton icon={ RenameIcon } caption="Rename" onClick={ props.renamePreset } />
                    </FlexRow>
                )}
                <FlexRow key={ `${props.preset.id}-duplicate` }>
                    <DropdownMenuButton icon={ CopyIcon } caption="Duplicate" onClick={ duplicateHandler } />
                </FlexRow>
                <FlexRow borderBottom={ true } key={ `${props.preset.id}-copyLink` }>
                    <DropdownMenuButton icon={ CopyLinkIcon } caption="Copy Link" onClick={ copyUrlToClipboard } />
                </FlexRow>
                {!isReadonlyPreset && (
                    <FlexRow key={ `${props.preset.id}-delete` } cx={ css.deleteRow }>
                        <DropdownMenuButton icon={ DeleteIcon } caption="Delete" cx={ css.deleteButton } onClick={ deleteHandler } />
                    </FlexRow>
                )}
            </Panel>
        );
    };

    const renderTarget = useCallback((dropdownProps: IDropdownToggler) => {
        return (
            <IconButton
                cx={ dropdownProps.isOpen && css.targetOpen }
                color={ props.preset.id === props.activePresetId ? 'info' : 'default' }
                { ...dropdownProps }
                icon={ menuIcon }
            />
        );
    }, []);

    return (
        <Dropdown renderBody={ renderBody } renderTarget={ renderTarget } placement="bottom-end" modifiers={ [{ name: 'offset', options: { offset: [0, 22] } }] } />
    );
}
