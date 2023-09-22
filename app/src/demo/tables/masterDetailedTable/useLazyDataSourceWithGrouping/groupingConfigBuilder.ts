import { DataRowOptions, LazyDataSourceProps } from '@epam/uui-core';
import {
    ComplexId, ConfigDefault, EntitiesConfig, EntityConfig, GroupByKey, GroupByKeys,
    GroupingConfig, GroupingsConfig, TGroupsWithMeta, UnboxUnionFromGroups,
} from './types';
import { ID, PATH } from './constants';
import isEqual from 'lodash.isequal';

const DEFAULT_CONFIG = Symbol('DEFAULT_CONFIG');

export class GroupingConfigBuilder<
    TGroups extends { [k in string]: Record<string, unknown> },
    TId extends { [K in keyof TGroups]: unknown },
    TFilter extends { groupBy?: GroupByKeys<TGroups> }
> {
    private entitiesConfig: EntitiesConfig<TGroupsWithMeta<TGroups, TId>, TId, TFilter> = {};
    private groupingsConfig: GroupingsConfig<TGroupsWithMeta<TGroups, TId>, TId, TFilter> = {};
    private groupByToEntityType: Partial<Record<GroupByKey<TGroups>, keyof TGroups>> = {};

    private [DEFAULT_CONFIG]: ConfigDefault<TGroupsWithMeta<TGroups, TId>, TId, TFilter> = null;
    private defaultEntity: keyof TGroups = null;

    addEntity<TType extends keyof TGroups>(
        entityType: TType,
        config: EntityConfig<TGroupsWithMeta<TGroups, TId>, TType, TId, TFilter>,
    ) {
        this.entitiesConfig[entityType] = config;
        this.defaultEntity = entityType;
        return this;
    }

    addGrouping<TType extends keyof TGroups>(
        groupBy: GroupByKeys<TGroups>,
        config: GroupingConfig<TGroupsWithMeta<TGroups, TId>, TType, TId, TFilter>,
    ) {
        this.setGroupByToEntity(config.type, groupBy);
        this.groupingsConfig[config.type] = config;
        return this;
    }

    addDefault(config: ConfigDefault<TGroupsWithMeta<TGroups, TId>, TId, TFilter>) {
        this[DEFAULT_CONFIG] = {
            isLastNestingLevel: () => true,
            ...config,
        };
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
        ...apiArgs: Parameters<LazyDataSourceProps<TGroupsWithMeta<TGroups, TId>[TType], TId[TType], TFilter>['api']>
    ) {
        return (this.entitiesConfig[type]?.api ?? this.groupingsConfig[type]?.api)(...apiArgs);
    }

    async defaultApi<TType extends keyof TGroups>(
        ...apiArgs: Parameters<
        LazyDataSourceProps<TGroupsWithMeta<TGroups, TId>[TType], TId[TType], TFilter>['api']
        >
    ) {
        return this.entitiesConfig[this.defaultEntity].api(...apiArgs);
    }

    async apiByGroupBy(
        groupBy: GroupByKeys<TGroups>,
        ...apiArgs: Parameters<LazyDataSourceProps<UnboxUnionFromGroups<TGroupsWithMeta<TGroups, TId>>, TId[keyof TGroups], TFilter>['api']>
    ) {
        const [request, context] = apiArgs;
        if (Array.isArray(groupBy)) {
            if (!context.parent) {
                const [gb] = groupBy;
                const type = this.groupByToEntityType[gb];
                if (!type || !this.groupingsConfig[type].api) {
                    throw new Error(`No entity type was associated with groupBy=${gb}`);
                }
                const results = await this.groupingsConfig[type].api({ ...request, filter: { ...request.filter, groupBy: gb } }, context);
                return {
                    items: results.items.map((item) => {
                        item[PATH] = [gb];
                        item[ID] = [this.buildId(item)];
                        return item;
                    }),
                };
            }

            const parentType = this.getType(context.parent);
            const isLastNestingLevel = this.entitiesConfig[parentType]?.isLastNestingLevel
                ?? this.groupingsConfig[parentType]?.isLastNestingLevel
                ?? this[DEFAULT_CONFIG].isLastNestingLevel;

            const grouping = context.parent[PATH];
            if (isLastNestingLevel(context.parent)) {
                if (isEqual(grouping, groupBy)) {
                    const results = await this.entitiesConfig[this.defaultEntity].api({
                        ...request,
                        filter: { ...request.filter, groupBy: groupBy[groupBy.length - 1] },
                    }, context);
                    return {
                        items: results.items.map((item) => {
                            item[PATH] = groupBy;
                            item[ID] = [...(context.parent?.[ID] ?? []), this.buildId(item)];
                            return item;
                        }),
                    };
                }

                const gb = groupBy[grouping.length];
                const type = this.groupByToEntityType[gb];
                const results = await this.groupingsConfig[type].api({ ...request, filter: { ...request.filter, groupBy: gb } }, context);
                return {
                    items: results.items.map((item) => {
                        item[PATH] = [...grouping, gb];
                        item[ID] = [...(context.parent?.[ID] ?? []), this.buildId(item)];
                        return item;
                    }),
                };
            }

            const gb = grouping[grouping.length - 1];
            const type = this.groupByToEntityType[gb];
            if (!type || !this.groupingsConfig[type].api) {
                throw new Error(`No entity type was associated with groupBy=${gb}`);
            }
            const results = await this.groupingsConfig[type].api({ ...request, filter: { ...request.filter, groupBy: gb } }, context);
            return {
                items: results.items.map((item) => {
                    item[PATH] = grouping;
                    item[ID] = [...(context.parent?.[ID] ?? []), this.buildId(item)];
                    return item;
                }),
            };
        }
        const type = this.groupByToEntityType[groupBy];
        if (!type || !this.groupingsConfig[type].api) {
            throw new Error(`No entity type was associated with groupBy=${groupBy}`);
        }
        const results = await this.groupingsConfig[type].api(...apiArgs);
        return {
            items: results.items.map((item) => {
                item[PATH] = [];
                item[ID] = [...(context.parent?.[ID] ?? []), this.buildId(item)];
                return item;
            }),
        };
    }

    private extractParentIdFromMeta(item: UnboxUnionFromGroups<TGroupsWithMeta<TGroups, TId>>) {
        const parentId = item[ID].slice(0, item[ID].length - 1);
        if (!parentId.length) {
            return null;
        }

        return parentId;
    }

    private extractIdFromMeta(item: UnboxUnionFromGroups<TGroupsWithMeta<TGroups, TId>>) {
        return item[ID];
    }

    private buildId(item: UnboxUnionFromGroups<TGroupsWithMeta<TGroups, TId>>): UnboxUnionFromGroups<ComplexId<TGroups, TId>> {
        const type = this.getType(item);
        const id = (this.entitiesConfig[type]?.getId ?? this[DEFAULT_CONFIG].getId ?? ((i: any) => i.id))(item);
        return [type, id];
    }

    getId(item: UnboxUnionFromGroups<TGroupsWithMeta<TGroups, TId>>): UnboxUnionFromGroups<ComplexId<TGroups, TId>>[] {
        return this.extractIdFromMeta(item);
    }

    getParentId(
        item: UnboxUnionFromGroups<TGroupsWithMeta<TGroups, TId>>,
    ): UnboxUnionFromGroups<ComplexId<TGroups, TId>>[] {
        const type = this.getType(item);
        const parentId = (
            this.entitiesConfig[type]?.getParentId
            ?? this.groupingsConfig[type]?.getParentId
            ?? this[DEFAULT_CONFIG].getParentId
            ?? ((i: any) => i.parentId)
        )(item);
        const groupBy = this.getGroupBy();
        if (parentId != null || groupBy) {
            return this.extractParentIdFromMeta(item);
        }

        return null;
    }

    getChildCount(item: UnboxUnionFromGroups<TGroupsWithMeta<TGroups, TId>>): number {
        const type = this.getType(item);
        return (
            this.entitiesConfig[type]?.getChildCount
            ?? this.groupingsConfig[type]?.getChildCount
            ?? this[DEFAULT_CONFIG]?.getChildCount
        )?.(item);
    }

    getRowOptions?(
        item: UnboxUnionFromGroups<TGroupsWithMeta<TGroups, TId>>,
        index: number,
    ): DataRowOptions<UnboxUnionFromGroups<TGroupsWithMeta<TGroups, TId>>, UnboxUnionFromGroups<ComplexId<TGroups, TId>>[]> {
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
