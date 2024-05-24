import { migrateLegacySchema as migrateSlateSchemaNew } from '../migrations/legacy_migrations';
import { slateInitialValue } from './data/slate-migration';

describe('migrate', () => {
    describe('slate', () => {
        it('should migrate content correctly', () => {
            const migrated = migrateSlateSchemaNew(slateInitialValue);

            expect(migrated).toMatchSnapshot();
        });
    });
});
