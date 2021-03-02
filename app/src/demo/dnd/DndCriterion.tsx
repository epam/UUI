import * as React from 'react';
import * as css from './DndCriterion.scss';
import { DndActor, IEditable, cx, DropParams, getOrderBetween } from '@epam/uui';
import { FlexRow, DropMarker, Checkbox } from '@epam/promo';
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
    }

    handleOnDrop = ({ srcData, dstData, position }: DropParams<CriterionItem, CriterionItem>) => {
        let newOrder = position === 'bottom'
                       ? getOrderBetween(dstData.order, this.props.nextCriterion?.order)
                       : getOrderBetween(this.props.prevCriterion?.order, dstData.order);

        this.props.onValueChange({ ...srcData, order: newOrder });
    }

    render() {
        const item = this.props.value;
        return (
            <DndActor
                key={ item.id }
                srcData={ item }
                dstData={ item }
                canAcceptDrop={ this.handleCanAcceptDrop }
                onDrop={ this.handleOnDrop }
                render={ props => {
                    return (
                        <div { ...props.eventHandlers } className={ cx(css.dragElement, props.classNames) }>
                            <div className={ css.dndItem }>
                                <DragHandle cx={ [css.dragHandle] } />
                                <FlexRow background='white' vPadding='12' padding='18' cx={ css.row }>
                                    <Checkbox
                                        value={ item.isChecked }
                                        onValueChange={ newValue => this.props.onValueChange({ ...item, isChecked: newValue }) }
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