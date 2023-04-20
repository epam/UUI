import React, { useMemo, useState } from 'react';
import { DndActor, IEditable, cx, DropParams, uuiDndState, getOrderBetween, DndActorRenderParams } from '@epam/uui-core';
import { FlexRow, DropMarker, FlexCell, Text, IconContainer, Panel } from '@epam/promo';
import sortBy from 'lodash.sortby';
import { DragHandle } from '@epam/uui-components';
import { ReactComponent as FileIcon } from '@epam/assets/icons/common/file-file-24.svg';
import css from './DndMaterial.scss';

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

export default function DndMaterial() {
    const [items, setItems] = useState<MaterialItem[]>([
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
    ]);

    const canAcceptDrop = (srcData: DropParams<MaterialItem, MaterialItem>) => ({
        top: true,
        bottom: true,
    });

    const updateItem = (item: MaterialItem) => setItems(items.map((i) => (i.id === item.id ? item : i)));

    const handleOnDrop = (params: DropParams<MaterialItem, MaterialItem>, prevItem: MaterialItem, nextItem: MaterialItem) => {
        const { srcData, dstData, position } = params;

        updateItem({
            ...srcData,
            order: position === 'bottom' ? getOrderBetween(dstData.order, nextItem?.order) : getOrderBetween(prevItem?.order, dstData.order),
        });
    };

    const renderMaterial = (item: MaterialItem, prevItem: MaterialItem, nextItem: MaterialItem) => (
        <DndActor
            key={item.id}
            srcData={item}
            dstData={item}
            canAcceptDrop={canAcceptDrop}
            onDrop={(params) => handleOnDrop(params, prevItem, nextItem)}
            render={(params: DndActorRenderParams) => (
                <div ref={params.ref} {...params.eventHandlers} className={cx(css.dragElement, params.classNames)}>
                    <Panel
                        background="white"
                        cx={cx(css.dndItem, {
                            [uuiDndState.dragGhost]: params.isDragGhost,
                        })}
                    >
                        <FlexRow cx={css.materialRow}>
                            <FlexCell width="auto" shrink={0} cx={css.iconWrapper}>
                                <DragHandle cx={[css.dragHandle]} />
                                <IconContainer size={48} icon={FileIcon} />
                            </FlexCell>
                            <FlexCell width="100%" cx={css.textWrapper}>
                                <Text cx={css.text} size="24" lineHeight="24" fontSize="16" font="sans-semibold">
                                    {item.name}
                                </Text>
                                <Text cx={css.text} size="24" lineHeight="24" fontSize="14" color="gray60">
                                    {item.description}
                                </Text>
                            </FlexCell>
                        </FlexRow>
                    </Panel>
                    <DropMarker {...params} />
                </div>
            )}
        />
    );

    const sortedItems = useMemo(() => sortBy(items, ['order']), [items]);

    return <FlexCell grow={1}>{sortedItems.map((i, index) => renderMaterial(i, sortedItems[index - 1], sortedItems[index + 1]))}</FlexCell>;
}
