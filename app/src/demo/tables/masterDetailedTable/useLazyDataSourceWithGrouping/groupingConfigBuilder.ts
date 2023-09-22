import { DataRowOptions, LazyDataSourceProps } from '@epam/uui-core';
import {
    ComplexId, ConfigDefault, EntitiesConfig, EntityConfig, GroupByKeys,
    GroupingConfig, GroupingsConfig, TGroupsWithMeta, UnboxArray, UnboxUnionFromGroups,
} from './types';
import { ID, PATH } from './constants';
import isEqual from 'lodash.isequal';

const DEFAULT_CONFIG = Symbol('DEFAULT_CONFIG');

export class GroupingConfigBuilder<
    TGroups extends { [k in string]: Record<string, unknown> },
    TId extends { [K in keyof TGroups]: unknown },
    TFilter extends { groupBy?: GroupByKeys<TGroups> }
> {
    private entitiesConfig: EntitiesConfig<TGroupsWithMeta<TGroups, TId, TFilter>, TId, TFilter> = {};
    private groupingsConfig: GroupingsConfig<TGroupsWithMeta<TGroups, TId, TFilter>, TId, TFilter> = {};
    private groupByToEntityType: Partial<Record<UnboxArray<TFilter['groupBy']>, keyof TGroups>> = {};

    private [DEFAULT_CONFIG]: ConfigDefault<TGroupsWithMeta<TGroups, TId, TFilter>, TId, TFilter> = null;
    private defaultEntity: keyof TGroups = null;

    addEntity<TType extends keyof TGroups>(
        entityType: TType,
        config: EntityConfig<TGroupsWithMeta<TGroups, TId, TFilter>, TType, TId, TFilter>,
    ) {
        this.entitiesConfig[entityType] = config;
        this.defaultEntity = entityType;
        return this;
    }

    addGrouping<TType extends keyof TGroups>(
        groupBy: UnboxArray<TFilter['groupBy']> | UnboxArray<TFilter['groupBy']>[],
        config: GroupingConfig<TGroupsWithMeta<TGroups, TId, TFilter>, TType, TId, TFilter>,
    ) {
        this.setGroupByToEntity(config.type, groupBy);
        this.groupingsConfig[config.type] = config;
        return this;
    }

    addDefault(config: ConfigDefault<TGroupsWithMeta<TGroups, TId, TFilter>, TId, TFilter>) {
        this[DEFAULT_CONFIG] = {
            isLastNestingLevel: () => true,
            ...config,
        };
        return this;
    }

    private setGroupByToEntity<TType extends keyof TGroups>(entityType: TType, groupBy: UnboxArray<TFilter['groupBy']> | UnboxArray<TFilter['groupBy']>[]) {
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
        groupBy: UnboxArray<TFilter['groupBy']> | UnboxArray<TFilter['groupBy']>[],
        ...apiArgs: Parameters<LazyDataSourceProps<UnboxUnionFromGroups<TGroupsWithMeta<TGroups, TId, TFilter>>, TId[keyof TGroups], TFilter>['api']>
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

    private extractParentIdFromMeta(item: UnboxUnionFromGroups<TGroupsWithMeta<TGroups, TId, TFilter>>) {
        const parentId = item[ID].slice(0, item[ID].length - 1);
        if (!parentId.length) {
            return null;
        }

        return parentId;
    }

    private extractIdFromMeta(item: UnboxUnionFromGroups<TGroupsWithMeta<TGroups, TId, TFilter>>) {
        return item[ID];
    }

    private buildId(
        item: UnboxUnionFromGroups<TGroupsWithMeta<TGroups, TId, TFilter>>,
        groupBy?: UnboxArray<TFilter['groupBy']>,
    ): UnboxUnionFromGroups<ComplexId<TGroups, TId, TFilter>> {
        const type = this.getType(item);
        const id = (this.entitiesConfig[type]?.getId ?? this[DEFAULT_CONFIG].getId ?? ((i: any) => i.id))(item);
        return [type, groupBy, id];
    }

    getId(item: UnboxUnionFromGroups<TGroupsWithMeta<TGroups, TId, TFilter>>): UnboxUnionFromGroups<ComplexId<TGroups, TId, TFilter>>[] {
        return this.extractIdFromMeta(item);
    }

    getParentId(
        item: UnboxUnionFromGroups<TGroupsWithMeta<TGroups, TId, TFilter>>,
    ): UnboxUnionFromGroups<ComplexId<TGroups, TId, TFilter>>[] {
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

    getChildCount(item: UnboxUnionFromGroups<TGroupsWithMeta<TGroups, TId, TFilter>>): number {
        const type = this.getType(item);
        return (
            this.entitiesConfig[type]?.getChildCount
            ?? this.groupingsConfig[type]?.getChildCount
            ?? this[DEFAULT_CONFIG]?.getChildCount
        )?.(item);
    }

    getRowOptions?(
        item: UnboxUnionFromGroups<TGroupsWithMeta<TGroups, TId, TFilter>>,
        index: number,
    ): DataRowOptions<UnboxUnionFromGroups<TGroupsWithMeta<TGroups, TId, TFilter>>, UnboxUnionFromGroups<ComplexId<TGroups, TId, TFilter>>[]> {
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
