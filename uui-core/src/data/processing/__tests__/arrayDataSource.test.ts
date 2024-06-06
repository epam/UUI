import { renderHook } from '@epam/uui-test-utils';
import { ArrayDataSource } from '../ArrayDataSource';

type Test_ItemIdType = string;
type Test_ItemType =
    | {
        _type: 'employee';
        firstName: string;
        lastName: string;
        departmentId: string;
        city: string;
        id: Test_ItemIdType;
    }
    | { _type: 'department'; id: Test_ItemIdType; departmentName: string };
type Test_EmployeeFilterType = {
    onlyFromDepartment_A: boolean;
};

function setupArrayDataSource() {
    const items: Test_ItemType[] = [
        { _type: 'department', id: 'Department-A', departmentName: 'Department A' }, {
            _type: 'employee',
            id: 'Emp-1',
            firstName: 'First-1',
            lastName: 'Last-1',
            departmentId: 'Department-A',
            city: 'City-A',
        }, {
            _type: 'employee',
            id: 'Emp-2',
            firstName: 'First-2',
            lastName: 'Last-2',
            departmentId: 'Department-A',
            city: 'City-A',
        }, { _type: 'department', id: 'Department-B', departmentName: 'Department B' }, {
            _type: 'employee',
            id: 'Emp-3',
            firstName: 'First-3',
            lastName: 'Last-3',
            departmentId: 'Department-B',
            city: 'City-A',
        }, {
            _type: 'employee',
            id: 'Emp-4',
            firstName: 'First-4',
            lastName: 'Last-4',
            departmentId: 'Department-B',
            city: 'City-A',
        }, {
            _type: 'employee',
            id: 'Emp-5',
            firstName: 'First-5',
            lastName: 'Last-5',
            departmentId: 'Department-B',
            city: 'City-B',
        },
    ];
    return new ArrayDataSource<Test_ItemType, Test_ItemIdType, Test_EmployeeFilterType>({
        items,
        getParentId: (item) => (item._type === 'employee' ? item.departmentId : undefined),
        getId: (item) => item.id,
        getSearchFields: (item) => (item._type === 'employee' ? [item.firstName, item.lastName] : []),
        sortBy: (item, sorting) => item[sorting.field as keyof Test_ItemType],
        getFilter: (filter) => (item) => {
            if (filter.onlyFromDepartment_A) {
                return item._type === 'employee' ? item.departmentId === 'Department-A' : item.id === 'Department-A';
            }
            return true;
        },
        complexIds: false,
        getRowOptions: (item) => ({
            checkbox: { isVisible: true, isDisabled: false, isInvalid: false },
            isSelectable: true,
            onClick() {},
            link: { pathname: 'test', query: { id: item.id, type: item._type } },
        }),
        isFoldedByDefault: () => true,
        cascadeSelection: true,
        selectAll: true,
    });
}

describe('ArrayDataSource', () => {
    it('should create array data source', () => {
        const ds = setupArrayDataSource();
        const hookResult1 = renderHook(
            () => ds.useView(
                {
                    search: undefined,
                    checked: [],
                    folded: {},
                    filter: { onlyFromDepartment_A: true },
                    sorting: [],
                    selectedId: undefined,
                    focusedIndex: undefined,
                },
                () => {},
                {},
            ),
        );
        const viewFromDepA = hookResult1.result.current;

        const hookResult2 = renderHook(
            () => ds.useView(
                {
                    search: undefined,
                    checked: [],
                    folded: {},
                    filter: { onlyFromDepartment_A: false },
                    sorting: [],
                    selectedId: undefined,
                    focusedIndex: undefined,
                },
                () => {},
                {},
            ),
        );
        const viewFromDepAll = hookResult2.result.current;

        const hookResult3 = renderHook(
            () => ds.useView(
                {
                    search: 'First-3',
                    checked: [],
                    folded: {},
                    filter: { onlyFromDepartment_A: false },
                    sorting: [],
                    selectedId: undefined,
                    focusedIndex: undefined,
                },
                () => {},
                {},
            ),
        );

        const viewSearchFirst3 = hookResult3.result.current;

        const depAList = viewFromDepA.getListProps();
        const depAllList = viewFromDepAll.getListProps();
        const search3List = viewSearchFirst3.getListProps();

        expect(depAList.rowsCount).toEqual(1);
        expect(depAList.totalCount).toEqual(3);

        expect(depAllList.rowsCount).toEqual(2);
        expect(depAllList.totalCount).toEqual(7);

        expect(search3List.rowsCount).toEqual(2);
        expect(search3List.totalCount).toEqual(2);
    });
});
