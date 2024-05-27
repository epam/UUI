import { migrateLegacySchema } from '../migrations/legacy_migrations';
import { slateInitialValue } from './data/slate-migration';

describe('migrate', () => {
    describe('slate', () => {
        it('should migrate content correctly', () => {
            const migrated = migrateLegacySchema(slateInitialValue);

            expect(migrated).toMatchSnapshot();
        });
    });
});
