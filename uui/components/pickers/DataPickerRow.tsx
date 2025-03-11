import * as React from 'react';
import { DataRowProps, DataSourceState, FlattenSearchResultsConfig, Overwrite } from '@epam/uui-core';
import { DataPickerRow as UUIDataPickerRow } from '@epam/uui-components';
import { DataPickerCell } from './DataPickerCell';
import { settings } from '../../settings';

import css from './DataPickerRow.module.scss';
import { PickerItem } from './PickerItem';
import type { PickerInputProps } from './PickerInput';

export interface DataPickerRowModsOverride {
}

interface DataPickerRowMods {
    size?: '24' | '30' | '36' | '42' | '48';
    padding?: '12' | '24';
    alignActions?: 'top' | 'center';
}

export interface DataPickerRowProps<TItem, TId> extends Overwrite<DataPickerRowMods, DataPickerRowModsOverride>, DataRowProps<TItem, TId>,
    Pick<PickerInputProps<TItem, TId>, 'renderRow' | 'highlightSearchMatches' | 'getName'>, FlattenSearchResultsConfig {
    renderItem?: (item: TItem, rowProps: DataRowProps<TItem, TId>, dataSourceState?: DataSourceState) => React.ReactNode;
    /** DataSourceState of the Picker.
     * Usually provided via renderRow callback params
     * */
    dataSourceState?: DataSourceState;
    /** A pure function that gets entity name from entity object */
    getName: (item: TItem) => string;
}

export function DataPickerRow<TItem, TId>(props: DataPickerRowProps<TItem, TId>) {
    const getSubtitle = ({ path }: DataRowProps<TItem, TId>, { search }: DataSourceState) => {
        if (!search) return;

        return path
            .map(({ value }) => props.getName(value))
            .filter(Boolean)
            .join(' / ');
    };

    const renderRowItem = (item: TItem, rowProps: DataRowProps<TItem, TId>) => {
        if (props.renderItem) {
            return props.renderItem(item, rowProps, props.dataSourceState);
        }

        return (
            <PickerItem
                title={ props.getName(item) }
                size={ props.size }
                dataSourceState={ props.dataSourceState }
                highlightSearchMatches={ props.highlightSearchMatches }
                { ...(props.flattenSearchResults ? { subtitle: getSubtitle(rowProps, props.value) } : {}) }
                { ...rowProps }
            />
        );
    };

    const renderContent = () => {
        return (
            <DataPickerCell
                key="name"
                size={ props.size || settings.pickerInput.sizes.body.row }
                padding={ props.padding || settings.pickerInput.sizes.body.padding }
                rowProps={ props }
                alignActions={ props.alignActions || 'top' }
                renderItem={ renderRowItem }
            />
        );
    };

    return (
        <UUIDataPickerRow
            { ...props }
            cx={ [css.pickerRow, 'uui-picker_input-row', props.cx] }
            renderContent={ renderContent }
        />
    );
}
