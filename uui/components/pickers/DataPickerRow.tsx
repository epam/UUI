import * as React from 'react';
import { cx, DataRowProps, DataSourceState, FlattenSearchResultsConfig, Icon, isEventTargetInsideClickable, Overwrite, uuiMarkers, uuiMod } from '@epam/uui-core';
import { FlexSpacer, IconContainer } from '@epam/uui-components';
import { settings } from '../../settings';

import css from './DataPickerRow.module.scss';
import { PickerItem } from './PickerItem';
import type { PickerInputProps } from './PickerInput';
import { Text } from '../typography';
import { FlexCell } from '../layout';
import { DataRowAddons } from '../widgets';

export interface DataPickerRowModsOverride {
}

interface DataPickerRowMods {
    size?: '24' | '30' | '36' | '42' | '48';
    padding?: '12' | '24';
    alignActions?: 'top' | 'center';
}

export interface DataPickerRowProps<TItem, TId> extends Overwrite<DataPickerRowMods, DataPickerRowModsOverride>, DataRowProps<TItem, TId>,
    Pick<PickerInputProps<TItem, TId>, 'renderRow' | 'highlightSearchMatches' | 'getName'>, FlattenSearchResultsConfig {
    /** Render callback for part of the content part of the row - between left addons and right select icon.
     * If omitted, default `PickerItem` component will be rendered.
     */
    renderItem?: (item: TItem, rowProps: DataRowProps<TItem, TId>, dataSourceState?: DataSourceState) => React.ReactNode;
    /** DataSourceState of the Picker.
     * Usually provided via renderRow callback params
     * */
    dataSourceState?: DataSourceState;
    /** A pure function that gets entity name from entity object */
    getName: (item: TItem) => string;
}

export function DataPickerRow<TItem, TId>(props: DataPickerRowProps<TItem, TId>) {
    const rowNode = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (props.onFocus) {
            rowNode.current?.addEventListener('mouseenter', handleMouseEnter);
        }
        return () => {
            rowNode.current?.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [props.onFocus]);

    const handleMouseEnter = () => {
        props.onFocus && props.onFocus(props.index);
    };

    const getSubtitle = ({ path }: DataRowProps<TItem, TId>) => {
        if (!props.dataSourceState?.search) return;

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
                size={ props.size || settings.pickerInput.sizes.body.row }
                dataSourceState={ props.dataSourceState }
                highlightSearchMatches={ props.highlightSearchMatches }
                { ...(props.flattenSearchResults ? { subtitle: getSubtitle(rowProps) } : {}) }
                { ...rowProps }
            />
        );
    };
    
    const renderContent = () => {
        let content: React.ReactNode;

        if (props.isLoading) {
            content = settings.pickerInput.renderPlaceholder({ rowSize: props.size });
        } else if (props.isUnknown) {
            content = (
                <Text size={ props.size }>
                    Unknown
                </Text>
            );
        } else {
            const SelectIcon = (typeof settings.pickerInput.icons.body.selectIcon === 'function'
                ? settings.pickerInput.icons.body.selectIcon(props.size)
                : settings.pickerInput.icons.body.selectIcon) as Icon;

            content = (
                <>
                    {renderRowItem(props.value, props)}
                    <FlexSpacer />
                    {(props.isChildrenSelected || props.isSelected) && (
                        <div className={ cx(css.iconWrapper, 'uui-picker_input-row-select_icon', uuiMod.selected) }>
                            <IconContainer
                                size={ settings.pickerInput.sizes.body.selectIconMap[props.size] }
                                icon={ SelectIcon }
                                cx={ props.isChildrenSelected ? css.iconDefault : css.selectedMark }
                                rawProps={ { 'aria-label': props.isChildrenSelected
                                    ? 'Child is selected'
                                    : 'Selected' } }
                            />
                        </div>
                    )}
                </>
            );
        }

        return (
            <FlexCell
                grow={ 1 }
                width={ 0 }
                minWidth={ 0 }
                cx={ css.rowContent }
            >
                <DataRowAddons size={ props.size } rowProps={ props } tabIndex={ -1 } />
                <div className={ css.contentWrapper }>
                    {content}
                </div>
            </FlexCell>
        );
    };

    const clickHandler = props.onClick || props.onSelect || props.onFold || props.onCheck;

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <div
            onClick={ clickHandler && ((e) => !isEventTargetInsideClickable(e) && clickHandler(props)) }
            role="option"
            aria-busy={ props.isLoading }
            aria-posinset={ props.index + 1 }
            aria-checked={ props.checkbox?.isVisible ? props.isChecked : null }
            aria-selected={ props.isSelectable ? props.isSelected : null }
            ref={ rowNode }
            className={ cx(
                css.pickerRow,
                'uui-picker_input-row',
                `uui-size-${props.size || settings.pickerInput.sizes.body.row}`,
                css[`align-widgets-${props.alignActions || 'top'}`],
                clickHandler && props.isFocused && uuiMod.focus,
                clickHandler && uuiMarkers.clickable,
                props.cx,
            ) }
            style={ props.padding && {
                '--uui-data_picker-horizontal-padding': `${props.padding}px`,
            } as React.CSSProperties }
            { ...props.rawProps }
        >
            {renderContent()}
        </div>
    );
}
