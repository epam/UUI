import { applyColumnsConfig, getColumnsConfig } from '../applyColumnsConfig';
import { ColumnsConfig, DataColumnProps } from '../../types';

describe('applyColumnsConfig', () => {
    it('applyColumnsConfig - should exclude invisible columns & sort by order', () => {
        const columns: DataColumnProps[] = [
            { key: '2', width: 20 }, { key: '1', width: 10 }, { key: '3', width: 30 },
        ];
        const config: ColumnsConfig = {
            1: { isVisible: true, order: 'c', width: 10 },
            2: { isVisible: false, order: 'b', width: 20 },
            3: { isVisible: true, order: 'a', width: 30 },
        };
        const result = applyColumnsConfig(columns, config);
        const expected: DataColumnProps[] = [{ key: '3', width: 30 }, { key: '1', width: 10 }];
        expect(result).toEqual(expected);
    });

    it('applyColumnsConfig - should update fix', () => {
        const columns: DataColumnProps[] = [{ key: '2', width: 20, fix: 'right' }, { key: '1', width: 10, fix: 'left' }];
        const config: ColumnsConfig = {
            1: { isVisible: true, order: 'a', width: 10 },
            2: {
                isVisible: true, order: 'b', width: 20, fix: 'left',
            },
        };

        const result = applyColumnsConfig(columns, config);
        const expected: DataColumnProps[] = [{ key: '1', width: 10 }, { key: '2', width: 20, fix: 'left' }];
        expect(result).toEqual(expected);
    });

    it('applyColumnsConfig - should update width', () => {
        const columns: DataColumnProps[] = [{ key: '2', width: 20 }, { key: '1', width: 10 }];
        const config: ColumnsConfig = {
            1: { isVisible: true, order: 'a', width: 110 },
            2: { isVisible: true, order: 'b', width: 220 },
        };
        const result = applyColumnsConfig(columns, config);
        const expected: DataColumnProps[] = [{ key: '1', width: 110 }, { key: '2', width: 220 }];
        expect(result).toEqual(expected);
    });

    it('getColumnsConfig - should build columns config from scratch', () => {
        const columns: DataColumnProps[] = [
            { key: '3', width: 30, fix: 'left' }, { key: '2', width: 20, isHiddenByDefault: true }, { key: '1', width: 10 },
        ];
        const config: ColumnsConfig = {};

        const result = getColumnsConfig(columns, config);
        const expected: ColumnsConfig = {
            1: { isVisible: true, order: 'x', width: 10 },
            2: { isVisible: false, order: 'v', width: 20 },
            3: {
                fix: 'left', isVisible: true, order: 's', width: 30,
            },
        };

        expect(result).toEqual(expected);
    });
});
