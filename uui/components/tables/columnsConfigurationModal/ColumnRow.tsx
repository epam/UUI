import * as React from 'react';
import { cx, DataColumnProps, DndActor, DndActorRenderParams, uuiDndState } from '@epam/uui-core';
import { DragHandle, ColumnsConfigurationRowProps } from '@epam/uui-components';
import { FlexRow } from '../../layout';
import { Checkbox } from '../../inputs';
import { DropMarker } from '../../dnd';
import { PinIconButton } from './PinIconButton';
import { settings } from '../../../settings';

import css from './ColumnRow.module.scss';

export interface ColumnRowProps<TItem, TId, TFilter> {
    column: ColumnsConfigurationRowProps;
    renderItem?: (column: DataColumnProps<TItem, TId, TFilter>) => React.ReactNode;
}

export const ColumnRow = React.memo(function ColumnRow(props: ColumnRowProps<any, any, any>) {
    const { column } = props;
    const {
        toggleVisibility, togglePin, onCanAcceptDrop, onDrop, columnConfig, isDndAllowed, isPinnedAlways, isDndDisabled,
    } = column;
    const { isVisible, fix } = columnConfig;
    const pinPosition = fix || (isPinnedAlways ? 'left' : undefined);
    const isPinned = !!pinPosition;
    const data = { column, columnConfig };

    const renderContent = (dndActorParams: DndActorRenderParams) => {
        const wrapperClasses = cx(
            css.rowWrapper,
            !isPinned && css.notPinned,
            dndActorParams.isDragGhost && uuiDndState.dragGhost,
            'uui-dt-columns-config-row',
        );

        const { onTouchStart, onPointerDown, ...restEventHandlers } = dndActorParams.eventHandlers;

        const { ref, ...dndActorPropsWithoutRef } = dndActorParams;

        return (
            <FlexRow
                size={ settings.dataTable.sizes.columnsConfigurationModal.columnRow }
                cx={ wrapperClasses }
                ref={ dndActorParams.ref }
                rawProps={ { ...restEventHandlers } }
                alignItems="top"
            >
                { isDndAllowed && (
                    <DragHandle
                        dragHandleIcon={ settings.dataTable.icons.columnsConfigurationModal.dragIndicator }
                        rawProps={ { onTouchStart, onPointerDown } }
                        isDisabled={ isDndDisabled }
                        cx={ cx(css.dragHandle, isDndDisabled && css.dndDisabled) }
                    />
                ) }
                <Checkbox
                    key={ column.key }
                    label={ props.renderItem ? props.renderItem(props.column) : column.caption }
                    value={ isVisible }
                    onValueChange={ toggleVisibility }
                    isReadonly={ column.isAlwaysVisible || column.isLocked }
                    cx={ css.checkbox }
                />
                <FlexRow
                    size={ null }
                    cx={ css.pinIconButton }
                >
                    <PinIconButton pinPosition={ pinPosition } canUnpin={ !isPinnedAlways } onTogglePin={ togglePin } />
                </FlexRow>
                <DropMarker { ...dndActorPropsWithoutRef } />
            </FlexRow>
        );
    };

    return (
        <DndActor
            key={ column.key }
            srcData={ isDndAllowed && data }
            dstData={ data }
            canAcceptDrop={ onCanAcceptDrop }
            onDrop={ onDrop }
            render={ renderContent }
        />
    );
});
