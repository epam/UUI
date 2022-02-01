import { FilterConfig } from "../types";
import { addFiltersToColumns } from "../helpers";

describe('addFiltersToColumns', () => {
    const filters: FilterConfig[] = [
        {
            field: "profileStatusId",
            columnKey: "profileStatus",
            title: "Profile Status",
            type: "multiPicker",
            dataSource: {} as any,
        },
        {
            field: "jobTitleId",
            columnKey: "jobTitle",
            title: "Title",
            type: "multiPicker",
            dataSource: {} as any,
        },
    ];
    const columns = [
        {
            key: 'profileStatus',
            caption: 'Profile Status',
            grow: 0,
            shrink: 0,
            width: 140,
            isSortable: true,
        },
        {
            key: 'jobTitle',
            caption: "Title",
            grow: 0,
            shrink: 0,
            width: 200,
            isSortable: true,
        },
        {
            key: 'departmentName',
            caption: "Department",
            grow: 0,
            shrink: 0,
            width: 200,
            isSortable: true,
            isHiddenByDefault: true,
        },
    ];

    it('should add filters to columns', () => {
        const result = addFiltersToColumns(columns, filters);
        const filterKeys = filters.map(f => f.columnKey);

        const columnsWithFilters = result.filter(column => filterKeys.includes(column.key));
        const columnsWithoutFilters = result.filter(column => !filterKeys.includes(column.key));

        expect(columnsWithFilters.length).toBe(2);

        columnsWithFilters.forEach(column => {
            expect(column).toHaveProperty("renderFilter");
        });
        columnsWithoutFilters.forEach(column => {
            expect(column).not.toHaveProperty("renderFilter");
        });
    });
});