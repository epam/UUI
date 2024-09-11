import * as React from 'react';
import { DataPickerCellProps, uuiMod, cx, Overwrite } from '@epam/uui-core';
import { FlexSpacer, IconContainer } from '@epam/uui-components';
import { PickerCellMods, PickerCellModsOverride } from './types';
import { TextPlaceholder, Text, TextProps } from '../typography';
import { DataRowAddons } from '../widgets';
import { FlexCell } from '../layout';
import { settings } from '../../settings';
import { ReactComponent as BoldTickIcon } from '@epam/assets/icons/notification-done-fill.svg';
import { ReactComponent as TickIcon } from '@epam/assets/icons/notification-done-outline.svg';
import css from './DataPickerCell.module.scss';

export function DataPickerCell<TItem, TId>(props: DataPickerCellProps<TItem, TId> & Overwrite<PickerCellMods, PickerCellModsOverride>) {
    const ref = React.useRef<HTMLDivElement>();

    let content: React.ReactNode;

    if (props.rowProps.isLoading) {
        content = (
            // remove `css.loadingCell` after` removing `margin: 0 3px 3px 0` from `TextPlaceholder` `loadingWord` class styles.
            <Text key="t" size={ settings.sizes.pickerInput.body.dropdown.row.cell.text[props.size] as TextProps['size'] } cx={ css.loadingCell }>
                <TextPlaceholder />
            </Text>
        );
    } else if (props.rowProps.isUnknown) {
        content = (
            <Text key="t" size={ settings.sizes.pickerInput.body.dropdown.row.cell.text[props.size] as TextProps['size'] }>
                Unknown
            </Text>
        );
    } else {
        content = (
            <div key={ `${props.rowProps.id}` } className={ css.renderItem }>
                {props.renderItem(props.rowProps.value, props.rowProps)}
                <FlexSpacer />
                {(props.rowProps.isChildrenSelected || props.rowProps.isSelected) && (
                    <div className={ cx(css.iconWrapper, uuiMod.selected) }>
                        <IconContainer
                            size={ settings.sizes.pickerInput.body.dropdown.row.cell.icon[props.size] }
                            icon={ settings.sizes.pickerInput.body.dropdown.row.cell.isBoldSelectionIcon[props.size as never] ? BoldTickIcon : TickIcon }
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
