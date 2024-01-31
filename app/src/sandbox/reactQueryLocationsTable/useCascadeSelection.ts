import { CascadeSelection, DataRowOptions, TreeParams, useCascadeSelectionService } from '@epam/uui-core';
import { useQueryClient } from '@tanstack/react-query';
import { Location } from '@epam/uui-docs';
import { Tree } from './Tree';
import { useMemo } from 'react';

export interface UseCascadeSelectionProps<TItem, TId> extends TreeParams<Location, string> {
    cascadeSelection: CascadeSelection;
    getRowOptions?: (item: TItem, index?: number) => DataRowOptions<TItem, TId>;
    rowOptions?: DataRowOptions<TItem, TId>;
}

export function useCascadeSelection({
    getId,
    getParentId,
    complexIds,
    cascadeSelection,
    getRowOptions,
    rowOptions,
}: UseCascadeSelectionProps<Location, string>) {
    const queryClient = useQueryClient();
    const blankTree = useMemo(() => Tree.blank({ getId, getParentId, complexIds }), []);

    const cascadeSelectionService = useCascadeSelectionService({
        tree: blankTree,
        cascadeSelection,
        getRowOptions,
        rowOptions,
        loadMissingRecordsOnCheck: () => null,
    });

    return cascadeSelectionService;
}
