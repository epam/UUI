import { IHasCX, IHasRawProps } from '@epam/uui-core';

export type AdaptiveItemProps<T = unknown> = T & {
    render: (item: AdaptiveItemProps<T>, hiddenItems?: AdaptiveItemProps<T>[], displayedItems?: AdaptiveItemProps<T>[]) => any;
    priority: number;
    collapsedContainer?: boolean;
    id: string;
};

export interface AdaptivePanelProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    items: AdaptiveItemProps[];
}
