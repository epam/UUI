import * as React from 'react';
import css from './DndMaterial.module.scss';
import {
    DndActor, IEditable, cx, DropParams, uuiDndState, getOrderBetween,
} from '@epam/uui-core';
import {
    FlexRow, DropMarker, FlexCell, Text, IconContainer, Panel,
} from '@epam/uui';
import { DragHandle } from '@epam/uui-components';
import { ReactComponent as FileIcon } from '@epam/assets/icons/common/file-file-24.svg';

export interface MaterialItem {
    id: number;
    sectionId: number;
    name: string;
    description: string;
    order?: string;
    kind: 'material';
}

export interface DndMaterialProps extends IEditable<MaterialItem> {
    prevMaterial: MaterialItem;
    nextMaterial: MaterialItem;
    onDropFromSection(data: DropParams<MaterialItem, MaterialItem>): void;
}

export class DndMaterial extends React.Component<DndMaterialProps> {
    handleCanAcceptDrop = ({ srcData: { kind } }: DropParams<MaterialItem, MaterialItem>) => {
        if (kind === 'material') {
            return {
                top: true,
                bottom: true,
            };
        }
    };

    handleOnDrop = (params: DropParams<MaterialItem, MaterialItem>) => {
        const { srcData, dstData, position } = params;
        if (srcData.sectionId === dstData.sectionId) {
            const newOrder = position === 'bottom' ? getOrderBetween(dstData.order, this.props.nextMaterial?.order) : getOrderBetween(this.props.prevMaterial?.order, dstData.order);

            this.props.onValueChange({ ...srcData, order: newOrder });
        } else {
            this.props.onDropFromSection(params);
        }
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
                render={ (props) => (
                    <div { ...props.eventHandlers } ref={ props.ref } className={ cx(css.dragElement, props.classNames) }>
                        <Panel background="surface-main" cx={ cx(css.dndItem, props.isDragGhost && uuiDndState.dragGhost) }>
                            <FlexRow cx={ css.materialRow }>
                                <FlexCell width="auto" shrink={ 0 } cx={ css.iconWrapper }>
                                    <DragHandle cx={ [css.dragHandle] } />
                                    <IconContainer size={ 48 } icon={ FileIcon } cx={ css.icon } />
                                </FlexCell>
                                <FlexCell width="100%" cx={ css.textWrapper }>
                                    <Text size="24" lineHeight="24" fontSize="16" fontWeight="600">
                                        {item.name}
                                    </Text>
                                    <Text size="24" lineHeight="24" fontSize="14" color="secondary">
                                        {item.description}
                                    </Text>
                                </FlexCell>
                            </FlexRow>
                        </Panel>
                        <DropMarker { ...props } />
                    </div>
                ) }
            />
        );
    }
}
