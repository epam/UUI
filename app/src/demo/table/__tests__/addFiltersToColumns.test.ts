import { ITableFilter } from "../types";
import { addFiltersToColumns } from "../helpers";

describe('addFiltersToColumns', () => {
    const filters: ITableFilter[] = [
        {
            id: "profileStatusId",
            title: "Profile Status",
            type: "multiPicker",
            dataSource: {} as any,
        },
        {
            id: "jobTitleId",
            title: "Title",
            type: "multiPicker",
            dataSource: {} as any,
        },
    ];
    const columns = [
        {
            key: 'profileStatus',
            caption: 'Profile Status',
            filterId: 'profileStatusId',
            grow: 0,
            shrink: 0,
            width: 140,
            isSortable: true,
        },
        {
            key: 'jobTitle',
            caption: "Title",
            filterId: 'jobTitleId',
            grow: 0,
            shrink: 0,
            width: 200,
            isSortable: true,
        },
        {
            key: 'departmentName',
            caption: "Department",
            filterId: 'departmentId',
            grow: 0,
            shrink: 0,
            width: 200,
            isSortable: true,
            isHiddenByDefault: true,
        },
    ];

    it('should add filters to columns', () => {
        const result = addFiltersToColumns(columns, filters, jest.fn());
        const filterIds = filters.map(f => f.id);

        const columnsWithFilters = result.filter(column => filterIds.includes(column.filterId));
        const columnsWithoutFilters = result.filter(column => !filterIds.includes(column.filterId));

        expect(columnsWithFilters.length).toBe(2);

        columnsWithFilters.forEach(column => {
            expect(column).toHaveProperty("renderFilter");
        });
        columnsWithoutFilters.forEach(column => {
            expect(column).not.toHaveProperty("renderFilter");
        });
    });
});