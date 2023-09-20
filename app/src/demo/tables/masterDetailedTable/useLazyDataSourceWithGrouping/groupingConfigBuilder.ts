import { DataRowOptions, LazyDataSourceProps } from '@epam/uui-core';
import {
    ComplexId, ConfigDefault, EntitiesConfig, EntityConfig, GroupByKey, GroupByKeys,
    GroupingConfig, GroupingsConfig, UnboxUnionFromGroups,
} from './types';

const DEFAULT_CONFIG = Symbol('DEFAULT_CONFIG');

export class GroupingConfigBuilder<
    TGroups extends { [k in string]: Record<string, unknown> },
    TId extends { [K in keyof TGroups]: unknown },
    TFilter extends { groupBy?: GroupByKeys<TGroups> }
> {
    private entitiesConfig: EntitiesConfig<TGroups, TId, TFilter> = {};
    private groupingsConfig: GroupingsConfig<TGroups, TId, TFilter> = {};
    private groupByToEntityType: Partial<Record<GroupByKey<TGroups>, keyof TGroups>> = {};

    private [DEFAULT_CONFIG]: ConfigDefault<TGroups, TId, TFilter> = null;
    private defaultEntity: keyof TGroups = null;

    addEntity<TType extends keyof TGroups>(
        entityType: TType,
        config: EntityConfig<TGroups, TType, TId, TFilter>,
    ) {
        this.entitiesConfig[entityType] = config;
        this.defaultEntity = entityType;
        return this;
    }

    addGrouping<TType extends keyof TGroups>(
        groupBy: GroupByKeys<TGroups>,
        config: GroupingConfig<TGroups, TType, TId, TFilter>,
    ) {
        this.setGroupByToEntity(config.type, groupBy);
        this.groupingsConfig[config.type] = config;
        return this;
    }

    addDefault(config: ConfigDefault<TGroups, TId, TFilter>) {
        this[DEFAULT_CONFIG] = config;
        return this;
    }

    private setGroupByToEntity<TType extends keyof TGroups>(entityType: TType, groupBy: GroupByKeys<TGroups>) {
        if (Array.isArray(groupBy)) {
            groupBy.forEach((gb) => {
                this.groupByToEntityType[gb] = entityType;
            });
        } else {
            this.groupByToEntityType[groupBy] = entityType;
        }
    }

    getType(entity: UnboxUnionFromGroups<TGroups>) {
        return this[DEFAULT_CONFIG].getType(entity);
    }

    getGroupBy() {
        return this[DEFAULT_CONFIG].getGroupBy();
    }

    getDefaultConfigProps() {
        const { getType, getGroupBy, ...props } = this[DEFAULT_CONFIG];
        return props;
    }

    async api<TType extends keyof TGroups>(
        type: TType,
        ...apiArgs: Parameters<LazyDataSourceProps<TGroups[TType], TId[TType], TFilter>['api']>
    ) {
        return (this.entitiesConfig[type]?.api ?? this.groupingsConfig[type]?.api)(...apiArgs);
    }

    async defaultApi<TType extends keyof TGroups>(...apiArgs: Parameters<LazyDataSourceProps<TGroups[TType], TId[TType], TFilter>['api']>) {
        return this.entitiesConfig[this.defaultEntity].api(...apiArgs);
    }

    async apiByGroupBy(
        groupBy: GroupByKeys<TGroups>,
        ...apiArgs: Parameters<LazyDataSourceProps<UnboxUnionFromGroups<TGroups>, TId[keyof TGroups], TFilter>['api']>
    ) {
        if (Array.isArray(groupBy)) {
            const promises = groupBy.map((gb) => {
                const type = this.groupByToEntityType[gb];
                if (!type || !this.groupingsConfig[type].api) {
                    throw new Error(`No entity type was associated with groupBy=${gb}`);
                }
                const [request, ...rest] = apiArgs;
                return this.groupingsConfig[type].api({ ...request, filter: { ...request.filter, groupBy: gb } }, ...rest);
            });
            const response = await Promise.all(promises);
            return { items: response.flatMap(({ items }) => items) };
        }
        const type = this.groupByToEntityType[groupBy];
        if (!type || !this.groupingsConfig[type].api) {
            throw new Error(`No entity type was associated with groupBy=${groupBy}`);
        }

        return this.groupingsConfig[type].api(...apiArgs);
    }

    getId(item: UnboxUnionFromGroups<TGroups>): UnboxUnionFromGroups<ComplexId<TGroups, TId>> {
        const type = this.getType(item);
        const id = (this.entitiesConfig[type]?.getId ?? this[DEFAULT_CONFIG].getId ?? ((i: any) => i.id))(item);
        return [type, id];
    }

    private getParentIdForGroupsBy(item: UnboxUnionFromGroups<TGroups>, groupsBy: GroupByKey<TGroups>[]): UnboxUnionFromGroups<ComplexId<TGroups, TId>> {
        const type = this.getType(item);
        const groupByIndex = groupsBy.findIndex((gb) => this.groupByToEntityType[gb] === type);
        if (groupByIndex !== -1) {
            if (groupByIndex === 0) {
                return null;
            }

            const actualGroupBy = groupsBy[groupByIndex - 1];
            const key = `${actualGroupBy}Id`;
            return [this.groupByToEntityType[actualGroupBy], key in item ? item[key] as TId[keyof TGroups] : undefined];
        }

        const actualGroupBy = groupsBy[groupsBy.length - 1];
        const key = `${actualGroupBy}Id`;
        return [this.groupByToEntityType[actualGroupBy], key in item ? item[key] as TId[keyof TGroups] : undefined];
    }

    private getParentIdForGroupBy(item: UnboxUnionFromGroups<TGroups>, groupBy: GroupByKey<TGroups>): UnboxUnionFromGroups<ComplexId<TGroups, TId>> {
        const key = `${groupBy}Id`;
        return [this.groupByToEntityType[groupBy], key in item ? item[key] as TId[keyof TGroups] : undefined];
    }

    getParentId(item: UnboxUnionFromGroups<TGroups>): UnboxUnionFromGroups<ComplexId<TGroups, TId>> {
        const type = this.getType(item);
        const parentId = (
            this.entitiesConfig[type]?.getParentId
            ?? this.groupingsConfig[type]?.getParentId
            ?? this[DEFAULT_CONFIG].getParentId
            ?? ((i: any) => i.parentId)
        )(item);
        if (parentId != null) {
            return [type, parentId];
        }

        const groupBy = this.getGroupBy();
        if (groupBy) {
            if (Array.isArray(groupBy)) {
                return this.getParentIdForGroupsBy(item, groupBy);
            }
            return this.getParentIdForGroupBy(item, groupBy);
        }
        return null;
    }

    getChildCount(item: UnboxUnionFromGroups<TGroups>): number {
        const type = this.getType(item);
        return (
            this.entitiesConfig[type]?.getChildCount
            ?? this.groupingsConfig[type]?.getChildCount
            ?? this[DEFAULT_CONFIG]?.getChildCount
        )?.(item);
    }

    getRowOptions?(item: UnboxUnionFromGroups<TGroups>, index: number): DataRowOptions<UnboxUnionFromGroups<TGroups>, [keyof TGroups, TId[keyof TGroups]]> {
        const type = this.getType(item);
        const getRowOptions = this.entitiesConfig[type]?.getRowOptions
            ?? this.groupingsConfig[type]?.getRowOptions
            ?? this[DEFAULT_CONFIG]?.getRowOptions;

        if (!getRowOptions) {
            return this[DEFAULT_CONFIG]?.rowOptions;
        }

        return getRowOptions(item, index);
    }
}
