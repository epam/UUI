import * as React from 'react';
import { cx, DataColumnProps, DndActor, DndActorRenderParams } from '@epam/uui-core';
import { FlexRow } from '../../layout';
import { Checkbox } from '../../inputs';
import { DropMarker } from '../../dnd';
import { DragHandle, ColumnsConfigurationRowProps } from '@epam/uui-components';
import { PinIconButton } from './PinIconButton';
import { ReactComponent as DragIndicatorIcon } from '@epam/assets/icons/common/action-drag_indicator-18.svg';
//
import styles from './ColumnRow.module.scss';

export interface ColumnRowProps<TItem, TId, TFilter> {
    column: ColumnsConfigurationRowProps;
    renderItem?: (column: DataColumnProps<TItem, TId, TFilter>) => React.ReactNode;
}

export const ColumnRow = /* @__PURE__ */React.memo(function ColumnRow(props: ColumnRowProps<any, any, any>) {
    const { column } = props;
    const {
        toggleVisibility, togglePin, onCanAcceptDrop, onDrop, columnConfig, isDndAllowed, isPinnedAlways,
    } = column;
    const { isVisible, fix } = columnConfig;
    const pinPosition = fix || (isPinnedAlways ? 'left' : undefined);
    const isPinned = !!pinPosition;
    const data = { column, columnConfig };

    const renderContent = (dndActorParams: DndActorRenderParams) => {
        const wrapperClasses = cx(styles.rowWrapper, !isPinned && styles.notPinned, ...(isDndAllowed ? dndActorParams.classNames : []));
        const { onTouchStart, onPointerDown, ...restEventHandlers } = dndActorParams.eventHandlers;
        const wrapperAttrs = {
            ...(isDndAllowed ? { ref: dndActorParams.ref } : {}),
            ...(isDndAllowed ? { rawProps: { ...restEventHandlers } } : {}),
        };
        const dragHandleRawProps: any = {
            ...(isDndAllowed ? { onTouchStart, onPointerDown } : {}),
        };

        const { ref, ...dndActorPropsWithoutRef } = dndActorParams;

        return (
            <FlexRow size="30" cx={ wrapperClasses } { ...wrapperAttrs }>
                <DragHandle
                    dragHandleIcon={ DragIndicatorIcon }
                    rawProps={ dragHandleRawProps }
                    isDisabled={ !isDndAllowed }
                    cx={ cx(styles.dragHandle, !isDndAllowed && styles.dndDisabled) }
                />
                <Checkbox
                    key={ column.key }
                    label={ props.renderItem ? props.renderItem(props.column) : column.caption }
                    value={ isVisible }
                    onValueChange={ toggleVisibility }
                    isDisabled={ column.isAlwaysVisible }
                    cx={ styles.checkbox }
                />
                <FlexRow size="30" cx={ styles.pinIconButton }>
                    <PinIconButton pinPosition={ pinPosition } canUnpin={ !isPinnedAlways } onTogglePin={ togglePin } />
                </FlexRow>
                <DropMarker { ...dndActorPropsWithoutRef } />
            </FlexRow>
        );
    };

    return (
        <DndActor
            key={ column.key }
            srcData={ data }
            dstData={ data }
            canAcceptDrop={ onCanAcceptDrop }
            onDrop={ onDrop }
            render={ renderContent }
        />
    );
});
