import { ArrayDataSource, LazyDataSource, AsyncDataSource, PickerBaseOptions } from '@epam/uui-core';
import { DocBuilder } from '../DocBuilder';
import { demoData } from '../demoData';
import { IDocBuilderGenCtx } from '../docBuilderGen';

const dataSourcesMap: any = {
    languages: null,
    languageLevels: new ArrayDataSource({
        items: demoData.languageLevels,
    }),
    cities: null,
    lazyLocations: null,
    locations: null,
    persons: null,
};

const getDataSourceExamples = (ctx: IDocBuilderGenCtx) => {
    dataSourcesMap.languages = dataSourcesMap.languages
        || new AsyncDataSource({
            api: (options) => ctx.demoApi.languages(options).then((r) => r.items),
        });
    dataSourcesMap.cities = dataSourcesMap.cities
        || new AsyncDataSource({
            api: (options) => ctx.demoApi.cities({ sorting: [{ field: 'name' }], ...options }).then((r) => r.items),
        });
    dataSourcesMap.languages = dataSourcesMap.languages
        || new AsyncDataSource({
            api: (options) => ctx.demoApi.languages(options).then((r) => r.items),
        });
    dataSourcesMap.lazyLocations = dataSourcesMap.lazyLocations
        || new LazyDataSource({
            api: (request, context) => {
                const { search } = request;
                const filter = search ? {} : { parentId: context?.parentId };
                return ctx.demoApi.locations({ ...request, search, filter });
            },
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
            getChildCount: (l) => l.childCount,
        });

    dataSourcesMap.locations = dataSourcesMap.locations
        || new AsyncDataSource({
            api: (options) => ctx.demoApi.locations(options).then((r) => r.items),
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
        });

    dataSourcesMap.persons = dataSourcesMap.persons
        || new LazyDataSource({
            api: (rq) => ctx.demoApi.persons({ ...rq, sorting: [{ field: 'name' }] }),
        });

    return [
        {
            name: 'Languages',
            isDefault: true,
            value: dataSourcesMap.languages,
        }, {
            name: 'Language Levels',
            value: dataSourcesMap.languageLevels,
        }, {
            name: 'Cities',
            value: dataSourcesMap.cities,
        }, {
            name: 'Locations',
            value: dataSourcesMap.locations,
        }, {
            name: 'Lazy locations',
            value: dataSourcesMap.lazyLocations,
        }, {
            name: 'Persons',
            value: dataSourcesMap.persons,
        },
    ];
};

export const getPickerBaseOptionsDoc = (ctx: IDocBuilderGenCtx) => new DocBuilder<PickerBaseOptions<any, any>>({ name: 'PickerBaseOptions' })
    .prop('dataSource', { examples: getDataSourceExamples(ctx), isRequired: true, remountOnChange: true })
    .prop('sorting', {
        examples: [
            { value: { field: 'name', direction: 'asc' }, name: 'name' }, { value: { field: 'id', direction: 'asc' }, name: 'id' }, { value: { field: 'population', direction: 'asc' }, name: 'population' },
        ],
    })
    .prop('emptyValue', {
        examples: [
            { name: 'undefined', value: undefined }, { name: 'null', value: null }, { name: '[]', value: [] },
        ],
    })
    .prop('getName', {
        examples: [{ name: 'i => i.name', value: (i) => i.name }, { name: 'i => i.level', value: (i) => i.level }],
    })
    .prop('entityName', {
        examples: [
            'Language', 'City', 'Role', 'Location', 'Person',
        ],
    })
    .prop('entityPluralName', { examples: ['Cities'] });
