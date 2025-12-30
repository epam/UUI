import isEqual from 'react-fast-compare';
import { DataRowOptions, LazyDataSourceApiRequest, LazyDataSourceApiRequestContext, LazyDataSourceApiResponse, LazyDataSourceProps } from '@epam/uui-core';
import {
    BaseGroups,
    BaseGroupsIds,
    ComplexId, ConfigDefault, EntitiesConfig, EntityConfig,
    GroupingConfig, GroupingsConfig, TGroupsWithMeta, ToUnion, BaseFilter, FilterFromParentId, BaseGroupBy, GroupByForType,
} from './types';
import { ID, PATH } from './constants';

const DEFAULT_CONFIG = Symbol('DEFAULT_CONFIG');

export class GroupingConfigBuilder<
    TGroups extends BaseGroups,
    TId extends BaseGroupsIds<TGroups>,
    TFilter extends BaseFilter<TGroups, TGroupBy>,
    TGroupBy extends BaseGroupBy<TGroups>,
> {
    private entitiesConfig: EntitiesConfig<TGroups, TId, TFilter, TGroupBy> = {};
    private groupingsConfig: GroupingsConfig<TGroups, TId, TFilter, TGroupBy> = {};
    private groupByToEntityType: { [K in keyof TGroupBy]?: keyof TGroups } = {};

    private [DEFAULT_CONFIG]: ConfigDefault<TGroups, TId, TFilter, TGroupBy> = null;
    private defaultEntity: keyof TGroups = null;

    addEntity<TType extends keyof TGroups>(
        entityType: TType,
        config: EntityConfig<TGroups, TType, TId, TFilter, TGroupBy>,
    ) {
        if (this.defaultEntity) {
            throw new Error(`Entity with type '${String(entityType)}' is already registered. Only one entity can be added.`);
        }

        this.entitiesConfig[entityType] = config;
        this.defaultEntity = entityType;
        return this;
    }

    addGrouping<GroupBy extends GroupByForType<TGroups, TGroupBy, TType>, TType extends TGroupBy[GroupBy]>(
        groupBy: GroupBy | GroupBy[],
        config: GroupingConfig<TGroups, TType, TId, TFilter, TGroupBy>,
    ) {
        this.setGroupByToEntity(config.type, groupBy);
        this.groupingsConfig[config.type] = config;

        return this;
    }

    addDefaults(config: ConfigDefault<TGroups, TId, TFilter, TGroupBy>) {
        this[DEFAULT_CONFIG] = {
            isLastNestingLevel: () => true,
            ...config,
        };
        return this;
    }

    private setGroupByToEntity<TType extends keyof TGroups>(
        entityType: TType,
        groupBy: GroupByForType<TGroups, TGroupBy, TType> | GroupByForType<TGroups, TGroupBy, TType>[],
    ) {
        if (Array.isArray(groupBy)) {
            groupBy.forEach((gb) => {
                this.groupByToEntityType[gb] = entityType;
            });
        } else {
            this.groupByToEntityType[groupBy] = entityType;
        }
    }

    getType<T extends keyof TGroups>(entity: TGroups[T]) {
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
        ...apiArgs: Parameters<LazyDataSourceProps<TGroupsWithMeta<TGroups, TId, TGroupBy>[TType], TId[TType], TFilter[TType]>['api']>
    ) {
        return (this.entitiesConfig[type]?.api ?? this.groupingsConfig[type]?.api)(...apiArgs);
    }

    async idsApi(
        { ids }: { ids: ToUnion<ComplexId<TGroups, TId, TGroupBy>>[][] },
        groupBy: GroupByForType<TGroups, TGroupBy, keyof TGroups> | GroupByForType<TGroups, TGroupBy, keyof TGroups> [],
        context: LazyDataSourceApiRequestContext<
        ToUnion<TGroupsWithMeta<TGroups, TId, TGroupBy>>,
        ToUnion<ComplexId<TGroups, TId, TGroupBy>>[]
        >,
    ) {
        const idsByType: { [Type in keyof TGroups]?: Array<TId[keyof TGroups]> } = {};
        ids.forEach((fullId) => {
            const [type, , id] = fullId[fullId.length - 1];
            idsByType[type] = idsByType[type] ?? [];
            idsByType[type].push(id);
        });

        const typesToLoad = Object.keys(idsByType) as Array<keyof TGroups>;
        const response: LazyDataSourceApiResponse<ToUnion<TGroupsWithMeta<TGroups, TId, TGroupBy>>> = { items: [] };

        const promises = typesToLoad.map(async (type) => {
            const idsRequest: LazyDataSourceApiRequest<any, any, TFilter[keyof TGroups]> = { ids: idsByType[type] };
            const apiResponse = await this.api(type, idsRequest, { signal: context.signal });
            response.items = [...response.items, ...apiResponse.items];
        });

        await Promise.all(promises);
        const currentGroupBy = this.getGroupByPathForParent(groupBy, context?.parent);
        return this.getResultsWithMeta(response, context?.parent, currentGroupBy);
    }

    async entityApi<TType extends keyof TGroups>(
        ...apiArgs: Parameters<
        LazyDataSourceProps<TGroupsWithMeta<TGroups, TId, TGroupBy>[TType], TId[TType], TFilter[TType]>['api']
        >
    ) {
        const [request, context] = apiArgs;
        const response = await this.entitiesConfig[this.defaultEntity].api(request, context);
        return this.getResultsWithMeta(response, context?.parent, []);
    }

    private getGroupByPathForParent(
        groupBy: GroupByForType<TGroups, TGroupBy, keyof TGroups> | GroupByForType<TGroups, TGroupBy, keyof TGroups>[],
        parent: ToUnion<TGroupsWithMeta<TGroups, TId, TGroupBy>> | undefined,
    ): Array<GroupByForType<TGroups, TGroupBy, keyof TGroups>> {
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

    async groupByApi<GroupBy extends GroupByForType<TGroups, TGroupBy, keyof TGroups>>(
        groupBy: GroupBy | GroupBy[],
        ...apiArgs: Parameters<
        LazyDataSourceProps<
        TGroupsWithMeta<TGroups, TId, TGroupBy>[keyof TGroups],
        TId[keyof TGroups],
        TFilter[keyof TGroups]
        >['api']>
    ) {
        const [request, context] = apiArgs;
        const filterFromGroupBy = context?.parent ? this.getFilterFromParentId(context?.parent[ID]) : {};
        const groupByPath = this.getGroupByPathForParent(groupBy, context?.parent);
        const lastGroupBy = groupByPath[groupByPath.length - 1];
        if (Array.isArray(groupBy)) {
            if (!context?.parent) {
                this.checkApiForGroupBy(lastGroupBy);

                const type = this.groupByToEntityType[lastGroupBy];
                const filter = this.groupingsConfig[type].getFilter?.(filterFromGroupBy);

                const response = await this.groupingsConfig[type].api(
                    { ...request, filter: { ...request.filter, ...filter, groupBy: lastGroupBy } },
                    context,
                );
                return this.getResultsWithMeta(response, context?.parent, groupByPath);
            }

            const parentType = this.getType(context?.parent);
            const isLastNestingLevel = this.entitiesConfig[parentType]?.isLastNestingLevel
                ?? this.groupingsConfig[parentType]?.isLastNestingLevel
                ?? this[DEFAULT_CONFIG].isLastNestingLevel;

            const grouping = context?.parent[PATH];
            if (isLastNestingLevel(context?.parent)) {
                if (isEqual(grouping, groupBy)) {
                    this.checkApiForGroupBy(lastGroupBy);
                    const filter = this.entitiesConfig[this.defaultEntity].getFilter?.(filterFromGroupBy);

                    const response = await this.entitiesConfig[this.defaultEntity].api({
                        ...request,
                        filter: { ...request.filter, ...filter, groupBy: undefined },
                    }, context);
                    return this.getResultsWithMeta(response, context?.parent, groupByPath);
                }

                this.checkApiForGroupBy(lastGroupBy);

                const type = this.groupByToEntityType[lastGroupBy];
                const filter = this.groupingsConfig[type].getFilter?.(filterFromGroupBy);

                const response = await this.groupingsConfig[type].api(
                    { ...request, filter: { ...request.filter, ...filter, groupBy: lastGroupBy } },
                    context,
                );
                return this.getResultsWithMeta(response, context?.parent, groupByPath);
            }

            this.checkApiForGroupBy(lastGroupBy);

            const type = this.groupByToEntityType[lastGroupBy];
            const filter = this.groupingsConfig[type].getFilter?.(filterFromGroupBy);

            const response = await this.groupingsConfig[type].api(
                { ...request, filter: { ...request.filter, ...filter, groupBy: lastGroupBy } },
                context,
            );
            return this.getResultsWithMeta(response, context?.parent, groupByPath);
        }

        this.checkApiForGroupBy(lastGroupBy);

        const type = this.groupByToEntityType[lastGroupBy];
        const filter = this.groupingsConfig[type].getFilter?.(filterFromGroupBy);

        const response = await this.groupingsConfig[type].api(
            { ...request, filter: { ...request.filter, ...filter } },
            context,
        );
        return this.getResultsWithMeta(response, context?.parent, groupByPath);
    }

    private checkApiForGroupBy(groupBy: keyof TGroupBy) {
        const type = this.groupByToEntityType[groupBy];
        if (!type || !this.groupingsConfig[type].api) {
            throw new Error(`No entity type was associated with groupBy=${String(groupBy)}`);
        }
    }

    private getResultsWithMeta(
        results: LazyDataSourceApiResponse<TGroupsWithMeta<TGroups, TId, TGroupBy>[keyof TGroups]>,
        parent: ToUnion<TGroupsWithMeta<TGroups, TId, TGroupBy>> | undefined,
        groupBy: Array<GroupByForType<TGroups, TGroupBy, keyof TGroups>>,
    ) {
        return {
            items: results.items.map((item) => {
                const currentGroupBy = groupBy[groupBy.length - 1];
                const idWithType = this.buildId(item, currentGroupBy);
                item[PATH] = groupBy;
                item[ID] = [...(parent?.[ID] ?? []), idWithType];
                return item;
            }),
        };
    }

    private getFilterFromParentId(
        parentId: ToUnion<ComplexId<TGroups, TId, TGroupBy>>[] = [],
    ): FilterFromParentId<TGroups, TId, TGroupBy> {
        return parentId.reduce(
            (filter, [, groupBy, id]) =>
                groupBy ? { ...filter, [`${String(groupBy)}Id`]: id } : filter,
            {},
        );
    }

    private extractParentIdFromMeta(item: ToUnion<TGroupsWithMeta<TGroups, TId, TGroupBy>>) {
        const parentId = item[ID].slice(0, item[ID].length - 1);
        if (!parentId.length) {
            return null;
        }

        return parentId;
    }

    private extractIdFromMeta(item: ToUnion<TGroupsWithMeta<TGroups, TId, TGroupBy>>) {
        return item[ID];
    }

    private buildId<T extends keyof TGroups>(
        item: TGroups[T],
        groupBy?: GroupByForType<TGroups, TGroupBy, T>,
    ): ComplexId<TGroups, TId, TGroupBy>[T] {
        const type = this.getType(item);
        const id = (this.entitiesConfig[type]?.getId ?? this[DEFAULT_CONFIG].getId ?? ((i: any) => i.id))(item);
        return [type, groupBy, id] as ComplexId<TGroups, TId, TGroupBy>[T];
    }

    getId(item: ToUnion<TGroupsWithMeta<TGroups, TId, TGroupBy>>): ToUnion<ComplexId<TGroups, TId, TGroupBy>>[] {
        return this.extractIdFromMeta(item);
    }

    getParentId(
        item: ToUnion<TGroupsWithMeta<TGroups, TId, TGroupBy>>,
    ): ToUnion<ComplexId<TGroups, TId, TGroupBy>>[] {
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

    getChildCount(item: ToUnion<TGroupsWithMeta<TGroups, TId, TGroupBy>>): number {
        const type = this.getType(item);
        return (
            this.entitiesConfig[type]?.getChildCount
            ?? this.groupingsConfig[type]?.getChildCount
            ?? this[DEFAULT_CONFIG]?.getChildCount
        )?.(item);
    }

    getRowOptions?(
        item: ToUnion<TGroupsWithMeta<TGroups, TId, TGroupBy>>,
        index: number,
    ): DataRowOptions<ToUnion<TGroupsWithMeta<TGroups, TId, TGroupBy>>, ToUnion<ComplexId<TGroups, TId, TGroupBy>>[]> {
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
