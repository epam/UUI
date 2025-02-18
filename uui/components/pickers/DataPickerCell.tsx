import * as React from 'react';
import { DataPickerCellProps as UuiCoreDataPickerCellProps, uuiMod, cx, Overwrite } from '@epam/uui-core';
import { FlexSpacer, IconContainer } from '@epam/uui-components';
import { TextPlaceholder, Text } from '../typography';
import { DataRowAddons } from '../widgets';
import { FlexCell } from '../layout';
import { PickerCellMods, PickerCellModsOverride } from './types';
import { settings } from '../../index';

import css from './DataPickerCell.module.scss';

export interface DataPickerCellProps<TItem, TId> extends UuiCoreDataPickerCellProps<TItem, TId>, Overwrite<PickerCellMods, PickerCellModsOverride> {}

export function DataPickerCell<TItem, TId>(props: DataPickerCellProps<TItem, TId>) {
    const ref = React.useRef<HTMLDivElement>();

    let content: React.ReactNode;

    if (props.rowProps.isLoading) {
        content = (
            // remove `css.loadingCell` after` removing `margin: 0 3px 3px 0` from `TextPlaceholder` `loadingWord` class styles.
            <Text key="t" size={ settings.pickerInput.sizes.body.cellTextMap[props.size] } cx={ css.loadingCell }>
                <TextPlaceholder />
            </Text>
        );
    } else if (props.rowProps.isUnknown) {
        content = (
            <Text key="t" size={ settings.pickerInput.sizes.body.cellTextMap[props.size] }>
                Unknown
            </Text>
        );
    } else {
        const SelectIcon = settings.pickerInput.sizes.body.cellIsBoldSelectionIcon[props.size]
            ? settings.pickerInput.icons.body.boldSelectIcon
            : settings.pickerInput.icons.body.selectIcon;

        content = (
            <div key={ `${props.rowProps.id}` } className={ css.renderItem }>
                {props.renderItem(props.rowProps.value, props.rowProps)}
                <FlexSpacer />
                {(props.rowProps.isChildrenSelected || props.rowProps.isSelected) && (
                    <div className={ cx(css.iconWrapper, uuiMod.selected) }>
                        <IconContainer
                            size={ settings.pickerInput.sizes.body.cellIconMap[props.size] }
                            icon={ SelectIcon }
                            cx={ props.rowProps.isChildrenSelected ? css.iconDefault : css.selectedMark }
                            rawProps={ { 'aria-label': props.rowProps.isChildrenSelected
                                ? 'Child is selected'
                                : 'Selected' } }
                        />
                    </div>
                )}
            </div>
        );
    }

    const getWrappedContent = () => (
        <div className={ css.contentWrapper }>
            {content}
        </div>
    );

    return (
        <FlexCell
            ref={ ref }
            grow={ 1 }
            width={ 0 }
            minWidth={ 0 }
            rawProps={ { role: 'cell' } }
            cx={ [
                css.root,
                props.cx,
                'data-picker-cell',
                props.size && `uui-size-${props.size}`,
                css[`align-widgets-${props.alignActions || 'top'}`],
            ] }
            style={ props.padding && {
                '--uui-data_picker_cell-horizontal-padding': `${props.padding}px`,
            } as React.CSSProperties }
        >
            <DataRowAddons size={ props.size } { ...props } tabIndex={ -1 } />
            {getWrappedContent()}
        </FlexCell>
    );
}
