import { LazyDataSourceProps } from '@epam/uui-core';
import { GetType, UnboxUnionFromGroups } from './types';

const DEFAULT_CONFIG = Symbol('DEFAULT_CONFIG');
const LOW_LEVEL_ENTITY = Symbol('LOW_LEVEL_ENTITY');

type ConfigDefault<TGroups, TId, TFilter = any> =
    Partial<LazyDataSourceProps<UnboxUnionFromGroups<TGroups>, TId, TFilter>>
    & GetType<TGroups, TId, TFilter>;

interface GroupByField {
    groupBy: string | string[] | null;
}

type EntityLazyDataSourceProps<TGroups, TType extends keyof TGroups, TId, TFilter> =
    Omit<LazyDataSourceProps<TGroups[TType], TId, TFilter>, 'api'>
    & { api: LazyDataSourceProps<TGroups[keyof TGroups], TId, TFilter>['api'] };

type EntityConfig<TGroups, TType extends keyof TGroups, TId, TFilter> =
    Partial<EntityLazyDataSourceProps<TGroups, TType, TId, TFilter>>
    & GroupByField;

type EntitiesConfig<TGroups, TId, TFilter> = {
    [TType in keyof TGroups]?: EntityConfig<TGroups, TType, TId, TFilter>;
};

export class GroupingConfigBuilder<TGroups, TId, TFilter = any> implements Omit<LazyDataSourceProps<TGroups[keyof TGroups], TId, TFilter>, 'api'> {
    private entitiesConfig: EntitiesConfig<TGroups, TId, TFilter> = {};
    private groupByToEntityType: Record<string | typeof LOW_LEVEL_ENTITY, keyof TGroups> = {
        [LOW_LEVEL_ENTITY]: null,
    };

    private [DEFAULT_CONFIG]: ConfigDefault<TGroups, TId, TFilter> = null;

    addEntity<TType extends keyof TGroups>(
        entityType: TType,
        config: EntityConfig<TGroups, TType, TId, TFilter>,
    ) {
        this.entitiesConfig[entityType] = config;
        if (config.groupBy !== null) {
            this.setGroupByToEntity(entityType, config.groupBy);
        } else {
            this.setGroupByToEntity(entityType, LOW_LEVEL_ENTITY);
        }
    }

    private setGroupByToEntity<TType extends keyof TGroups>(entityType: TType, groupBy: string | string[] | typeof LOW_LEVEL_ENTITY) {
        if (Array.isArray(groupBy)) {
            groupBy?.forEach((gBy) => {
                this.groupByToEntityType[gBy] = entityType;
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

    getGroupBy(filter: TFilter) {
        return this[DEFAULT_CONFIG].getGroupBy(filter);
    }

    getDefaultConfigProps() {
        const { getType, getTypeAndId, getGroupBy, ...props } = this[DEFAULT_CONFIG];
        return props;
    }

    async api<TType extends keyof TGroups>(type: TType, ...apiArgs: Parameters<LazyDataSourceProps<TGroups[TType], TId, TFilter>['api']>) {
        return (this.entitiesConfig[type].api ?? this[DEFAULT_CONFIG].api)(...apiArgs);
    }

    async apiByGroupBy(groupBy: string, ...apiArgs: Parameters<LazyDataSourceProps<TGroups[keyof TGroups], TId, TFilter>['api']>) {
        const type = this.groupByToEntityType[groupBy];
        if (!type) {
            throw new Error(`No entity type was associated with groupBy=${groupBy}`);
        }

        return (this.entitiesConfig[type].api ?? this[DEFAULT_CONFIG].api)(...apiArgs);
    }

    async defaultApiByGroupBy(...apiArgs: Parameters<LazyDataSourceProps<TGroups[keyof TGroups], TId, TFilter>['api']>) {
        const type = this.groupByToEntityType[LOW_LEVEL_ENTITY];
        if (!type) {
            throw new Error('No entity type was associated with groupBy=null');
        }

        return (this.entitiesConfig[type].api ?? this[DEFAULT_CONFIG].api)(...apiArgs);
    }

    getId(item: UnboxUnionFromGroups<TGroups>) {
        const type = this.getType(item);
        return (this.entitiesConfig[type].getId ?? this[DEFAULT_CONFIG].getId)(item);
    }

    getParentId(item: UnboxUnionFromGroups<TGroups>) {
        const type = this.getType(item);
        const getParentId = (this.entitiesConfig[type].getParentId ?? this[DEFAULT_CONFIG].getParentId);
        if (!getParentId) {
            throw new Error(`getParentId is not specified for entity=${type.toString()}`);
        }

        return getParentId(item);
    }

    getChildCount(item: TGroups[keyof TGroups]): number {
        const type = this.getType(item);
        return (this.entitiesConfig[type].getChildCount ?? this[DEFAULT_CONFIG].getChildCount)?.(item);
    }

    getRowOptions(item: TGroups[keyof TGroups], index: number) {
        const type = this.getType(item);
        return (this.entitiesConfig[type].getRowOptions ?? this[DEFAULT_CONFIG].getRowOptions)?.(item, index);
    }

    isFoldedByDefault(item: TGroups[keyof TGroups]) {
        const type = this.getType(item);
        return (this.entitiesConfig[type].isFoldedByDefault ?? this[DEFAULT_CONFIG].isFoldedByDefault)?.(item) ?? true;
    }
}
