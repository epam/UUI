import * as React from 'react';
import {
    IHasCX,
    IHasChildren,
    IEditable,
    TreeNode,
    getSearchFilter,
    IAnalyticableOnChange,
    useUuiContext,
    useArrayDataSource,
} from "@epam/uui-core";

export interface TreeNodeProps<TItem extends TreeListItem = TreeListItem> extends TreeNode<TItem, string> {
    data: TItem;
    depth: number;
    isDropdown?: boolean;
    isOpen?: boolean;
    onClick(): void;
}

export interface TreeListItem {
    id: string;
    data?: TreeListItem;
    parentId?: string;
    name?: string;
}

export interface TreeProps<TItem extends TreeListItem> extends IHasCX, IHasChildren, IEditable<string[]>, IAnalyticableOnChange<string[]> {
    items: TreeListItem[];
    renderRow(row: TreeNodeProps<TItem>): void;
    search?: string;
}

export function Tree<TItem extends TreeListItem>(props: TreeProps<TItem>) {
    const context = useUuiContext();

    const dataSource = useArrayDataSource<TItem, string, unknown>({
        items: props.items as TItem[],
    }, [props.items]);

    const [list, setList] = React.useState<TreeNodeProps<TItem>[]>([]);

    const toggleValue = React.useCallback((item: TreeNode<TItem, string>) => {
        const isUnfolded = props.value.includes(item.id);
        if (isUnfolded) {
            return props.value.filter((i) => i !== item.id);
        }
        return [...props.value, item.id];
    }, [props]);

    const toggleFolding = React.useCallback((item: TreeNode<TItem, string>) => {
        const valueAfterToggle = toggleValue(item);
        props.onValueChange(valueAfterToggle);

        if (props.getValueChangeAnalyticsEvent) {
            const event = props.getValueChangeAnalyticsEvent(valueAfterToggle, props.value);
            context.uuiAnalytics.sendEvent(event);
        }
    }, [context.uuiAnalytics, props, toggleValue]);

    const getNodes = React.useCallback((item: TreeNode<TItem, string>, depth: number) => {
        const items: TreeNodeProps<TItem>[] = [];
        const children: TreeNodeProps<TItem>[] = [];
        const isUnfolded = props.value.includes(item.id);
        const applySearch = props.search && getSearchFilter(props.search);
        const isPassedSearch = applySearch ? applySearch([item.item.name]) : true;

        if (item.children?.length) {
            item.children.forEach((i) => children.push(...getNodes(i, depth + 1)));
        }

        if (!props.value.includes(item.id)) {
            if (applySearch && children.length > 0) {
                props.onValueChange([...props.value, item.id]);
            }
        }

        if (isPassedSearch || children.length > 0) {
            items.push({
                ...item,
                data: item.item,
                depth,
                isDropdown: item.children && !!item.children.length,
                isOpen: isUnfolded,
                onClick: () => toggleFolding(item),
            });
        }

        if (item.children?.length && isUnfolded) {
            items.push(...children);
        }

        return items;
    }, [props, toggleFolding]);

    const getListRecursive = React.useCallback(() => dataSource.rootNodes.flatMap((node) => getNodes(node, 0)), [dataSource.rootNodes, getNodes]);

    React.useEffect(() => {
        setList(getListRecursive());
    }, [getListRecursive, props.search, props.value]);

    if (list.length === 0) return null;

    return (
        <>
            { list.map(i => <React.Fragment key={ i.id }>
                <>
                    { props.renderRow(i) }
                </>
            </React.Fragment>) }
        </>
    );
}
