import { useMemo } from 'react';
import { DataColumnGroupProps, DataColumnProps } from '../types';

export function useColumnGroups<TItem, TId>(groups: DataColumnGroupProps[], columns: DataColumnProps<TItem, TId>[]) {
    const groupsRecord = useMemo(() => (groups ?? [])
        .reduce<Record<string, DataColumnGroupProps>>(
        (groupsRec, group) => ({ ...groupsRec, [group.key]: group }),
        {},
    ), [groups]);

    const visiblGroups = useMemo(() => Object.values(
        columns.reduce<Record<string, DataColumnGroupProps>>((vGroups, column) => {
            if (column.group) {
                vGroups[column.group] = groupsRecord[column.group];
                return vGroups;
            }
            return vGroups;
        }, {}),
    ), [groupsRecord, columns]);

    return { groups: visiblGroups };
}
