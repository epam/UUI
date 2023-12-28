import { migrateSchema } from '../migration';
import { initialValue } from './data';

describe('migrate', () => {
    it('should migrate correctly', () => {
        const migrated = migrateSchema(initialValue);

        expect(migrated).toMatchSnapshot();
    });
});
