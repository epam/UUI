import { LazyDataSourceProps } from '@epam/uui-core';
import { GetType, UnboxUnionFromGroups } from './types';

const DEFAULT_CONFIG = Symbol('DEFAULT_CONFIG');

type ConfigDefault<TGroups, TId, TFilter = any> =
    Partial<LazyDataSourceProps<UnboxUnionFromGroups<TGroups>, TId, TFilter>>
    & GetType<TGroups, TId>;

interface GroupByField {
    groupBy?: string | string[];
}

type EntityConfig<TGroup, TId, TFilter> =
    Partial<LazyDataSourceProps<TGroup, TId, TFilter>>
    & GroupByField;

type EntitiesConfig<TGroups, TId, TFilter> = {
    [TType in keyof TGroups]?: EntityConfig<TGroups[TType], TId, TFilter>;
};

export class GroupingConfigBuilder<TGroups, TId, TFilter = any> {
    private entitiesConfig: EntitiesConfig<TGroups, TId, TFilter> = {};
    private groupByToEntityType: Record<string, keyof TGroups> = {};
    private [DEFAULT_CONFIG]: ConfigDefault<TGroups, TId, TFilter> = null;

    addEntity<TType extends keyof TGroups>(
        entityType: TType,
        config: EntityConfig<TGroups[TType], TId, TFilter>,
    ) {
        this.entitiesConfig[entityType] = config;
        if (config.groupBy) {
            this.setGroupByToEntity(entityType, config.groupBy);
        }
    }

    private setGroupByToEntity<TType extends keyof TGroups>(entityType: TType, groupBy: string | string[]) {
        if (Array.isArray(groupBy)) {
            groupBy?.forEach((gb) => {
                this.groupByToEntityType[gb] = entityType;
            });
        } else {
            this.groupByToEntityType[groupBy] = entityType;
        }
    }

    addDefault(config: ConfigDefault<TGroups, TId, TFilter>) {
        this[DEFAULT_CONFIG] = config;
    }

    getType(entity: UnboxUnionFromGroups<TGroups>) {
        return this[DEFAULT_CONFIG].getType(entity);
    }

    getTypeAndId(id: TId) {
        return this[DEFAULT_CONFIG].getTypeAndId(id);
    }

    async api<TType extends keyof TGroups>(type: TType, ...apiArgs: Parameters<LazyDataSourceProps<TGroups[TType], TId, TFilter>['api']>) {
        return (this.entitiesConfig[type].api ?? this[DEFAULT_CONFIG].api)(...apiArgs);
    }
}
