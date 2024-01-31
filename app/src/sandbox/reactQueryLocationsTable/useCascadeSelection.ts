import { CascadeSelection, CascadeSelectionTypes, DataRowOptions, DataSourceState, FetchingHelper, IMap, LazyDataSourceApi, TreeParams, useCascadeSelectionService, Tree as UUITree } from '@epam/uui-core';
import { useQueryClient } from '@tanstack/react-query';
import { Location } from '@epam/uui-docs';
import { Tree } from './Tree';
import { useCallback, useMemo } from 'react';
import isEqual from 'lodash.isequal';

export interface UseCascadeSelectionProps<TItem, TId> extends TreeParams<Location, string> {
    api: LazyDataSourceApi<Location, string, unknown>,
    cascadeSelection?: CascadeSelection;
    getRowOptions?: (item: TItem, index?: number) => DataRowOptions<TItem, TId>;
    rowOptions?: DataRowOptions<TItem, TId>;
    dataSourceState: DataSourceState<any, string>;
    isFolded: (item: Location) => boolean;
    itemsMap?: IMap<TId, Location>;
}

const LOCATIONS_SELECTION_QUERY = 'locations-selection';

export function useCascadeSelection({
    api,
    getId,
    getParentId,
    complexIds,
    cascadeSelection = false,
    getRowOptions,
    rowOptions,
    dataSourceState,
    isFolded,
    itemsMap,
}: UseCascadeSelectionProps<Location, string>) {
    const queryClient = useQueryClient();
    const blankTree = useMemo(() => Tree.blank({ getId, getParentId, complexIds }, itemsMap), []);
    const loadMissingRecordsOnCheck = useCallback(async (id: string, isChecked: boolean, isRoot: boolean) => {
        queryClient.invalidateQueries({ queryKey: [LOCATIONS_SELECTION_QUERY] });

        return await queryClient.fetchQuery<
        Tree,
        Error,
        Tree,
        [string, DataSourceState<Record<string, any>, any>, (item: Location) => boolean, CascadeSelection]
        >({
                queryKey: [LOCATIONS_SELECTION_QUERY, dataSourceState, isFolded, cascadeSelection],
                queryFn: async ({ queryKey: [, _dataSourceState, _isFolded, _cascadeSelection] }) => {
                    const prevTree = queryClient.getQueryData<Tree>([LOCATIONS_SELECTION_QUERY]) ?? blankTree;

                    const isImplicitMode = _cascadeSelection === CascadeSelectionTypes.IMPLICIT;

                    if (!_cascadeSelection && !isRoot) {
                        return prevTree;
                    }

                    const loadNestedLayersChildren = !isImplicitMode;
                    const parents = UUITree.getParents(id, prevTree);

                    const { loadedItems, byParentId, nodeInfoById } = await FetchingHelper.load<Location, string, unknown>({
                        tree: prevTree,
                        options: {
                            api,
                            getChildCount: (l) => l.childCount,
                            isFolded: _isFolded,
                            filter: _dataSourceState?.filter,
                            loadAllChildren: (itemId) => {
                                if (!_cascadeSelection) {
                                    return isChecked && isRoot;
                                }

                                if (isImplicitMode) {
                                    return itemId === undefined || parents.some((parent) => isEqual(parent, itemId));
                                }

                                // `isEqual` is used, because complex ids can be recreated after fetching of parents.
                                // So, they should be compared not by reference, but by value.
                                return isRoot || isEqual(itemId, id) || (dataSourceState.search && parents.some((parent) => isEqual(parent, itemId)));
                            },
                            isLoadStrict: true,
                        },
                        withNestedChildren: loadNestedLayersChildren,
                        dataSourceState: { ..._dataSourceState, search: null },
                    });
                    const newTree = prevTree.update(loadedItems, byParentId, nodeInfoById);
                    queryClient.setQueryData([LOCATIONS_SELECTION_QUERY], newTree);

                    return newTree;
                },
                initialData: () => queryClient.getQueryData([LOCATIONS_SELECTION_QUERY]),
            });
    }, [api, blankTree, cascadeSelection, dataSourceState, isFolded, queryClient]);

    const cascadeSelectionService = useCascadeSelectionService({
        tree: blankTree,
        cascadeSelection,
        getRowOptions,
        rowOptions,
        loadMissingRecordsOnCheck,
    });

    return cascadeSelectionService;
}
