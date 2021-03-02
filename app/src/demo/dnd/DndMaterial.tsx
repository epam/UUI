import * as React from 'react';
import * as css from './DndMaterial.scss';
import { DndActor, IEditable, IDndActor, cx, DropParams, uuiDndState, getOrderBetween } from '@epam/uui';
import { FlexRow, DropMarker, FlexCell, Text, IconContainer, Panel } from '@epam/promo';
import { DragHandle } from '@epam/uui-components';
import * as fileIcon from '@epam/assets/icons/common/file-file-24.svg';

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
    }

    handleOnDrop = (params: DropParams<MaterialItem, MaterialItem>) => {
        const { srcData, dstData, position } = params;
        if (srcData.sectionId === dstData.sectionId) {
            let newOrder = position === 'bottom'
                           ? getOrderBetween(dstData.order, this.props.nextMaterial?.order)
                           : getOrderBetween(this.props.prevMaterial?.order, dstData.order);

            this.props.onValueChange({ ...srcData, order: newOrder });
        } else {
            this.props.onDropFromSection(params);
        }
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
                return (
                    <div { ...props.eventHandlers } className={ cx(css.dragElement, props.isDraggedOut && uuiDndState.draggedOut, props.isDropAccepted && uuiDndState.dropAccepted) }>
                        <Panel background='white' cx={ cx(css.dndItem, props.isDragGhost && uuiDndState.dragGhost) } >
                            <FlexRow cx={ css.materialRow }>
                                <FlexCell width='auto'  shrink={ 0 } cx={ css.iconWrapper }>
                                    <DragHandle cx={ [css.dragHandle] } />
                                    <IconContainer size={ 48 } icon={ fileIcon } />
                                </FlexCell>
                                <FlexCell width="100%" cx={ css.textWrapper }>
                                    <Text cx={ css.text } size='24' lineHeight='24' fontSize='16' font='sans-semibold' >{ item.name }</Text>
                                    <Text cx={ css.text } size='24' lineHeight='24' fontSize='14' color='gray60'>{ item.description }</Text>
                                </FlexCell>
                            </FlexRow>
                        </Panel>
                        <DropMarker { ...props } />
                    </div>
                );
            } }
        />;
    }
}