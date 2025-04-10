import React, { useCallback, useState } from 'react';
import { i18n } from '../../../i18n';
import type { DataTableState, IHasRawProps, IPresetsApi, ITablePreset } from '@epam/uui-core';
import { orderBy } from '@epam/uui-core';
import type { AdaptiveItemProps } from '@epam/uui-components';
import { AdaptivePanel } from '@epam/uui-components';
import { Button } from '../../buttons';
import { FlexCell, FlexRow, ScrollBars } from '../../layout';
import { Dropdown, DropdownMenuBody, DropdownMenuButton } from '../../overlays';
import { Preset } from './Preset';
import { PresetInput } from './PresetInput';
import { UUI_PRESETS_PANEL_ADD_BUTTON, UUI_PRESETS_PANEL_MORE_BUTTON } from './constants';
import { settings } from '../../../settings';

import css from './PresetsPanel.module.scss';

export interface PresetsPanelProps extends IPresetsApi, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    /** Current state value of the table(list) */
    tableState: DataTableState;
}

type PresetAdaptiveItem = AdaptiveItemProps<{ preset?: ITablePreset }>;

export function PresetsPanel(props: PresetsPanelProps) {
    const [isAddingPreset, setIsAddingPreset] = useState(false);

    const setAddingPreset = useCallback(() => {
        setIsAddingPreset(true);
    }, []);

    const cancelAddingPreset = useCallback(() => {
        setIsAddingPreset(false);
    }, []);

    const { presets, ...presetApi } = props;

    const renderPreset = (preset: ITablePreset) => {
        return <Preset key={ preset.id } preset={ preset } addPreset={ setAddingPreset } { ...presetApi } />;
    };

    const renderAddPresetButton = useCallback(() => {
        return (
            <div key="addingPresetBlock" className={ css.addPresetContainer }>
                {!isAddingPreset ? (
                    <Button
                        cx={ UUI_PRESETS_PANEL_ADD_BUTTON }
                        onClick={ setAddingPreset }
                        caption={ i18n.presetPanel.addCaption }
                        icon={ settings.presetsPanel.icons.addIcon }
                        iconPosition="left"
                        fill="ghost"
                        color="primary"
                    />
                ) : (
                    <PresetInput
                        onCancel={ cancelAddingPreset }
                        onSuccess={ props.createNewPreset }
                    />
                )}
            </div>
        );
    }, [isAddingPreset]);

    const onPresetDropdownSelect = (preset: PresetAdaptiveItem) => {
        props.choosePreset(preset.preset);
    };

    const renderMoreButtonDropdown = (item: PresetAdaptiveItem, hiddenItems: PresetAdaptiveItem[]) => {
        return (
            <Dropdown
                key="more"
                renderTarget={ (props) => (
                    <FlexRow>
                        <div className={ css.divider } />
                        <Button
                            cx={ UUI_PRESETS_PANEL_MORE_BUTTON }
                            fill="ghost"
                            color="secondary"
                            caption={ `${hiddenItems?.length || ''} more` }
                            { ...props }
                        />
                    </FlexRow>
                ) }
                renderBody={ (propsBody) => (
                    <DropdownMenuBody minWidth={ 230 } maxHeight={ 300 } { ...propsBody }>
                        <ScrollBars>
                            {hiddenItems.map((hiddenItem) => (
                                <DropdownMenuButton
                                    key={ hiddenItem.preset.id }
                                    onClick={ () => onPresetDropdownSelect(hiddenItem) }
                                    caption={ hiddenItem.preset.name }
                                    icon={ !hiddenItem.preset.isReadonly && settings.presetsPanel.icons.deleteIcon }
                                    iconPosition="right"
                                    cx={ css.dropdownDeleteIcon }
                                    onIconClick={ !hiddenItem.preset.isReadonly && (() => props.deletePreset(hiddenItem.preset)) }
                                />
                            ))}
                        </ScrollBars>
                    </DropdownMenuBody>
                ) }
            />
        );
    };

    const getPresetPriority = (preset: ITablePreset, index: number) => {
        return preset.id === props.activePresetId ? 100499 : 1000 - index;
    };

    const getPanelItems = (): PresetAdaptiveItem[] => {
        return [
            ...orderBy(props.presets, ({ order }) => order)
                .map((preset, index) => ({
                    id: preset.id.toString(),
                    render: () => renderPreset(preset),
                    priority: getPresetPriority(preset, index),
                    preset: preset,
                })),
            {
                id: 'collapsedContainer', render: renderMoreButtonDropdown, priority: 100501, collapsedContainer: true,
            },
            { id: 'addPreset', render: renderAddPresetButton, priority: 100501 },
        ];
    };

    return (
        <FlexCell grow={ 1 } minWidth={ 310 } rawProps={ props.rawProps }>
            <FlexRow size={ null } columnGap="12" cx={ css.presetsWrapper }>
                <AdaptivePanel items={ getPanelItems() } />
            </FlexRow>
        </FlexCell>
    );
}
