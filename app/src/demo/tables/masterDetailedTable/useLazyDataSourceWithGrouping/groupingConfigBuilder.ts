import { DataRowOptions, LazyDataSourceApiRequest, LazyDataSourceApiRequestContext, LazyDataSourceApiResponse, LazyDataSourceProps } from '@epam/uui-core';
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

    private async api<TType extends keyof TGroups>(
        type: TType,
        ...apiArgs: Parameters<LazyDataSourceProps<TGroupsWithMeta<TGroups, TId, TFilter>[TType], TId[TType], TFilter>['api']>
    ) {
        return (this.entitiesConfig[type]?.api ?? this.groupingsConfig[type]?.api)(...apiArgs);
    }

    async getByIdsApi(
        ids: ToUnion<ComplexId<TGroups, TId, TFilter>>[][],
        groupBy: GroupBy<TGroups, TFilter>,
        context: LazyDataSourceApiRequestContext<
        ToUnion<TGroupsWithMeta<TGroups, TId, TFilter>>,
        ToUnion<ComplexId<TGroups, TId, TFilter>>[]
        >,
    ) {
        const idsByType: { [Type in keyof TGroups]?: Array<TId[keyof TGroups]> } = {};
        ids.forEach((fullId) => {
            const [type, , id] = fullId[fullId.length - 1];
            idsByType[type] = idsByType[type] ?? [];
            idsByType[type].push(id);
        });

        const typesToLoad = Object.keys(idsByType) as Array<keyof TGroups>;
        const response: LazyDataSourceApiResponse<ToUnion<TGroupsWithMeta<TGroups, TId, TFilter>>> = { items: [] };

        const promises = typesToLoad.map(async (type) => {
            const idsRequest: LazyDataSourceApiRequest<any, any, TFilter> = { ids: idsByType[type] };
            const apiResponse = await this.api(type, idsRequest);
            response.items = [...response.items, ...apiResponse.items];
        });

        await Promise.all(promises);
        const currentGroupBy = this.getGroupByPathForParent(groupBy as GroupBy<TGroups, TFilter>, context.parent);
        return this.getResultsWithMeta(response, context.parent, currentGroupBy);
    }

    async entityApi<TType extends keyof TGroups>(
        ...apiArgs: Parameters<
        LazyDataSourceProps<TGroupsWithMeta<TGroups, TId, TFilter>[TType], TId[TType], TFilter>['api']
        >
    ) {
        return this.entitiesConfig[this.defaultEntity].api(...apiArgs);
    }

    private getGroupByPathForParent(
        groupBy: GroupBy<TGroups, TFilter>,
        parent: ToUnion<TGroupsWithMeta<TGroups, TId, TFilter>> | undefined,
    ): GroupByTokens<TGroups, TFilter>[] {
        if (!groupBy) return [];

        if (Array.isArray(groupBy)) {
            if (!parent) {
                return [groupBy[0]];
            }
            const grouping = parent[PATH];
            const parentType = this.getType(parent);
            const isLastNestingLevel = this.entitiesConfig[parentType]?.isLastNestingLevel
                ?? this.groupingsConfig[parentType]?.isLastNestingLevel
                ?? this[DEFAULT_CONFIG].isLastNestingLevel;

            if (isLastNestingLevel(parent)) {
                if (isEqual(grouping, groupBy)) {
                    return groupBy;
                }
                return [...grouping, groupBy[grouping.length]];
            }
            return grouping;
        }
        return [groupBy];
    }

    async groupByApi(
        groupBy: GroupBy<TGroups, TFilter>,
        ...apiArgs: Parameters<LazyDataSourceProps<ToUnion<TGroupsWithMeta<TGroups, TId, TFilter>>, TId[keyof TGroups], TFilter>['api']>
    ) {
        const [request, context] = apiArgs;
        const filterFromGroupBy = context.parent ? this[DEFAULT_CONFIG].getFilterFromGroupByPath(context.parent[ID]) : undefined;

        const groupByPath = this.getGroupByPathForParent(groupBy, context.parent);
        const lastGroupBy = groupByPath[groupByPath.length - 1];
        if (Array.isArray(groupBy)) {
            if (!context.parent) {
                this.checkApiForGroupBy(lastGroupBy);

                const type = this.groupByToEntityType[lastGroupBy];
                const response = await this.groupingsConfig[type].api(
                    { ...request, filter: { ...request.filter, ...filterFromGroupBy, groupBy: lastGroupBy } },
                    context,
                );
                return this.getResultsWithMeta(response, context.parent, groupByPath);
            }

            const parentType = this.getType(context.parent);
            const isLastNestingLevel = this.entitiesConfig[parentType]?.isLastNestingLevel
                ?? this.groupingsConfig[parentType]?.isLastNestingLevel
                ?? this[DEFAULT_CONFIG].isLastNestingLevel;

            const grouping = context.parent[PATH];
            if (isLastNestingLevel(context.parent)) {
                if (isEqual(grouping, groupBy)) {
                    this.checkApiForGroupBy(lastGroupBy);

                    const response = await this.entitiesConfig[this.defaultEntity].api({
                        ...request,
                        filter: { ...request.filter, ...filterFromGroupBy, groupBy: lastGroupBy },
                    }, context);
                    return this.getResultsWithMeta(response, context.parent, groupByPath);
                }

                this.checkApiForGroupBy(lastGroupBy);

                const type = this.groupByToEntityType[lastGroupBy];
                const response = await this.groupingsConfig[type].api(
                    { ...request, filter: { ...request.filter, ...filterFromGroupBy, groupBy: lastGroupBy } },
                    context,
                );
                return this.getResultsWithMeta(response, context.parent, groupByPath);
            }

            this.checkApiForGroupBy(lastGroupBy);

            const type = this.groupByToEntityType[lastGroupBy];
            const response = await this.groupingsConfig[type].api(
                { ...request, filter: { ...request.filter, ...filterFromGroupBy, groupBy: lastGroupBy } },
                context,
            );
            return this.getResultsWithMeta(response, context.parent, groupByPath);
        }

        this.checkApiForGroupBy(lastGroupBy);

        const type = this.groupByToEntityType[lastGroupBy];
        const response = await this.groupingsConfig[type].api(
            { ...request, filter: { ...request.filter, ...filterFromGroupBy } },
            context,
        );
        return this.getResultsWithMeta(response, context.parent, groupByPath);
    }

    private checkApiForGroupBy(groupBy: GroupByTokens<TGroups, TFilter>) {
        const type = this.groupByToEntityType[groupBy];
        if (!type || !this.groupingsConfig[type].api) {
            throw new Error(`No entity type was associated with groupBy=${groupBy}`);
        }
    }

    private getResultsWithMeta(
        results: LazyDataSourceApiResponse<TGroupsWithMeta<TGroups, TId, TFilter>[keyof TGroups]>,
        parent: ToUnion<TGroupsWithMeta<TGroups, TId, TFilter>> | undefined,
        groupBy: GroupByTokens<TGroups, TFilter>[],
    ) {
        return {
            items: results.items.map((item) => {
                const currentGroupBy: GroupByTokens<TGroups, TFilter> | undefined = groupBy[groupBy.length - 1];
                const idWithType = this.buildId(item, currentGroupBy);
                item[PATH] = groupBy;
                item[ID] = [...(parent?.[ID] ?? []), idWithType];
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
