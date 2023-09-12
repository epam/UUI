import { LazyDataSourceProps } from '@epam/uui-core';
import { GetType, UnboxUnionFromGroups } from './types';

type ConfigDefault<TGroups, TId, TFilter = any> =
    Partial<LazyDataSourceProps<UnboxUnionFromGroups<TGroups>, TId, TFilter>>
    & GetType<TGroups, TId>;

export class GroupingConfigBuilder<TGroups, TId, TFilter = any> {
    private entitiesConfig = new Map<keyof TGroups, Partial<LazyDataSourceProps<TGroups[keyof TGroups], TId, TFilter>>>();
    addEntity<TType extends keyof TGroups>(
        entityType: TType,
        config: Partial<LazyDataSourceProps<TGroups[TType], TId, TFilter>>,
    ) {}

    addDefault(config: ConfigDefault<TGroups, TId, TFilter>) {}
}
