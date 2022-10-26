import * as React from "react";
import * as styles from "./ColumnRow.scss";
import { cx, DataColumnProps, DndActor, DndActorRenderParams, IColumnConfig } from "@epam/uui-core";
import { FlexRow, Checkbox, DropMarker } from "../../.";
import { DragHandle, FlexSpacer, IManageableColumn } from "@epam/uui-components";
import { PinIconButton } from "./PinIconButton";

type DndDataType = { column: DataColumnProps, columnConfig: IColumnConfig };

export interface IColumnRow {
    column: IManageableColumn;
}

const returnByCondition = <T, F>(condition: boolean, ifTrue: T, ifFalse: F) => {
    return condition ? ifTrue : ifFalse;
};

export const ColumnRow = React.memo(function ColumnRow(props: IColumnRow) {
    const { column } = props;
    const { toggleVisibility, togglePin, onCanAcceptDrop, onDrop, columnConfig, isDndAllowed, isPinnedAlways } = column;
    const { isVisible, fix } = columnConfig;
    const isPinned = fix || isPinnedAlways;
    const data = { column, columnConfig };

    const renderContent = (dndActorParams: DndActorRenderParams) => {
        const wrapperClasses = cx(
            styles.rowWrapper,
            !isPinned && styles.notPinned,
            ...returnByCondition(isDndAllowed, dndActorParams.classNames, []),
        );
        const { onTouchStart, onPointerDown, ...restEventHandlers } = dndActorParams.eventHandlers;
        const wrapperAttrs = {
            ...returnByCondition(isDndAllowed, { ref: dndActorParams.ref }, {}),
            ...returnByCondition(isDndAllowed, { rawProps: {...restEventHandlers} }, {}),
        };
        const dragHandleRawProps = {
            ...returnByCondition(isDndAllowed, { onTouchStart, onPointerDown }, {}),
        };

        return (
            <FlexRow cx={ wrapperClasses } { ...wrapperAttrs } padding="24">
                <FlexRow background="white" spacing='6' cx={ styles.title }>
                    <span { ...dragHandleRawProps }>
                        <DragHandle isDisabled={ !isDndAllowed } cx={ [styles.dragHandle, !isDndAllowed && styles.dndDisabled] } />
                    </span>
                    <Checkbox
                        key={ column.key }
                        label={ column.caption }
                        value={ isVisible }
                        onValueChange={ toggleVisibility }
                        isDisabled={ column.isAlwaysVisible || !!column.fix }
                    />
                </FlexRow>
                <FlexSpacer />
                <FlexRow cx={ styles.pinIconButton }>
                    <PinIconButton
                        id={ column.key }
                        isPinned={ !!isPinned }
                        canUnpin={ !isPinnedAlways }
                        onTogglePin={ togglePin }
                    />
                </FlexRow>
                <DropMarker { ...dndActorParams } />
            </FlexRow>
        );
    };

    return (
        <DndActor<DndDataType, DndDataType>
            key={ column.key }
            srcData={ data }
            dstData={ data }
            canAcceptDrop={ onCanAcceptDrop }
            onDrop={ onDrop }
            render={ renderContent }
        />
    );
});
