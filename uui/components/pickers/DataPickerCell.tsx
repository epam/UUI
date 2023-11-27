import * as React from 'react';
import { uuiMarkers, DataPickerCellProps } from '@epam/uui-core';
import { DataPickerCell as UuiDataPickerCell } from '@epam/uui-components';
import { PickerCellMods } from './types';
import { Checkbox } from '../inputs';
import { ReactComponent as FoldingArrow } from '@epam/assets/icons/common/navigation-chevron-down-18.svg';
import { IconContainer } from '../layout';
import { TextPlaceholder, Text } from '../typography';

import css from './DataPickerCell.module.scss';
import './variables.scss';

function DataPickerRowAddons<TItem, TId>(props: DataPickerCellProps<TItem, TId> & PickerCellMods) {
    const row = props.rowProps;
    const additionalItemSize = +props.size < 30 ? '12' : '18';

    return (
        <>
            {row?.checkbox?.isVisible && (
                <Checkbox
                    key="cb"
                    cx={ css.checkbox }
                    tabIndex={ props.tabIndex }
                    size={ additionalItemSize }
                    value={ row.isChecked }
                    indeterminate={ !row.isChecked && row.isChildrenChecked }
                    onValueChange={ () => row.onCheck?.(row) }
                    isDisabled={ row.checkbox.isDisabled }
                    isInvalid={ row.checkbox.isInvalid }
                />
            )}
            {row.indent > 0 && (
                <div key="fold" className={ css.indent } style={ { marginLeft: (row.indent - 1) * 24 } }>
                    {row.isFoldable && (
                        <IconContainer
                            rawProps={ {
                                'aria-label': row.isFolded ? 'Unfold' : 'Fold',
                                role: 'button',
                            } }
                            key="icon"
                            icon={ FoldingArrow }
                            cx={ [
                                css.foldingArrow, css[`folding-arrow-${additionalItemSize}`], uuiMarkers.clickable, css.iconContainer,
                            ] }
                            rotate={ row.isFolded ? '90ccw' : '0' }
                            onClick={ () => row.onFold(row) }
                        />
                    )}
                </div>
            )}
        </>
    );
}

export function DataPickerCell<TItem, TId>(props: DataPickerCellProps<TItem, TId> & PickerCellMods) {
    return (
        <UuiDataPickerCell
            { ...props }
            cx={ [
                'uui-dt-vars',
                'data-picker-cell',
                props.cx,
                css.cell,
                css['size-' + (props.size || '36')],
                css[`padding-${props.padding || '12'}`],
                props.isFirstColumn && css[`padding-left-${props.padding || '24'}`],
                props.isLastColumn && css['padding-right-24'],
                css[`align-widgets-${props.alignActions || 'top'}`],
            ] }
            renderPlaceholder={ () => (
                // remove `css.loadingCell` after` removing `margin: 0 3px 3px 0` from `TextPlaceholder` `loadingWord` class styles.
                <Text key="t" size={ props.size !== '60' ? props.size : '48' } cx={ css.loadingCell }>
                    <TextPlaceholder />
                </Text>
            ) }
            renderUnknown={ () => (
                <Text key="t" size={ props.size !== '60' ? props.size : '48' }>
                    Unknown
                </Text>
            ) }
            addons={ props.isFirstColumn && <DataPickerRowAddons { ...props } /> }
        />
    );
}
