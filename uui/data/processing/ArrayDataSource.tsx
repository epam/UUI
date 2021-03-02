import React, { useEffect } from 'react';
import { BaseDataSource } from './BaseDataSource';
import { DataSourceState, IArrayDataSource, TreeNode } from './types';
import { ArrayListView, ArrayListViewProps, IDataSourceView } from './views';

export type ArrayDataSourceProps<TItem, TId, TFilter> = ArrayListViewProps<TItem, TId, TFilter> & {
    items: TItem[];
};

export class ArrayDataSource<TItem = any, TId = any, TFilter = any> extends BaseDataSource<TItem, TId, TFilter> implements IArrayDataSource<TItem, TId, TFilter> {
    props: ArrayDataSourceProps<TItem, TId, TFilter>;

    constructor(props: ArrayDataSourceProps<TItem, TId, TFilter>) {
        super(props);
        this.props = props;
        this.updateIndexes(props.items);
    }

    byKey: { [key: string]: TreeNode<TItem, TId> };
    byParentKey: { [key: string]: TreeNode<TItem, TId>[] };
    nodes: TreeNode<TItem, TId>[];
    rootNodes: TreeNode<TItem, TId>[] = [];
    maxDepth: number;


    public getById = (id: TId) => {
        let key = this.idToKey(id);
        let node = this.byKey[key];
        if (!node) {
            return null;
        }
        return node.item;
    }

    protected getKey(item: TItem) {
        return JSON.stringify(this.getId(item));
    }

    protected idToKey(id: TId) {
        return JSON.stringify(id);
    }

    setItem(item: TItem): void {
        // TODO
    }

    /* indexing, sorting */
    protected updateIndexes(items: TItem[]) {
        const getParentId = this.props.getParentId || ((item: TItem) => (item as any).parentId);

        this.nodes = items.map((item: TItem, index: number) => {
            const parentId = getParentId(item);
            return {
                item,
                index,
                id: this.getId(item),
                key: this.getKey(item),
                parentId,
                parentKey: parentId != null ? this.idToKey(parentId) : null,
                path: [],
                children: [],
            } as TreeNode<TItem, TId>;
        });

        this.byKey = {};
        this.byParentKey = {};
        this.maxDepth = 0;

        this.nodes.forEach(node => {
            this.byKey[node.key] = node;
            if (node.parentKey != null) {
                this.byParentKey[node.parentKey] = this.byParentKey[node.parentKey] || [];
                this.byParentKey[node.parentKey].push(node);
            } else {
                this.rootNodes.push(node);
            }
        });

        this.nodes.forEach(node => {
            let key = node.key;
            do {
                node.path.unshift(key);
                if (node.path.length > 100500) {
                    throw new Error("Depth too big, do you have an cyclic dependency in your data?");
                }
                key = this.byKey[key].parentKey;
            } while (key != null);

            let depth = node.path.length;
            if (this.maxDepth < depth) {
                this.maxDepth = depth;
            }

            if (node.parentKey) {
                this.byKey[node.parentKey].children.push(node);
            }
        });
    }

    getView(value: DataSourceState<any, TId>, onValueChange: (val: DataSourceState<any, TId>) => any, props?: Partial<ArrayListViewProps<TItem, TId, TFilter>>): IDataSourceView<TItem, TId, TFilter> {
        const view = this.views.get(onValueChange) as ArrayListView<TItem, TId, TFilter>;
        const viewProps: ArrayListViewProps<TItem, TId, TFilter> = {
            //...this.props,
            ...props,
            getId: this.getId,
        };

        if (view) {
            view.update(value, viewProps);
            return view;
        } else {
            const newView: any = new ArrayListView(this, { value, onValueChange }, viewProps);
            this.views.set(onValueChange, newView);
            return newView;
        }
    }

    useView(value: DataSourceState<any, TId>, onValueChange: (val: DataSourceState<any, TId>) => any, options?: ArrayListViewProps<TItem, TId, TFilter>): IDataSourceView<TItem, TId, TFilter> {
        useEffect(() => () => this.unsubscribeView(onValueChange), [this]);

        return this.getView(value, onValueChange, options);
    }
}
