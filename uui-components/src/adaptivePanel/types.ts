import { IHasCX, IHasRawProps } from '@epam/uui-core';

export type AdaptiveItemProps<T = unknown> = T & {
    /**
     * Render callback of the item. It renders items inside the panel and measures their width.
     * Pay attention that if you want to set some gaps between items, use AdaptivePanel property itemsGap.
     * */
    render: (item: AdaptiveItemProps<T>, hiddenItems?: AdaptiveItemProps<T>[], displayedItems?: AdaptiveItemProps<T>[]) => any;
    /**
     * Item collapsing priority. Items with lower priority will be hidden first.
     * If several items have the same priority, they will be hidden together, even if there's a place for one of them.
     * */
    priority: number;
    /** If true, this item will be shown when some other items was hidden; for example, you can use it to render dropdowns with hidden items.
     * You can provide more than one collapsedContainer item, but will be shown only those which has minimal priority, but this priority can't be less than the last hidden item’s priority. */
    collapsedContainer?: boolean;
    /** Unique ID of item */
    id: string;
};

export interface AdaptivePanelProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    /** Array of items to be rendered in AdaptivePanel */
    items: AdaptiveItemProps[];
    /** Defines size of the gap (gutter) between an element's 'items' in the AdaptivePanel */
    itemsGap?: number | '6' | '12' | '18' | '24' | '36';
}
