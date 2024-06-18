import React from 'react';
import { uuiElement, uuiMarkers, DataRowProps } from '@epam/uui-core';
import { IconContainer, DragHandle } from '@epam/uui-components';
import { Checkbox, CheckboxProps } from '../inputs';
import { ControlSize } from '../types';
import { settings } from '../../settings';
import { ReactComponent as FoldingArrow } from '@epam/assets/icons/navigation-chevron_down-outline.svg';
import css from './DataRowAddons.module.scss';

/**
 * Props of DataRowAddons.
 */
export interface DataRowAddonsProps<TItem, TId> {
    /** DataRowProps object for the row where an addon is placed. */
    rowProps: DataRowProps<TItem, TId>;
    /** HTML tabIndex attribute to set on the cell. */
    tabIndex?: React.HTMLAttributes<HTMLElement>['tabIndex'];
    /** Controls size. */
    size?: ControlSize | '60';
}

export function DataRowAddons<TItem, TId>(props: DataRowAddonsProps<TItem, TId>) {
    const row = props.rowProps;
    const getIndent = () => {
        return (row.indent - 1) * settings.sizes.rowAddons.indentUnit[props.size || 'default'];
    };

    const getWidth = () => {
        return settings.sizes.rowAddons.indentWidth[props.size || 'default'];
    };

    return (
        <>
            {row.dnd?.srcData && <DragHandle key="dh" cx={ css.dragHandle } />}
            {row?.checkbox?.isVisible && (
                <Checkbox
                    key="cb"
                    cx="uui-dr_addons-checkbox"
                    tabIndex={ props.tabIndex }
                    size={ settings.sizes.rowAddons.checkbox[props.size] as CheckboxProps['size'] }
                    value={ row.isChecked }
                    indeterminate={ !row.isChecked && row.isChildrenChecked }
                    onValueChange={ () => row.onCheck?.(row) }
                    isDisabled={ row.checkbox.isDisabled }
                    isInvalid={ row.checkbox.isInvalid }
                />
            )}
            {row.indent > 0 && (
                <div key="fold" className="uui-dr_addons-indent" style={ { marginInlineStart: getIndent(), width: getWidth() } }>
                    {row.isFoldable && (
                        <IconContainer
                            rawProps={ {
                                'aria-label': row.isFolded ? 'Unfold' : 'Fold',
                                role: 'button',
                            } }
                            key="icon"
                            icon={ FoldingArrow }
                            cx={ [
                                uuiElement.foldingArrow, uuiMarkers.clickable, css.iconContainer,
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
