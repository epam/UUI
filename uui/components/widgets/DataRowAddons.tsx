import React from 'react';
import cx from 'classnames';
import { uuiElement, uuiMarkers, DataRowProps, DndEventHandlers, Overwrite } from '@epam/uui-core';
import { IconContainer, DragHandle } from '@epam/uui-components';
import { Checkbox } from '../inputs';
import type { ControlSize } from '../types';
import { settings } from '../../settings';

import css from './DataRowAddons.module.scss';

interface DataRowAddonsMods {
    /** Controls size. */
    size?: ControlSize | '60';
}

export interface DataRowAddonsModsOverride {}

interface DataRowAddonsCoreProps<TItem, TId> {
    /** DataRowProps object for the row where an addon is placed. */
    rowProps: DataRowProps<TItem, TId>;
    /** HTML tabIndex attribute to set on the cell. */
    tabIndex?: React.HTMLAttributes<HTMLElement>['tabIndex'];
    /**
     * Drag'n'drop marker event handlers.
     */
    eventHandlers?: DndEventHandlers;
}

/**
 * Props of DataRowAddons.
 */
export interface DataRowAddonsProps<TItem, TId> extends DataRowAddonsCoreProps<TItem, TId>, Overwrite<DataRowAddonsMods, DataRowAddonsModsOverride> {}

export function DataRowAddons<TItem, TId>(props: DataRowAddonsProps<TItem, TId>) {
    const row = props.rowProps;
    const getIndent = () => {
        return (row.indent - 1) * settings.dataTable.sizes.body.indentUnitMap[props.size || settings.dataTable.sizes.body.row];
    };

    const getWidth = () => {
        return settings.dataTable.sizes.body.indentWidthMap[props.size || settings.dataTable.sizes.body.row];
    };

    return (
        <>
            {row.dnd?.srcData && <DragHandle key="dh" cx={ css.dragHandle } rawProps={ { ...props.eventHandlers } } /> }
            {row?.checkbox?.isVisible && (
                <Checkbox
                    key="cb"
                    cx="uui-dr_addons-checkbox"
                    tabIndex={ props.tabIndex }
                    size={ settings.dataTable.sizes.body.checkboxMap[props.size] }
                    value={ row.isChecked }
                    indeterminate={ !row.isChecked && row.isChildrenChecked }
                    onValueChange={ () => row.onCheck?.(row) }
                    isDisabled={ row.checkbox.isDisabled }
                    isInvalid={ row.checkbox.isInvalid }
                />
            )}
            {row.indent > 0 && (
                <div
                    key="fold"
                    className={ cx('uui-dr_addons-indent', `uui-size-${props.size || settings.dataTable.sizes.body.row}`) }
                    style={ { marginInlineStart: getIndent(), width: getWidth() } }
                >
                    {row.isFoldable && (
                        <IconContainer
                            rawProps={ {
                                'aria-label': row.isFolded ? 'Unfold' : 'Fold',
                                role: 'button',
                            } }
                            key="icon"
                            icon={ settings.dataTable.icons.body.foldingIcon }
                            cx={ [
                                uuiElement.foldingArrow, uuiMarkers.clickable, css.iconContainer,
                            ] }
                            rotate={ row.isFolded ? '90ccw' : '0' }
                            onClick={ () => row.onFold(row) }
                            size={ settings.dataTable.sizes.body.iconMap[props.size || settings.dataTable.sizes.body.row] }
                        />
                    )}
                </div>
            )}
        </>
    );
}
