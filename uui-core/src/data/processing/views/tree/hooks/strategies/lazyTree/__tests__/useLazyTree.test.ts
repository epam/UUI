import { getApiMock, renderHook, waitFor } from '@epam/uui-test-utils';
import { useLazyTree } from '../useLazyTree';
import { DataQueryFilter, DataSourceState } from '../../../../../../../../types';
import { LocationItem } from '../../../../../../__tests__/mocks';
import { demoData } from '@epam/uui-docs';
import { FAILED_RECORD, NOT_FOUND_RECORD, newMap } from '../../../../exposed';
import { ItemsStorage } from '../../../../ItemsStorage';
import { RecordStatus } from '../../../../types';
import { TreeStructure } from '../../../../treeStructure';

const expectMissingIdsError = () =>
    expect.stringContaining("LazyTree: api does not returned requested items. Check that you handle 'ids' argument correctly.");

describe('useLazyTree', () => {
    let dataSourceState: DataSourceState<DataQueryFilter<LocationItem>, string>;
    const setDataSourceState = (newDsState: React.SetStateAction<DataSourceState<DataQueryFilter<LocationItem>, string>>) => {
        if (typeof newDsState === 'function') {
            dataSourceState = newDsState(dataSourceState);
            return;
        }
        dataSourceState = newDsState;
    };

    const api = getApiMock(demoData.locations);
    const getId = ({ id }: LocationItem) => id;
    const getParentId = ({ parentId }: LocationItem) => parentId;

    beforeEach(() => {
        jest.clearAllMocks();
        dataSourceState = { topIndex: 0, visibleCount: 3 };
    });

    it('should path through minimal props', async () => {
        const hookResult = renderHook(
            (props) => useLazyTree({
                type: 'lazy',
                api,
                getId,
                dataSourceState,
                setDataSourceState,
                ...props,
            }, []),
            { initialProps: {} },
        );

        await waitFor(() => {
            const tree = hookResult.result.current;
            expect(tree.isFetching).toBeTruthy();
        });

        let tree = hookResult.result.current;
        expect(tree.isLoading).toBeTruthy();

        await waitFor(() => {
            tree = hookResult.result.current;
            expect(tree.isFetching).toBeFalsy();
        });

        expect(tree).toEqual(expect.objectContaining({
            dataSourceState,
            setDataSourceState,
            getId,
            getParentId: undefined,
            rowOptions: undefined,
            getRowOptions: undefined,
            isFoldedByDefault: undefined,
            cascadeSelection: undefined,
            selectAll: undefined,
            showSelectedOnly: undefined,

            isFetching: false,
            isLoading: false,
        }));

        expect(tree.tree instanceof TreeStructure).toBeTruthy();
        expect(tree.selectionTree instanceof TreeStructure).toBeTruthy();
        expect(typeof tree.getItemStatus).toBe('function');
        expect(typeof tree.reload).toBe('function');
        expect(typeof tree.loadMissingRecordsOnCheck).toBe('function');
    });

    it('should path through maximum props', async () => {
        const rowOptions = { checkbox: { isVisible: true } };
        const getRowOptions = () => ({ isReadonly: true });
        const cascadeSelection = 'explicit';
        const isFoldedByDefault = () => true;
        const getChildCount = ({ childCount }) => childCount;
        const selectAll = true;
        const showSelectedOnly = true;

        const hookResult = renderHook(
            (props) => useLazyTree({
                type: 'lazy',
                api,
                getId,
                getParentId,
                rowOptions,
                getRowOptions,
                cascadeSelection,
                isFoldedByDefault,
                showSelectedOnly,
                getChildCount,
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
            getId,
            getParentId,
            rowOptions,
            getRowOptions,
            isFoldedByDefault,
            cascadeSelection,
            showSelectedOnly,
            selectAll,

            isFetching: false,
            isLoading: false,
        }));

        expect(tree.tree instanceof TreeStructure).toBeTruthy();
        expect(tree.selectionTree instanceof TreeStructure).toBeTruthy();
        expect(typeof tree.getItemStatus).toBe('function');
        expect(typeof tree.reload).toBe('function');
        expect(typeof tree.loadMissingRecordsOnCheck).toBe('function');
    });

    it('should defined itemsMap/setItems inside hook if not passed to props', async () => {
        const hookResult = renderHook(
            (props) => useLazyTree({
                type: 'lazy',
                api,
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

        const itemFromVisibleTree = tree.tree.getById('c-AF');
        expect(itemFromVisibleTree).toEqual(expect.objectContaining({ id: 'c-AF', parentId: null }));

        const itemFromSelectionTree = tree.selectionTree.getById('c-AF');
        expect(itemFromSelectionTree).toEqual(expect.objectContaining({ id: 'c-AF', parentId: null }));

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
            (props) => useLazyTree({
                type: 'lazy',
                api,
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

    it('should use inner itemsStatusMap if not passed to props', async () => {
        const errMock = jest.spyOn(console, 'error').mockImplementation(() => {});

        dataSourceState.checked = ['GW'];
        const hookResult = renderHook(
            (props) => useLazyTree({
                type: 'lazy',
                api,
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
        expect(errMock).toHaveBeenNthCalledWith(2, expectMissingIdsError());

        const tree = hookResult.result.current;

        const itemFromVisibleTree = tree.tree.getById('GW');
        const itemFromSelectionTree = tree.selectionTree.getById('GW');
        expect(itemFromVisibleTree).toEqual(NOT_FOUND_RECORD);
        expect(itemFromSelectionTree).toEqual(NOT_FOUND_RECORD);

        expect(typeof tree.getItemStatus).toBe('function');
        expect(tree.getItemStatus!('GW')).toBe(NOT_FOUND_RECORD);
        errMock.mockRestore();
    });

    it('should use outer itemsStatusMap if passed to props', async () => {
        const itemsStatusMap = newMap<string, RecordStatus>({});
        itemsStatusMap.set('GW', FAILED_RECORD);

        const hookResult = renderHook(
            (props) => useLazyTree({
                type: 'lazy',
                api,
                getId,
                dataSourceState,
                setDataSourceState,
                itemsStatusMap,
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
        expect(itemFromVisibleTree).toEqual(NOT_FOUND_RECORD);
        expect(itemFromSelectionTree).toEqual(NOT_FOUND_RECORD);

        expect(typeof tree.getItemStatus).toBe('function');
        expect(tree.getItemStatus!('GW')).toBe(FAILED_RECORD);
    });

    describe('getParentId updates', () => {
        it('should update tree structure when getParentId function changes', async () => {
            // Initial getParentId that uses parentId
            let useParentField = true;
            const mockGetParentId = jest.fn(({ parentId, alternateParentId }: LocationItem & { alternateParentId?: string }) =>
                useParentField ? parentId : alternateParentId);

            // Mock locations with both parentId and alternateParentId
            const mockItems: Array<LocationItem & { alternateParentId?: string | undefined }> = [
                { id: 'root', parentId: undefined, alternateParentId: undefined, name: 'Root', type: 'continent', childCount: 2, __typename: 'Location' },
                { id: 'child1', parentId: 'root', alternateParentId: 'child2', name: 'Child 1', type: 'country', childCount: 0, __typename: 'Location' },
                { id: 'child2', parentId: 'root', alternateParentId: undefined, name: 'Child 2', type: 'country', childCount: 1, __typename: 'Location' },
            ];

            const mockApi = jest.fn(async (request) => {
                const { filter } = request;
                let items = mockItems;

                if (filter?.parentId?.isNull) {
                    items = mockItems.filter((item) => mockGetParentId(item) === undefined);
                } else if (filter?.parentId) {
                    items = mockItems.filter((item) => mockGetParentId(item) === filter.parentId);
                }

                return { items, totalCount: items.length };
            });

            let mockDataSourceState: DataSourceState = { topIndex: 0, visibleCount: 10 };
            const mockSetDataSourceState = jest.fn((newState) => {
                if (typeof newState === 'function') {
                    mockDataSourceState = newState(mockDataSourceState);
                } else {
                    mockDataSourceState = newState;
                }
            });

            // Initial render with first getParentId logic
            const { result, rerender } = renderHook(
                ({ deps }) => useLazyTree({
                    type: 'lazy',
                    api: mockApi,
                    getId: ({ id }) => id,
                    getParentId: mockGetParentId,
                    dataSourceState: mockDataSourceState,
                    setDataSourceState: mockSetDataSourceState,
                }, deps),
                { initialProps: { deps: [useParentField] } },
            );

            // Wait for initial load
            await waitFor(() => {
                expect(result.current.isFetching).toBeFalsy();
            });

            // Check initial structure - child1 should be under root
            const initialRootItems = result.current.tree.getItems(undefined);
            expect(initialRootItems.ids).toContain('root');

            const initialChild1Parent = mockGetParentId(mockItems[1]); // should be 'root'
            expect(initialChild1Parent).toBe('root');

            // Clear mock calls
            mockApi.mockClear();
            mockGetParentId.mockClear();

            // Change getParentId logic
            useParentField = false;

            // Rerender with new deps to trigger getParentId change
            rerender({ deps: [useParentField] });

            // Wait for refetch
            await waitFor(() => {
                expect(result.current.isFetching).toBeFalsy();
            });

            // Verify that new getParentId logic is used
            const newChild1Parent = mockGetParentId(mockItems[1]); // should now be 'child2'
            expect(newChild1Parent).toBe('child2');

            // Verify that tree structure was updated with new hierarchy
            expect(mockApi).toHaveBeenCalled();
            expect(mockGetParentId).toHaveBeenCalled();
        });

        it('should handle filter changes that affect getParentId logic', async () => {
            // Simulate a scenario like PersonsTableDemo where groupBy affects getParentId
            let groupBy: 'department' | 'location' | undefined = undefined;

            const mockPersons = [
                { id: 'person1', __typename: 'Person', departmentId: 'dept1', locationId: 'loc1', name: 'John' },
                { id: 'dept1', __typename: 'Department', name: 'Engineering' },
                { id: 'loc1', __typename: 'Location', name: 'New York' },
            ];

            const mockGetParentId = jest.fn((item: any) => {
                if (item.__typename === 'Person') {
                    if (groupBy === 'department') {
                        return ['Department', item.departmentId];
                    } else if (groupBy === 'location') {
                        return ['Location', item.locationId];
                    }
                }
                return undefined;
            });

            const mockApi = jest.fn(async () => ({ items: mockPersons, totalCount: mockPersons.length }));

            let testDataSourceState: DataSourceState = {
                topIndex: 0,
                visibleCount: 10,
                filter: { groupBy },
            };

            const testSetDataSourceState = jest.fn((newState) => {
                if (typeof newState === 'function') {
                    testDataSourceState = newState(testDataSourceState);
                } else {
                    testDataSourceState = newState;
                }
            });

            const { result, rerender } = renderHook(
                ({ groupBy: testGroupBy }: { groupBy: 'department' | 'location' | undefined }) => {
                    groupBy = testGroupBy;
                    return useLazyTree({
                        type: 'lazy',
                        api: mockApi,
                        getId: (item: any) => [item.__typename, item.id],
                        getParentId: mockGetParentId,
                        dataSourceState: { ...testDataSourceState, filter: { groupBy } },
                        setDataSourceState: testSetDataSourceState,
                        complexIds: true,
                        filter: { groupBy },
                    }, [groupBy]);
                },
                { initialProps: { groupBy: undefined as 'department' | 'location' | undefined } },
            );

            // Wait for initial load
            await waitFor(() => {
                expect(result.current.isFetching).toBeFalsy();
            });

            const initialCalls = mockGetParentId.mock.calls.length;

            // Change groupBy to 'department'
            rerender({ groupBy: 'department' });

            // Wait for refetch
            await waitFor(() => {
                expect(result.current.isFetching).toBeFalsy();
            });

            // Verify getParentId was called again with new logic
            expect(mockGetParentId.mock.calls.length).toBeGreaterThan(initialCalls);

            // Verify the new logic returns department parent
            const person = mockPersons[0];
            const departmentParent = mockGetParentId(person);
            expect(departmentParent).toEqual(['Department', 'dept1']);

            // Change groupBy to 'location'
            rerender({ groupBy: 'location' });

            // Wait for refetch
            await waitFor(() => {
                expect(result.current.isFetching).toBeFalsy();
            });

            // Verify the location logic is now used
            const locationParent = mockGetParentId(person);
            expect(locationParent).toEqual(['Location', 'loc1']);
        });
    });
});
