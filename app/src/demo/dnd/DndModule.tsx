import * as React from 'react';
import css from './DndModule.module.scss';
import {
    DndActor, cx, DropParams, getOrderBetween, IEditable,
} from '@epam/uui-core';
import {
    FlexRow, IconContainer, DropMarker, FlexCell, Text,
} from '@epam/uui';
import { DragHandle } from '@epam/uui-components';

import { ReactComponent as CompleteIcon } from '@epam/assets/icons/common/notification-check-fill-24.svg';
import { ReactComponent as ScheduleIcon } from '@epam/assets/icons/common/action-schedule-24.svg';

export interface ModuleItem {
    id: number;
    name: string;
    order?: string;
    tasks: { complete: number; schedule: number };
    isDeleted?: boolean;
    isCompleted?: boolean;
    kind: 'module';
}

export interface DndModuleProps extends IEditable<ModuleItem> {
    nextModule: ModuleItem;
    prevModule: ModuleItem;
}

export class DndModule extends React.Component<DndModuleProps> {
    handleCanAcceptDrop = ({ srcData: { kind } }: DropParams<ModuleItem, ModuleItem>) => {
        if (kind === 'module') {
            return {
                top: true,
                bottom: true,
            };
        }
    };

    handleOnDrop = ({ srcData, dstData, position }: DropParams<ModuleItem, ModuleItem>) => {
        const newOrder = position === 'bottom' ? getOrderBetween(dstData.order, this.props.nextModule?.order) : getOrderBetween(this.props.prevModule?.order, dstData.order);

        this.props.onValueChange({ ...srcData, order: newOrder });
    };

    render() {
        const item = this.props.value;
        return (
            <DndActor
                key={ item.id }
                id= { item.id }
                srcData={ item }
                dstData={ item }
                canAcceptDrop={ this.handleCanAcceptDrop }
                onDrop={ this.handleOnDrop }
                render={ (props) => {
                    return (
                        <div ref={ props.ref } { ...props.eventHandlers } className={ cx(css.dragElement, props.classNames) }>
                            <div className={ css.dndItem }>
                                <FlexRow cx={ css.item } size="48" padding="12" columnGap="12">
                                    <DragHandle cx={ [css.dragHandle] } />
                                    <IconContainer
                                        icon={ item.isCompleted ? CompleteIcon : ScheduleIcon }
                                        cx={ cx(css.moduleIcon, item.isCompleted ? [css.completeIcon, css.iconGreen] : [css.scheduleIcon, css.iconGray50]) }
                                    />
                                    <FlexCell width="auto">
                                        <Text size="18" fontSize="14" lineHeight="18">
                                            {item.name}
                                        </Text>
                                        <Text
                                            size="18"
                                            fontSize="12"
                                            lineHeight="18"
                                            color="secondary"
                                        >
                                            {`${item.tasks.complete}/${item.tasks.schedule} tasks completed`}
                                        </Text>
                                    </FlexCell>
                                </FlexRow>
                            </div>
                            <DropMarker { ...props } enableBlocker />
                        </div>
                    );
                } }
            />
        );
    }
}
