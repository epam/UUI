import { clearMockedUrl, setMockedUrl } from "./utils";
import { getColumnsConfig } from "@epam/uui";
import { getColumns } from "../columns";
import { ITableFilter, PersonsTableState } from "../types";
import { isDefaultPresetActive } from "../helpers";

describe('isDefaultPresetActive', () => {
    it('should work correctly', () => {
        clearMockedUrl();
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
        const columns = getColumns(filters, jest.fn()).personColumns;

        const value: PersonsTableState = {
            topIndex: 0,
            visibleCount: 40,
            sorting: [{ field: 'name' }],
            isFolded: true,
            columnsConfig: getColumnsConfig(columns, {}),
        };

        expect(isDefaultPresetActive(value, columns)).toBe(true);

        setMockedUrl(undefined, JSON.stringify(5));
        expect(isDefaultPresetActive(value, columns)).toBe(false);
        
        clearMockedUrl();
        expect(isDefaultPresetActive(value, columns)).toBe(true);

        value.columnsConfig = getColumnsConfig(columns.slice(1), {});
        expect(isDefaultPresetActive(value, columns)).toBe(false);
        
        value.columnsConfig = getColumnsConfig(columns, {});
        expect(isDefaultPresetActive(value, columns)).toBe(true);

        value.filter = {ids: [1, 2, 3]};
        expect(isDefaultPresetActive(value, columns)).toBe(false);
    });
});