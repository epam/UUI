import * as React from 'react';
import css from './DndCriterion.module.scss';
import {
    DndActor, IEditable, cx, DropParams, getOrderBetween,
} from '@epam/uui-core';
import { FlexRow, DropMarker, Checkbox } from '@epam/uui';
import { DragHandle } from '@epam/uui-components';

export interface CriterionItem {
    id: number;
    sectionId: number;
    name: string;
    order?: string;
    isChecked: boolean;
    kind: 'criterion';
}

export interface DndCriterionProps extends IEditable<CriterionItem> {
    nextCriterion: CriterionItem;
    prevCriterion: CriterionItem;
}

export class DndCriterion extends React.Component<DndCriterionProps> {
    handleCanAcceptDrop = ({ srcData, dstData }: DropParams<CriterionItem, CriterionItem>) => {
        if (srcData.kind === 'criterion' && srcData.sectionId === dstData.sectionId) {
            return {
                top: true,
                bottom: true,
            };
        }
    };

    handleOnDrop = ({ srcData, dstData, position }: DropParams<CriterionItem, CriterionItem>) => {
        const newOrder = position === 'bottom' ? getOrderBetween(dstData.order, this.props.nextCriterion?.order) : getOrderBetween(this.props.prevCriterion?.order, dstData.order);

        this.props.onValueChange({ ...srcData, order: newOrder });
    };

    render() {
        const item = this.props.value;
        return (
            <DndActor
                key={ item.id }
                id={ item.id }
                srcData={ item }
                dstData={ item }
                canAcceptDrop={ this.handleCanAcceptDrop }
                onDrop={ this.handleOnDrop }
                render={ (props) => {
                    return (
                        <div
                            ref={ props.ref }
                            onPointerEnter={ props.eventHandlers.onPointerEnter }
                            onPointerMove={ props.eventHandlers.onPointerMove }
                            onPointerLeave={ props.eventHandlers.onPointerLeave }
                            onPointerUp={ props.eventHandlers.onPointerUp }
                            className={ cx(css.dragElement, props.classNames) }
                        >
                            <div className={ css.dndItem }>
                                <DragHandle
                                    cx={ [css.dragHandle] }
                                    rawProps={ {
                                        onTouchStart: props.eventHandlers.onTouchStart,
                                        onPointerDown: props.eventHandlers.onPointerDown,
                                    } }
                                />
                                <FlexRow background="surface-main" vPadding="12" padding="18" cx={ css.row }>
                                    <Checkbox
                                        value={ item.isChecked }
                                        onValueChange={ (newValue) => this.props.onValueChange({ ...item, isChecked: newValue }) }
                                        label={ item.name }
                                    />
                                </FlexRow>
                            </div>
                            <DropMarker { ...props } />
                        </div>
                    );
                } }
            />
        );
    }
}
