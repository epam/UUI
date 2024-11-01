import { DataColumnGroupProps, DataColumnProps } from '@epam/uui-core';

interface GroupOfColumns<TItem, TId> {
    type: 'group';
    group: DataColumnGroupProps;
    columns: DataColumnProps<TItem, TId>[];
}

const getGroupsByKey = (groups: DataColumnGroupProps[]) => {
    if (!groups) {
        return null;
    }
    const gRec = groups.reduce<Record<string, DataColumnGroupProps>>(
        (g, group) => ({ ...g, [group.key]: group }),
        {},
    );
    return !Object.keys(gRec).length ? null : gRec;
};

export const isGroupOfColumns = <TItem, TId>(
    item: GroupOfColumns<TItem, TId> | DataColumnProps<TItem, TId>,
): item is GroupOfColumns<TItem, TId> => 'type' in item && item.type === 'group';

export const getGroupsWithColumns = <TItem, TId>(groups: DataColumnGroupProps[], columns: DataColumnProps<TItem, TId>[]) => {
    const groupsByKey = getGroupsByKey(groups);
    return columns.reduce<Array<GroupOfColumns<TItem, TId> | DataColumnProps<TItem, TId>>>((columnsAndGroups, column) => {
        if (column.group) {
            const lastItem = columnsAndGroups[columnsAndGroups.length - 1];
            if (lastItem && isGroupOfColumns(lastItem) && lastItem.group.key === column.group) {
                lastItem.columns.push(column);
                return columnsAndGroups;
            }
            columnsAndGroups.push({ type: 'group', group: groupsByKey[column.group], columns: [column] });
            return columnsAndGroups;
        }

        columnsAndGroups.push(column);
        return columnsAndGroups;
    }, []);
};
