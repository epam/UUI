import { GroupedDataColumnProps } from '../types';
import { AcceptDropParams, ColumnsConfig, DataColumnProps, IColumnConfig } from '@epam/uui-core';
import { canAcceptDrop, isColumnFilteredOut, sortColumnsAndAddGroupKey } from '../columnsConfigurationUtils';

function getTestDataSet1() {
    const A: DataColumnProps = {
        key: '1', fix: 'left', caption: 'a', isAlwaysVisible: false, width: 10,
    };
    const B: DataColumnProps = {
        key: '6', caption: 'b', isAlwaysVisible: true, width: 10,
    };
    const C: DataColumnProps = {
        key: '2', fix: 'right', caption: 'c', isAlwaysVisible: false, width: 10,
    };
    const D: DataColumnProps = {
        key: '5', caption: 'd', isAlwaysVisible: false, width: 10,
    };
    const E: DataColumnProps = {
        key: '4', caption: 'e', isAlwaysVisible: false, width: 10,
    };
    const F: DataColumnProps = {
        key: '3', caption: 'f', isAlwaysVisible: false, width: 10,
    };
    const prevConfig: ColumnsConfig = {
        [D.key]: { width: 10, isVisible: false, order: 'd' },
        [E.key]: { width: 10, isVisible: false, order: 'e' },
        [F.key]: { width: 10, isVisible: true, order: 'f' },
        [A.key]: {
            fix: 'left', width: 10, isVisible: true, order: 'a',
        },
        [B.key]: { width: 10, isVisible: true, order: 'b' },
        [C.key]: {
            width: 10, fix: 'right', isVisible: true, order: 'c',
        },
    };
    return {
        prevConfig, A, B, C, D, E, F,
    };
}

describe('columnsConfigurationUtils', () => {
    describe('canAcceptDrop', () => {
        type TAcceptDropParamsAll = AcceptDropParams<{ column: DataColumnProps; columnConfig: IColumnConfig }, { column: DataColumnProps; columnConfig: IColumnConfig }>;
        type TAcceptDropParams = Pick<TAcceptDropParamsAll, 'srcData' | 'dstData'>;

        it('should accept drop of locked columns inside of its current fix area', () => {
            const params: TAcceptDropParams = {
                srcData: {
                    column: {
                        key: '1', fix: 'right', caption: '1', isAlwaysVisible: true, width: 1,
                    },
                    columnConfig: { width: 1, isVisible: true, order: 'a' },
                },
                dstData: {
                    column: {
                        key: '2', fix: 'right', caption: '2', width: 2,
                    },
                    columnConfig: { width: 2, isVisible: true, order: 'b' },
                },
            };
            const result = canAcceptDrop(params);
            expect(result).toEqual({});
        });

        it('should not accept drop of locked columns outside of its current fix area', () => {
            const params: TAcceptDropParams = {
                srcData: {
                    column: {
                        key: '1', fix: 'right', caption: '1', isAlwaysVisible: true, width: 1,
                    },
                    columnConfig: { width: 1, isVisible: true, order: 'a' },
                },
                dstData: {
                    column: {
                        key: '2', fix: 'left', caption: '2', width: 2,
                    },
                    columnConfig: { width: 2, isVisible: true, order: 'b' },
                },
            };
            const result = canAcceptDrop(params);
            expect(result).toEqual({});
        });
    });
    describe('sortColumnsAndAddGroupKey', () => {
        it('should sort columns by "order" and should add "groupKey" attribute', () => {
            const {
                prevConfig, A, B, C, D, E, F,
            } = getTestDataSet1();
            const columns = [
                F, A, E, B, D, C,
            ];
            const result = sortColumnsAndAddGroupKey({ columns, prevConfig });
            const expected: GroupedDataColumnProps[] = [
                { ...A, groupKey: 'displayedPinnedLeft' },
                { ...B, groupKey: 'displayedUnpinned' },
                { ...C, groupKey: 'displayedPinnedRight' },
                { ...D, groupKey: 'hidden' },
                { ...E, groupKey: 'hidden' },
                { ...F, groupKey: 'displayedUnpinned' },
            ];
            expect(result).toEqual(expected);
        });
    });

    describe('isColumnFilteredOut', () => {
        it('should filter out columns without caption', () => {
            const A: DataColumnProps = {
                key: '1', fix: 'left', caption: '', isAlwaysVisible: false, width: 10,
            };
            const result = isColumnFilteredOut(A, undefined);
            expect(result).toBe(true);
        });
        it('should not filter out columns which match filter criteria (ignore case)', () => {
            const A: DataColumnProps = {
                key: '1', fix: 'left', caption: 'name', isAlwaysVisible: false, width: 10,
            };
            const result = isColumnFilteredOut(A, ['NAME']);
            expect(result).toBe(false);
        });
    });
});
