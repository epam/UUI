import { DataRowOptions, LazyDataSourceProps } from '@epam/uui-core';
import {
    BaseGroups,
    BaseGroupsIds,
    ComplexId, ConfigDefault, EntitiesConfig, EntityConfig, GroupByKeys,
    GroupingConfig, GroupingsConfig, TGroupsWithMeta, ToUnion, GroupByTokens, GroupBy,
} from './types';
import { ID, PATH } from './constants';
import isEqual from 'lodash.isequal';

const DEFAULT_CONFIG = Symbol('DEFAULT_CONFIG');

export class GroupingConfigBuilder<
    TGroups extends BaseGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends { groupBy?: GroupByKeys<TGroups> }
> {
    private entitiesConfig: EntitiesConfig<TGroups, TId, TFilter> = {};
    private groupingsConfig: GroupingsConfig<TGroups, TId, TFilter> = {};
    private groupByToEntityType: { [K in GroupByTokens<TGroups, TFilter>]?: keyof TGroups } = {};

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
        groupBy: GroupBy<TGroups, TFilter>,
        config: GroupingConfig<TGroups, TType, TId, TFilter>,
    ) {
        this.setGroupByToEntity(config.type, groupBy);
        this.groupingsConfig[config.type] = config;
        return this;
    }

    addDefault(config: ConfigDefault<TGroups, TId, TFilter>) {
        this[DEFAULT_CONFIG] = {
            isLastNestingLevel: () => true,
            ...config,
        };
        return this;
    }

    private setGroupByToEntity<TType extends keyof TGroups>(
        entityType: TType,
        groupBy: GroupBy<TGroups, TFilter>,
    ) {
        if (Array.isArray(groupBy)) {
            groupBy.forEach((gb) => {
                this.groupByToEntityType[gb] = entityType;
            });
        } else {
            this.groupByToEntityType[groupBy] = entityType;
        }
    }

    getType(entity: ToUnion<TGroups>) {
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
        ...apiArgs: Parameters<LazyDataSourceProps<TGroupsWithMeta<TGroups, TId, TFilter>[TType], TId[TType], TFilter>['api']>
    ) {
        return (this.entitiesConfig[type]?.api ?? this.groupingsConfig[type]?.api)(...apiArgs);
    }

    async defaultApi<TType extends keyof TGroups>(
        ...apiArgs: Parameters<
        LazyDataSourceProps<TGroupsWithMeta<TGroups, TId, TFilter>[TType], TId[TType], TFilter>['api']
        >
    ) {
        return this.entitiesConfig[this.defaultEntity].api(...apiArgs);
    }

    async apiByGroupBy(
        groupBy: GroupBy<TGroups, TFilter>,
        ...apiArgs: Parameters<LazyDataSourceProps<ToUnion<TGroupsWithMeta<TGroups, TId, TFilter>>, TId[keyof TGroups], TFilter>['api']>
    ) {
        const [request, context] = apiArgs;
        const filterFromGroupBy = context.parent ? this[DEFAULT_CONFIG].getFilterFromGroupByPath(context.parent[ID]) : undefined;

        if (Array.isArray(groupBy)) {
            if (!context.parent) {
                const [gb] = groupBy;
                const type = this.groupByToEntityType[gb];
                if (!type || !this.groupingsConfig[type].api) {
                    throw new Error(`No entity type was associated with groupBy=${gb}`);
                }
                const results = await this.groupingsConfig[type].api({ ...request, filter: { ...request.filter, ...filterFromGroupBy, groupBy: gb } }, context);
                return {
                    items: results.items.map((item) => {
                        const idWithType = this.buildId(item, gb);
                        item[PATH] = [gb];
                        item[ID] = [idWithType];

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
                    const gb = groupBy[groupBy.length - 1];
                    const results = await this.entitiesConfig[this.defaultEntity].api({
                        ...request,
                        filter: { ...request.filter, ...filterFromGroupBy, groupBy: gb },
                    }, context);
                    return {
                        items: results.items.map((item) => {
                            const idWithType = this.buildId(item, gb);
                            item[PATH] = groupBy;
                            item[ID] = [...(context.parent?.[ID] ?? []), idWithType];

                            return item;
                        }),
                    };
                }

                const gb = groupBy[grouping.length];
                const type = this.groupByToEntityType[gb];
                const results = await this.groupingsConfig[type].api({ ...request, filter: { ...request.filter, ...filterFromGroupBy, groupBy: gb } }, context);
                return {
                    items: results.items.map((item) => {
                        const idWithType = this.buildId(item, gb);
                        item[PATH] = [...grouping, gb];
                        item[ID] = [...(context.parent?.[ID] ?? []), idWithType];

                        return item;
                    }),
                };
            }

            const gb = grouping[grouping.length - 1];
            const type = this.groupByToEntityType[gb];
            if (!type || !this.groupingsConfig[type].api) {
                throw new Error(`No entity type was associated with groupBy=${gb}`);
            }
            const results = await this.groupingsConfig[type].api({ ...request, filter: { ...request.filter, ...filterFromGroupBy, groupBy: gb } }, context);
            return {
                items: results.items.map((item) => {
                    const idWithType = this.buildId(item, gb);
                    item[PATH] = grouping;
                    item[ID] = [...(context.parent?.[ID] ?? []), idWithType];

                    return item;
                }),
            };
        }
        const type = this.groupByToEntityType[groupBy];
        if (!type || !this.groupingsConfig[type].api) {
            throw new Error(`No entity type was associated with groupBy=${groupBy}`);
        }
        const results = await this.groupingsConfig[type].api({ ...request, filter: { ...request.filter, ...filterFromGroupBy } }, context);
        return {
            items: results.items.map((item) => {
                const idWithType = this.buildId(item, groupBy);
                item[PATH] = [];
                item[ID] = [...(context.parent?.[ID] ?? []), idWithType];

                return item;
            }),
        };
    }

    private extractParentIdFromMeta(item: ToUnion<TGroupsWithMeta<TGroups, TId, TFilter>>) {
        const parentId = item[ID].slice(0, item[ID].length - 1);
        if (!parentId.length) {
            return null;
        }

        return parentId;
    }

    private extractIdFromMeta(item: ToUnion<TGroupsWithMeta<TGroups, TId, TFilter>>) {
        return item[ID];
    }

    private buildId(
        item: ToUnion<TGroupsWithMeta<TGroups, TId, TFilter>>,
        groupBy?: GroupByTokens<TGroups, TFilter>,
    ): ToUnion<ComplexId<TGroups, TId, TFilter>> {
        const type = this.getType(item);
        const id = (this.entitiesConfig[type]?.getId ?? this[DEFAULT_CONFIG].getId ?? ((i: any) => i.id))(item);
        return [type, groupBy, id];
    }

    getId(item: ToUnion<TGroupsWithMeta<TGroups, TId, TFilter>>): ToUnion<ComplexId<TGroups, TId, TFilter>>[] {
        return this.extractIdFromMeta(item);
    }

    getParentId(
        item: ToUnion<TGroupsWithMeta<TGroups, TId, TFilter>>,
    ): ToUnion<ComplexId<TGroups, TId, TFilter>>[] {
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

    getChildCount(item: ToUnion<TGroupsWithMeta<TGroups, TId, TFilter>>): number {
        const type = this.getType(item);
        return (
            this.entitiesConfig[type]?.getChildCount
            ?? this.groupingsConfig[type]?.getChildCount
            ?? this[DEFAULT_CONFIG]?.getChildCount
        )?.(item);
    }

    getRowOptions?(
        item: ToUnion<TGroupsWithMeta<TGroups, TId, TFilter>>,
        index: number,
    ): DataRowOptions<ToUnion<TGroupsWithMeta<TGroups, TId, TFilter>>, ToUnion<ComplexId<TGroups, TId, TFilter>>[]> {
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
