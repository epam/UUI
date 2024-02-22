import { renderHook } from '@epam/uui-test-utils';
import { useColumnsConfiguration } from '../hooks/useColumnsConfiguration';
import { ColumnsConfig, DataColumnProps } from '@epam/uui-core';

const initialColumnsConfig = {
    name: {
        width: 200,
        fix: 'left',
        isVisible: true,
        order: 'm',
    },
    profileStatus: {
        width: 140,
        isVisible: true,
        order: 's',
    },
    salary: {
        width: 100,
        isVisible: true,
        order: 'v',
    },
    jobTitle: {
        width: 200,
        isVisible: true,
        order: 'x',
        fix: 'right',
    },
    detailed: {
        width: 54,
        fix: 'right',
        isVisible: true,
        order: 'y',
    },
};

const defaultConfig = {
    name: {
        width: 200,
        fix: 'left',
        isVisible: true,
        order: 'm',
    },
    profileStatus: {
        width: 140,
        isVisible: true,
        order: 's',
    },
    salary: {
        width: 100,
        isVisible: true,
        order: 'v',
    },
    jobTitle: {
        width: 200,
        isVisible: true,
        order: 'x',
        fix: 'right',
    },
    detailed: {
        width: 54,
        fix: 'right',
        isVisible: true,
        order: 'y',
    },
};

const columns = [
    {
        key: 'name',
        caption: 'Name',
        width: 200,
        fix: 'left',
        isSortable: true,
    },
    {
        key: 'profileStatus',
        caption: 'Profile Status',
        width: 140,
        minWidth: 80,
        isSortable: true,
        alignSelf: 'center',
        info: 'Person Status according his work profile',
    },
    {
        key: 'salary',
        caption: 'Salary',
        isSortable: true,
        width: 100,
        textAlign: 'right',
        info: 'Salary sum for the last year',
    },
    {
        key: 'jobTitle',
        caption: 'Title',
        width: 200,
        grow: 1,
        fix: 'right',
        isSortable: true,
        info: 'Job full description',
    },
    {
        key: 'detailed',
        width: 54,
        alignSelf: 'center',
        fix: 'right',
        info: 'detailed description',
    },
];

describe('useColumnsConfiguration', () => {
    it('should render hook', () => {
        const { result } = renderHook(() => useColumnsConfiguration({
            initialColumnsConfig: initialColumnsConfig as ColumnsConfig,
            defaultConfig: defaultConfig as ColumnsConfig,
            columns: columns as DataColumnProps<any, any, any>[],
        }));

        expect(result.current.columnsConfig).toEqual(initialColumnsConfig);

        expect(result.current.groupedColumns.displayedPinnedLeft.length).toBe(1);
        expect(result.current.groupedColumns.displayedPinnedLeft).toEqual(
            expect.arrayContaining(
                [expect.objectContaining(
                    {
                        key: 'name',
                        caption: 'Name',
                        width: 200,
                        fix: 'left',
                        isSortable: true,
                        groupKey: 'displayedPinnedLeft',
                        columnConfig: {
                            fix: 'left',
                            isVisible: true,
                            order: 'm',
                            width: 200,
                        },
                        isDndAllowed: true,
                        isPinnedAlways: false,
                    },
                )],
            ),
        );
        expect(result.current.groupedColumns.displayedUnpinned.length).toBe(2);
        expect(result.current.groupedColumns.displayedUnpinned).toEqual(
            expect.arrayContaining(
                [
                    expect.objectContaining(
                        {
                            key: 'profileStatus',
                            caption: 'Profile Status',
                            width: 140,
                            minWidth: 80,
                            isSortable: true,
                            alignSelf: 'center',
                            info: 'Person Status according his work profile',
                            groupKey: 'displayedUnpinned',
                            columnConfig: {
                                isVisible: true,
                                order: 's',
                                width: 140,
                            },
                            isDndAllowed: true,
                            isPinnedAlways: false,
                            fix: undefined,
                        },
                    ),
                    expect.objectContaining(
                        {
                            key: 'salary',
                            caption: 'Salary',
                            isSortable: true,
                            width: 100,
                            textAlign: 'right',
                            info: 'Salary sum for the last year',
                            groupKey: 'displayedUnpinned',
                            columnConfig: {
                                isVisible: true,
                                order: 'v',
                                width: 100,
                            },
                            isDndAllowed: true,
                            isPinnedAlways: false,
                            fix: undefined,
                        },
                    ),

                ],
            ),
        );

        expect(result.current.groupedColumns.displayedPinnedRight.length).toBe(1);
        expect(result.current.groupedColumns.displayedPinnedRight).toEqual(
            expect.arrayContaining(
                [
                    expect.objectContaining(
                        {
                            key: 'jobTitle',
                            caption: 'Title',
                            width: 200,
                            grow: 1,
                            fix: 'right',
                            isSortable: true,
                            info: 'Job full description',
                            groupKey: 'displayedPinnedRight',
                            columnConfig: {
                                fix: 'right',
                                isVisible: true,
                                order: 'x',
                                width: 200,
                            },
                            isDndAllowed: true,
                            isPinnedAlways: false,
                        },
                    ),
                ],
            ),
        );
    });
});
