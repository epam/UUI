import { renderHook, waitFor } from '@epam/uui-test-utils';
import { usePlainTree } from '../usePlainTree';
import { DataQueryFilter, DataSourceState } from '../../../../../../../../types';
import { LocationItem } from '../../../../../../__tests__/mocks';
import { demoData } from '@epam/uui-docs';
import { NOT_FOUND_RECORD, TreeStructure } from '../../../../newTree';
import { ItemsStorage } from '../../../../ItemsStorage';

describe('usePlainTree', () => {
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
            (props) => usePlainTree({
                type: 'plain',
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
            showOnlySelected: undefined,
        }));

        expect(tree.tree instanceof TreeStructure).toBeTruthy();
        expect(tree.selectionTree instanceof TreeStructure).toBeTruthy();
        expect(tree.getItemStatus).toBeUndefined();
        expect(typeof tree.reload).toBe('function');
        expect(typeof tree.getChildCount).toBe('function');
    });

    it('should path through maximum props', async () => {
        const rowOptions = { checkbox: { isVisible: true } };
        const getRowOptions = () => ({ isReadonly: true });
        const cascadeSelection = 'explicit';
        const isFoldedByDefault = () => true;
        const selectAll = true;
        const showOnlySelected = true;

        const hookResult = renderHook(
            (props) => usePlainTree({
                type: 'plain',
                items,
                getId,
                getParentId,
                rowOptions,
                getRowOptions,
                cascadeSelection,
                isFoldedByDefault,
                showOnlySelected,
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
            showOnlySelected,
            selectAll,
        }));

        expect(tree.tree instanceof TreeStructure).toBeTruthy();
        expect(tree.selectionTree instanceof TreeStructure).toBeTruthy();
        expect(tree.getItemStatus).toBeUndefined();
        expect(typeof tree.reload).toBe('function');
        expect(typeof tree.getChildCount).toBe('function');
    });

    it('should defined itemsMap/setItems inside hook if not passed to props', async () => {
        const hookResult = renderHook(
            (props) => usePlainTree({
                type: 'plain',
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

    it('should use outer itemsMap/setItems inside hook if passed to props', async () => {
        const newItem: LocationItem = {
            id: 'GW',
            parentId: 'c-AF',
            childCount: 0,
            type: 'country',
            __typename: 'Location',
            name: 'Guinea-Bissau',
        };

        const itemsStorage = new ItemsStorage({
            items: [newItem],
            params: { getId },
        });

        const hookResult = renderHook(
            (props) => usePlainTree({
                type: 'plain',
                items,
                getId,
                dataSourceState,
                setDataSourceState,
                itemsMap: itemsStorage.getItemsMap(),
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

        const itemFromVisibleTree = tree.tree.getById('GW');
        const itemFromSelectionTree = tree.selectionTree.getById('GW');
        expect(itemFromVisibleTree).toEqual(newItem);
        expect(itemFromSelectionTree).toEqual(newItem);
    });
});
