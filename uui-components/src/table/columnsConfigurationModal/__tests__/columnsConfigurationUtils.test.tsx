import { DndDataType, GroupedDataColumnProps } from '../types';
import { AcceptDropParams, ColumnsConfig, DataColumnProps } from '@epam/uui-core';
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

type TAcceptDropParamsAll = AcceptDropParams<DndDataType, DndDataType>;
type TAcceptDropParams = Pick<TAcceptDropParamsAll, 'srcData' | 'dstData'>;

const mockAcceptDropParams = (params: TAcceptDropParams): TAcceptDropParamsAll => {
    return {
        ...params,
        offsetTop: 0,
        offsetLeft: 0,
        targetHeight: 0,
        targetWidth: 0,
    };
};

describe('columnsConfigurationUtils', () => {
    describe('canAcceptDrop', () => {
        it('should not accept drop before isLocked fixed left columns', () => {
            const params = mockAcceptDropParams({
                dstData: {
                    column: {
                        key: '1', fix: 'left', caption: '1', isLocked: true, width: 1,
                    },
                    columnConfig: { width: 1, isVisible: true, order: 'a' },
                },
                srcData: {
                    column: {
                        key: '2', caption: '2', width: 2,
                    },
                    columnConfig: { width: 2, isVisible: true, order: 'b' },
                },
            });
            const result = canAcceptDrop(params, { key: '100500', fix: 'left', isLocked: true, width: 0 }); // Try to drop between 2 isLocked columns
            expect(result).toEqual({});

            const result2 = canAcceptDrop(params, { key: '100500', width: 0 }); // Try to drop at last isLocked columns
            expect(result2).toEqual({ bottom: true });
        });

        it('should not accept drop after isLocked fixed right columns', () => {
            const params = mockAcceptDropParams({
                dstData: {
                    column: {
                        key: '1', fix: 'right', caption: '1', isLocked: true, width: 1,
                    },
                    columnConfig: { width: 1, isVisible: true, order: 'a' },
                },
                srcData: {
                    column: {
                        key: '2', caption: '2', width: 2,
                    },
                    columnConfig: { width: 2, isVisible: true, order: 'b' },
                },
            });
            const result = canAcceptDrop(params, { key: '100500', width: 0 }, { key: '100501', fix: 'right', isLocked: true, width: 0 }); // Try to drop between 2 isLocked columns
            expect(result).toEqual({});

            const result2 = canAcceptDrop(params, { key: '100500', width: 0 }); // Try to drop at first isLocked columns
            expect(result2).toEqual({ top: true });
        });

        it('should not accept drop for isAlwaysVisible column in hidden section', () => {
            const params = mockAcceptDropParams({
                dstData: {
                    column: {
                        key: '1', fix: 'right', caption: '1', width: 1,
                    },
                    columnConfig: { width: 1, isVisible: false, order: 'a' },
                },
                srcData: {
                    column: {
                        key: '2', caption: '2', width: 2, isAlwaysVisible: true,
                    },
                    columnConfig: { width: 2, isVisible: true, order: 'b' },
                },
            });
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
