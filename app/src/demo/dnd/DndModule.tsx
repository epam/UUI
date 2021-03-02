import * as React from 'react';
import * as css from './DndModule.scss';
import { DndActor, cx, DropParams, getOrderBetween, IEditable } from '@epam/uui';
import { FlexRow, IconContainer, DropMarker, FlexCell, Text } from '@epam/promo';
import { DragHandle } from '@epam/uui-components';

import * as completeIcon from '@epam/assets/icons/common/notification-check-fill-24.svg';
import * as scheduleIcon from '@epam/assets/icons/common/action-schedule-24.svg';

export interface ModuleItem {
    id: number;
    name: string;
    order?: string;
    tasks: { complete: number, schedule: number };
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
    }

    handleOnDrop = ({ srcData, dstData, position }: DropParams<ModuleItem, ModuleItem>) => {
        let newOrder = position === 'bottom'
            ? getOrderBetween(dstData.order, this.props.nextModule?.order)
            : getOrderBetween(this.props.prevModule?.order, dstData.order);

        this.props.onValueChange({ ...srcData, order: newOrder });
    }


    render() {
        const item = this.props.value;
        return <DndActor
            key={ item.id }
            srcData={ item }
            dstData={ item }
            canAcceptDrop={ this.handleCanAcceptDrop }
            onDrop={ this.handleOnDrop }
            render={ props => {
                return <div { ...props.eventHandlers } className={ cx(css.dragElement, props.classNames) }>
                    <div className={ css.dndItem }>
                        <FlexRow background="white" size='48' padding='12' spacing='12' >
                            <DragHandle cx={ [css.dragHandle] } />
                            <IconContainer
                                icon={ item.isCompleted ? completeIcon : scheduleIcon }
                                color={ item.isCompleted ? 'green' : 'gray50' }
                                cx={ cx(css.moduleIcon, item.isCompleted ? css.completeIcon : css.scheduleIcon) }
                            />
                            <FlexCell width='auto' >
                                <Text size='18' fontSize='14' lineHeight='18' >{ item.name }</Text>
                                <Text size='18' fontSize='12' lineHeight='18' color='gray60' >{ `${ item.tasks.complete }/${ item.tasks.schedule } tasks completed` }</Text>
                            </FlexCell>
                        </FlexRow>
                    </div>
                    <DropMarker { ...props } enableBlocker />
                </div>;
            } }
        />;
    }
}