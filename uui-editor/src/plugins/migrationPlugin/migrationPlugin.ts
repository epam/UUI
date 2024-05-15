import { Value, createPluginFactory } from '@udecode/plate-common';
import { migratePlateContent } from '../../migrations/plate_migrations';
import { MIGRATION_PLUGIN_KEY, MIGRATION_PLUGIN_TYPE } from './constants';

export const createMigrationPlugin = (contentVersion: string) => {
    const normalizeInitialValue = (value: Value) => {
        return migratePlateContent(contentVersion, value);
    };

    return createPluginFactory({
        type: MIGRATION_PLUGIN_TYPE,
        key: MIGRATION_PLUGIN_KEY,
        normalizeInitialValue,
    });
};
