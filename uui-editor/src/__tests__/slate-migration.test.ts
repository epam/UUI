import { migrateSlateSchema as migrateSlateSchemaNew } from '../migrations/slate_migrations';
import { slateInitialValue, slateInitialValueFull } from './data/slate-migration';

describe('migrate', () => {
    describe('slate', () => {
        it('should migrate content correctly', () => {
            const migrated = migrateSlateSchemaNew(slateInitialValue);

            expect(migrated).toMatchSnapshot();
        });

        it('should migrate full slate content', () => {
            const migrated = migrateSlateSchemaNew(slateInitialValueFull);

            expect(migrated).toMatchSnapshot();
        });
    });
});
