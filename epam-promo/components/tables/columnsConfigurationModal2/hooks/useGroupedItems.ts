import { useMemo } from "react";

type TItemsByGroupContent<I> = { items?: I[], itemsFiltered?: I[] };
export type TItemsByGroup<I> = {
    [key: string]: TItemsByGroupContent<I>;
};

interface IUseGroupedItems<I> {
    groups: string[];
    items?: I[];
    onGetGroup: (item: I) => string;
    onFilter: (item: I) => boolean;
}

interface IUseGroupedItemsResult<I> {
    byGroup: TItemsByGroup<I>;
}

export function useGroupedItems<I>(props: IUseGroupedItems<I>): IUseGroupedItemsResult<I> {
    const { items, onFilter, onGetGroup, groups } = props;

    const byGroup = useMemo(() => {
        const accUnsorted = groups
            .reduce<TItemsByGroup<I>>((acc, id) => {
                acc[id] = {};
                return acc;
            }, {}) as TItemsByGroup<I>;
        return items.reduce((acc, i) => {
            const isVisible = onFilter(i);
            const groupKey = onGetGroup(i);
            if (!groups.includes(groupKey)) {
                console.error(`Unknown group: ${groupKey}`);
                return acc;
            }

            if (!acc[groupKey]) {
                acc[groupKey] = {};
            }
            if (!acc[groupKey].items) {
                acc[groupKey].items = [];
            }
            acc[groupKey].items.push(i);
            if (isVisible) {
                if (!acc[groupKey].itemsFiltered) {
                    acc[groupKey].itemsFiltered = [];
                }
                acc[groupKey].itemsFiltered.push(i);
            }
            return acc;
        }, accUnsorted);
    }, [items, onFilter, onGetGroup, groups]);

    return {
        byGroup,
    };
}
