import { FilterConfig, ITablePreset } from "../types";
import { hasPresetChanged } from "../helpers";
import { getDefaultColumnsConfig } from "@epam/uui";
import { getColumns } from "../columns";
import { setMockedUrl, clearMockedUrl } from "./utils";

describe("hasPresetChanged", () => {
    const filters: FilterConfig[] = [
        {
            field: "profileStatusId",
            title: "Profile Status",
            type: "multiPicker",
            dataSource: {} as any,
        },
        {
            field: "jobTitleId",
            title: "Title",
            type: "multiPicker",
            dataSource: {} as any,
        },
    ];

    it('should return false', () => {
        const preset: ITablePreset = {
            id: 1,
            isReadonly: false,
            name: "Test",
            filter: {
                ids: [1, 2, 3],
            },
            columnsConfig: undefined,
        };
        const columnsConfig = getDefaultColumnsConfig(getColumns(filters, jest.fn()).personColumns);

        setMockedUrl(encodeURIComponent(JSON.stringify({ ids: [1, 2, 3] })));
        expect(hasPresetChanged(preset, undefined)).toBe(false);

        preset.columnsConfig = columnsConfig;
        expect(hasPresetChanged(preset, columnsConfig)).toBe(false);

        clearMockedUrl();
        expect(hasPresetChanged(undefined, undefined)).toBe(false);
    });

    it('should return true', () => {
        const preset: ITablePreset = {
            id: 1,
            isReadonly: false,
            name: "Test",
            filter: {
                ids: [1, 2, 3],
            },
            columnsConfig: undefined,
        };
        const columnsConfig = getDefaultColumnsConfig(getColumns(filters, jest.fn()).personColumns);

        setMockedUrl(encodeURIComponent(JSON.stringify({ ids: [1, 2, 3] })));
        expect(hasPresetChanged({...preset, filter: null}, undefined)).toBe(true);

        expect(hasPresetChanged(preset, columnsConfig)).toBe(true);
        
        clearMockedUrl();
        expect(hasPresetChanged(preset, undefined)).toBe(true);
        expect(hasPresetChanged(undefined, columnsConfig)).toBe(true);
    });
});