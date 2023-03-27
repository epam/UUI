import { getSearchFilter } from "../../../querying";
import { LoadableTree } from "./LoadableTree";
import { ApplyFilterOptions, ApplySearchOptions, ITree, ItemsComparator } from "./ITree";
import { ApplyStableSort } from "../BaseListView";

export class Tree<TItem, TId> extends LoadableTree<TItem, TId> {
    public filter<TFilter>(options: ApplyFilterOptions<TItem, TId, TFilter>): ITree<TItem, TId> {
        const filter = options.getFilter?.(options.filter);
        return this.applyMatchToTree(filter);
    }

    public search<TFilter>(options: ApplySearchOptions<TItem, TId, TFilter>): ITree<TItem, TId> {
        const search = this.buildSearchFilter(options);
        return this.applyMatchToTree(search);
    }

    public sort(applyStableSort: ApplyStableSort<TItem>) {
        const sortedItems: TItem[] = [];
        const sortRec = (items: TItem[]) => {
            sortedItems.push(...applyStableSort(items));
            items.forEach((item) => {
                const children = this.getChildren(item);
                sortRec(children);
            });
        };

        sortRec(this.getRootItems());
        return Tree.create({ ...this.params }, sortedItems);
    }

    private buildSearchFilter<TFilter>({ search, getSearchFields }: ApplySearchOptions<TItem, TId, TFilter>) {
        if (!search) return null;

        if (!getSearchFields) {
            console.warn("[Tree] Search value is set, but options.getSearchField is not specified. Nothing to search on.");
            return null;
        }
        const searchFilter = getSearchFilter(search);
        return (i: TItem) => searchFilter(getSearchFields(i));
    }

    private applyMatchToTree(isMatchingFn: undefined | ((item: TItem) => boolean)) {
        if (!isMatchingFn) return this;

        const matchedItems: TItem[] = [];
        const applyMatchRec = (items: TItem[]) => {
            let isSomeMatching = false;
            items.forEach((item) => {
                const isItemMatching = isMatchingFn?.(item) ?? true;
                const isSomeChildMatching = applyMatchRec(this.getChildren(item));
                const isMatching = isItemMatching || isSomeChildMatching;
                if (isMatching) {
                    matchedItems.push(item);
                }

                if (!isSomeMatching) {
                    isSomeMatching = isMatching;
                }

            });

            return isSomeMatching;
        };

        applyMatchRec(this.getRootItems());

        return Tree.create({ ...this.params }, matchedItems);
    }
}
