import * as React from 'react';
import * as css from './DndMaterial.scss';
import { DndActor, IEditable, IDndActor, cx, DropParams, uuiDndState, getOrderBetween, DndActorRenderParams } from '@epam/uui';
import { FlexRow, DropMarker, FlexCell, Text, IconContainer, Panel } from '@epam/promo';
import { DragHandle } from '@epam/uui-components';
import * as fileIcon from '@epam/assets/icons/common/file-file-24.svg';
import sortBy from "lodash.sortby";

export interface MaterialItem {
    id: number;
    name: string;
    description: string;
    order?: string;
}

export interface DndMaterialProps extends IEditable<MaterialItem> {
    prevMaterial: MaterialItem;
    nextMaterial: MaterialItem;
}

const items = [
    {
        id: 1,
        name: 'File_Name_1.suffix',
        description: 'Additional information 1',
        order: 'a',
    },
    {
        id: 2,
        name: 'File_Name_2.suffix',
        description: 'Additional information 2',
        order: 'b',
    },
    {
        id: 3,
        name: 'File_Name_3.suffix',
        description: 'Additional information 3',
        order: 'c',
    },
    {
        id: 4,
        name: 'File_Name_4.suffix',
        description: 'Additional information 4',
        order: 'd',
    },
];

export class DndMaterial extends React.Component {
    state = {
        items: items,
    };

    canAcceptDrop = (srcData: DropParams<MaterialItem, MaterialItem>) => {
        return {
            top: true,
            bottom: true,
        };
    }

    updateItem(item: MaterialItem) {
        this.setState({ items: this.state.items.map(i => i.id === item.id ? item : i) });
    }

    handleOnDrop = (params: DropParams<MaterialItem, MaterialItem>, prevItem: MaterialItem, nextItem: MaterialItem) => {
        const { srcData, dstData, position } = params;

        let newOrder = position === 'bottom'
            ? getOrderBetween(dstData.order, nextItem?.order)
            : getOrderBetween(prevItem?.order, dstData.order);

        this.updateItem({ ...srcData, order: newOrder });
    }

    renderMaterial(item: MaterialItem, prevItem: MaterialItem, nextItem: MaterialItem) {
        return <DndActor
            key={ item.id }
            srcData={ item }
            dstData={ item }
            canAcceptDrop={ this.canAcceptDrop }
            onDrop={ (params) => this.handleOnDrop(params, prevItem, nextItem) }
            render={ (params: DndActorRenderParams) => {
                return (
                    <div { ...params.eventHandlers } className={ cx(css.dragElement, params.isDraggedOut && uuiDndState.draggedOut, params.isDropAccepted && uuiDndState.dropAccepted) }>
                        <Panel background='white' cx={ cx(css.dndItem, params.isDragGhost && uuiDndState.dragGhost) } >
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
                        <DropMarker { ...params } />
                    </div>
                );
            } }
        />;
    }

    render() {
        const sortedItems = sortBy(this.state.items, ['order']);

        return (
            <FlexCell grow={ 1 }>
                { sortedItems.map((i, index) => this.renderMaterial(i, sortedItems[index - 1], sortedItems[index + 1])) }
            </FlexCell>
        );
    }
}