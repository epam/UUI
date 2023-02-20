import React, { useCallback, useState } from 'react';
import sortBy from 'lodash.sortby';
import { i18n } from '../../../i18n';
import { DataTableState, IPresetsApi, ITablePreset } from '@epam/uui-core';
import { AdaptiveItemProps, AdaptivePanel } from '@epam/uui-components';
import css from './PresetsPanel.scss';
import { Button, Dropdown, DropdownContainer, DropdownMenuButton, FlexCell, FlexRow } from '../../index';
import { Preset } from './Preset';
import { PresetInput } from './PresetInput';
import { ReactComponent as DeleteIcon } from '@epam/assets/icons/common/action-deleteforever-18.svg';
import { ReactComponent as addIcon } from '@epam/assets/icons/common/content-plus_bold-18.svg';

interface PresetsBlockProps extends IPresetsApi {
    tableState: DataTableState;
}

type PresetAdaptiveItem = AdaptiveItemProps<{ preset?: ITablePreset }>;

export const PresetsPanel = (props: PresetsBlockProps) => {
    const [isAddingPreset, setIsAddingPreset] = useState(false);

    const setAddingPreset = useCallback(() => {
        setIsAddingPreset(true);
    }, []);

    const cancelAddingPreset = useCallback(() => {
        setIsAddingPreset(false);
    }, []);

    const { presets, ...presetApi } = props;

    const renderPreset = (preset: ITablePreset) => {
        return <Preset key={preset.id} preset={preset} addPreset={setAddingPreset} {...presetApi} />;
    };

    const renderAddPresetButton = useCallback(() => {
        return (
            <div key="addingPresetBlock" className={css.addPresetContainer}>
                {!isAddingPreset ? (
                    <Button
                        size="36"
                        onClick={setAddingPreset}
                        caption={i18n.presetPanel.addCaption}
                        icon={addIcon}
                        iconPosition="left"
                        fill="light"
                        color="blue"
                    />
                ) : (
                    <PresetInput onCancel={cancelAddingPreset} onSuccess={props.createNewPreset} />
                )}
            </div>
        );
    }, [isAddingPreset]);

    const onPresetDropdownSelect = (preset: PresetAdaptiveItem) => {
        props.choosePreset(preset.preset);
        props.updatePreset(preset.preset);
    };

    const renderMoreButtonDropdown = (item: PresetAdaptiveItem, hiddenItems: PresetAdaptiveItem[]) => {
        return (
            <Dropdown
                renderTarget={props => (
                    <FlexRow>
                        <div className={css.divider} />
                        <Button fill="light" color="gray50" caption={`${hiddenItems?.length || ''} more`} {...props} />
                    </FlexRow>
                )}
                renderBody={() => (
                    <DropdownContainer width={230}>
                        {hiddenItems.map(item => (
                            <DropdownMenuButton
                                onClick={() => onPresetDropdownSelect(item)}
                                caption={item.preset.name}
                                icon={!item.preset.isReadonly && DeleteIcon}
                                iconPosition="right"
                                cx={css.dropdownDeleteIcon}
                                onIconClick={!item.preset.isReadonly && (() => props.deletePreset(item.preset))}
                            />
                        ))}
                    </DropdownContainer>
                )}
            />
        );
    };

    const getPresetPriority = (preset: ITablePreset, index: number) => {
        return preset.id === props.activePresetId ? 100499 : 1000 - index;
    };

    const getPanelItems = (): PresetAdaptiveItem[] => {
        return [
            ...sortBy(props.presets, i => i.order).map((preset, index) => ({
                id: preset.id.toString(),
                render: () => renderPreset(preset),
                priority: getPresetPriority(preset, index),
                preset: preset,
            })),
            { id: 'collapsedContainer', render: renderMoreButtonDropdown, priority: 100501, collapsedContainer: true },
            { id: 'addPreset', render: renderAddPresetButton, priority: 100501 },
        ];
    };

    return (
        <FlexCell grow={1} minWidth={310}>
            <FlexRow size={null} spacing="12" cx={css.presetsWrapper}>
                <AdaptivePanel items={getPanelItems()} />
            </FlexRow>
        </FlexCell>
    );
};
