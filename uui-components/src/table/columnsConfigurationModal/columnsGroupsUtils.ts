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

export const getGroupsWithColumns = <TItem, TId>(columnGroups: DataColumnGroupProps[], columns: DataColumnProps<TItem, TId>[]) => {
    const columnGroupsByKey = getGroupsByKey(columnGroups);
    if (!columnGroupsByKey) {
        return columns;
    }

    return columns.reduce<Array<GroupOfColumns<TItem, TId> | DataColumnProps<TItem, TId>>>((columnsAndGroups, column) => {
        if (column.group) {
            const group = columnGroupsByKey[column.group];
            if (!group) {
                throw new Error(`The '${column.group}' group mentioned in the '${column.key}' column is undefined.`);
            }
            const lastItem = columnsAndGroups[columnsAndGroups.length - 1];
            if (lastItem && isGroupOfColumns(lastItem) && lastItem.group.key === column.group) {
                lastItem.columns.push(column);
                return columnsAndGroups;
            }

            columnsAndGroups.push({ type: 'group', group: columnGroupsByKey[column.group], columns: [column] });
            return columnsAndGroups;
        }

        columnsAndGroups.push(column);
        return columnsAndGroups;
    }, []);
};
