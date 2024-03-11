import { TTableCellElement } from '@udecode/plate-table';
import { migrateSchema, migrateTableCell } from '../migration';
import { initialValue } from './table-migration-data';

describe('migrate', () => {
    it('should migrate content correctly', () => {
        const migrated = migrateSchema(initialValue);

        expect(migrated).toMatchSnapshot();
    });

    it('should migrate table cell correctly', () => {
        const element: TTableCellElement = {
            type: 'table-cell',
            colSpan: 2,
            rowSpan: 1,
            data: {
                colSpan: 3,
                rowSpan: 2,
            },
            attributes: {},
            children: [],
        };

        const migrated = migrateTableCell(element);

        expect(migrated).toEqual({
            type: 'table-cell',
            colSpan: 3,
            rowSpan: 2,
            attributes: {},
            children: [],
        });
    });
});
