import { renderHook, waitFor } from '@epam/uui-test-utils';
import { useSyncTree } from '../useSyncTree';
import { DataQueryFilter, DataSourceState } from '../../../../../../../../types';
import { LocationItem } from '../../../../../../__tests__/mocks';
import { demoData } from '@epam/uui-docs';
import { NOT_FOUND_RECORD } from '../../../../exposed';
import { ItemsStorage } from '../../../../ItemsStorage';
import { TreeStructure } from '../../../../treeStructure';

describe('useSyncTree', () => {
    let dataSourceState: DataSourceState<DataQueryFilter<LocationItem>, string>;
    const setDataSourceState = (newDsState: React.SetStateAction<DataSourceState<DataQueryFilter<LocationItem>, string>>) => {
        if (typeof newDsState === 'function') {
            dataSourceState = newDsState(dataSourceState);
            return;
        }
        dataSourceState = newDsState;
    };

    const items = demoData.locations;
    const getId = ({ id }: LocationItem) => id;
    const getParentId = ({ parentId }: LocationItem) => parentId;

    beforeEach(() => {
        jest.clearAllMocks();
        dataSourceState = { topIndex: 0, visibleCount: 3 };
    });

    it('should path through minimal props', async () => {
        const hookResult = renderHook(
            (props) => useSyncTree({
                type: 'sync',
                items,
                getId,
                dataSourceState,
                setDataSourceState,
                ...props,
            }, []),
            { initialProps: {} },
        );

        const tree = hookResult.result.current;

        expect(tree).toEqual(expect.objectContaining({
            dataSourceState,
            setDataSourceState,
            totalCount: 42,
            getId,
            getParentId: undefined,
            rowOptions: undefined,
            getRowOptions: undefined,
            isFoldedByDefault: undefined,
            cascadeSelection: undefined,
            selectAll: undefined,
            showSelectedOnly: undefined,
        }));

        expect(tree.tree instanceof TreeStructure).toBeTruthy();
        expect(tree.selectionTree instanceof TreeStructure).toBeTruthy();
        expect(tree.getItemStatus).toBeUndefined();
        expect(typeof tree.reload).toBe('function');
    });

    it('should path through maximum props', async () => {
        const rowOptions = { checkbox: { isVisible: true } };
        const getRowOptions = () => ({ isReadonly: true });
        const cascadeSelection = 'explicit';
        const isFoldedByDefault = () => true;
        const selectAll = true;
        const showSelectedOnly = true;

        const hookResult = renderHook(
            (props) => useSyncTree({
                type: 'sync',
                items,
                getId,
                getParentId,
                rowOptions,
                getRowOptions,
                cascadeSelection,
                isFoldedByDefault,
                showSelectedOnly,
                selectAll,
                dataSourceState,
                setDataSourceState,
                ...props,
            }, []),
            { initialProps: {} },
        );

        const tree = hookResult.result.current;

        expect(tree).toEqual(expect.objectContaining({
            dataSourceState,
            setDataSourceState,
            totalCount: 42,
            getId,
            getParentId,
            rowOptions,
            getRowOptions,
            isFoldedByDefault,
            cascadeSelection,
            showSelectedOnly,
            selectAll,
        }));

        expect(tree.tree instanceof TreeStructure).toBeTruthy();
        expect(tree.selectionTree instanceof TreeStructure).toBeTruthy();
        expect(tree.getItemStatus).toBeUndefined();
        expect(typeof tree.reload).toBe('function');
    });

    it('should defined itemsMap/setItems inside hook if not passed to props', async () => {
        const hookResult = renderHook(
            (props) => useSyncTree({
                type: 'sync',
                items,
                getId,
                dataSourceState,
                setDataSourceState,
                ...props,
            }, []),
            { initialProps: {} },
        );

        await waitFor(() => {
            const tree = hookResult.result.current;

            expect(tree.isFetching).toBeFalsy();
        });

        const tree = hookResult.result.current;

        const itemFromVisibleTree = tree.tree.getById('BJ');
        expect(itemFromVisibleTree).toEqual(expect.objectContaining({ id: 'BJ', parentId: 'c-AF' }));

        const itemFromSelectionTree = tree.selectionTree.getById('BJ');
        expect(itemFromSelectionTree).toEqual(expect.objectContaining({ id: 'BJ', parentId: 'c-AF' }));

        const unknownItemFromVisibleTree = tree.tree.getById('GW');
        expect(unknownItemFromVisibleTree).toBe(NOT_FOUND_RECORD);

        const unknownItemFromSelectionTree = tree.tree.getById('GW');
        expect(unknownItemFromSelectionTree).toBe(NOT_FOUND_RECORD);
    });

    it('should use setItems inside hook if passed to props', async () => {
        const itemsStorage = new ItemsStorage({
            items: [],
            params: { getId },
        });
        expect(itemsStorage.getItemsMap().get('GM')).toBeUndefined();

        const hookResult = renderHook(
            (props) => useSyncTree({
                type: 'sync',
                items,
                getId,
                dataSourceState,
                setDataSourceState,
                setItems: itemsStorage.setItems,
                ...props,
            }, []),
            { initialProps: {} },
        );

        await waitFor(() => {
            const tree = hookResult.result.current;

            expect(tree.isFetching).toBeFalsy();
        });

        const tree = hookResult.result.current;

        const itemFromVisibleTree = tree.tree.getById('GM');
        const itemFromSelectionTree = tree.selectionTree.getById('GM');
        const gmItem = { __typename: 'Location', childCount: 6, id: 'GM', name: 'Gambia', parentId: 'c-AF', type: 'country' };
        expect(itemFromVisibleTree).toEqual(gmItem);
        expect(itemFromSelectionTree).toEqual(gmItem);

        expect(itemsStorage.getItemsMap().get('GM')).toEqual(gmItem);
    });
});
