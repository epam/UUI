import * as React from 'react';
import { ArrayDataSource, LazyDataSource, AsyncDataSource, PickerBaseOptions } from '@epam/uui-core';
import { DocBuilder, PropSamplesCreationContext } from '@epam/uui-docs';
import { Text } from '@epam/loveship';
import { DataPickerRow } from '@epam/loveship';
import { demoData } from '@epam/uui-docs';
import { PickerItem } from '@epam/loveship';
import css from './DataPickerRowDoc.scss';

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

export const getDataSourceExamples = (ctx: PropSamplesCreationContext) => {
    dataSourcesMap.languages =
        dataSourcesMap.languages ||
        new AsyncDataSource({
            api: () => ctx.demoApi.languages({}).then((r) => r.items),
        });
    dataSourcesMap.cities =
        dataSourcesMap.cities ||
        new AsyncDataSource({
            api: () => ctx.demoApi.cities({ sorting: [{ field: 'name' }] }).then((r) => r.items),
        });
    dataSourcesMap.languages =
        dataSourcesMap.languages ||
        new AsyncDataSource({
            api: () => ctx.demoApi.languages({}).then((r) => r.items),
        });
    dataSourcesMap.lazyLocations =
        dataSourcesMap.lazyLocations ||
        new LazyDataSource({
            api: (request, context) => {
                const { search } = request;
                const filter = search ? {} : { parentId: context?.parentId };
                return ctx.demoApi.locations({ ...request, search, filter });
            },
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
            getChildCount: (l) => l.childCount,
        });

    dataSourcesMap.locations =
        dataSourcesMap.locations ||
        new AsyncDataSource({
            api: () => ctx.demoApi.locations({}).then((r) => r.items),
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
        });

    dataSourcesMap.persons =
        dataSourcesMap.persons ||
        new LazyDataSource({
            api: (rq) => ctx.demoApi.persons({ ...rq, sorting: [{ field: 'name' }] }),
        });

    return [
        {
            name: 'Languages',
            isDefault: true,
            value: dataSourcesMap.languages,
        },
        {
            name: 'Language Levels',
            value: dataSourcesMap.languageLevels,
        },
        {
            name: 'Cities',
            value: dataSourcesMap.cities,
        },
        {
            name: 'Locations',
            value: dataSourcesMap.locations,
        },
        {
            name: 'Lazy locations',
            value: dataSourcesMap.lazyLocations,
        },
        {
            name: 'Persons',
            value: dataSourcesMap.persons,
        },
    ];
};

export const pickerBaseOptionsDoc = new DocBuilder<PickerBaseOptions<any, any>>({ name: 'PickerBaseOptions' })
    .prop('dataSource', { examples: getDataSourceExamples })
    .prop('sorting', {
        examples: [
            { value: { field: 'name', direction: 'asc' }, name: 'name' },
            { value: { field: 'id', direction: 'asc' }, name: 'id' },
            { value: { field: 'population', direction: 'asc' }, name: 'population' },
        ],
    })
    .prop('emptyValue', {
        examples: [
            { name: 'undefined', value: undefined },
            { name: 'null', value: null },
            { name: '[]', value: [] },
        ],
    })
    .prop('getName', {
        examples: [
            { name: 'i => i.name', value: (i) => i.name },
            { name: 'i => i.level', value: (i) => i.level },
        ],
    })
    .prop('entityName', { examples: ['Language', 'City', 'Role', 'Location', 'Person'] })
    .prop('entityPluralName', { examples: ['Cities'] })
    .prop('renderRow', {
        examples: (ctx) => [
            {
                name: 'UserPickerRow',
                value: (props) => (
                    <DataPickerRow
                        {...props}
                        key={props.rowKey}
                        alignActions="center"
                        padding={(ctx.getSelectedProps() as any).editMode === 'modal' ? '24' : '12'}
                        renderItem={(item, rowProps) => <PickerItem {...rowProps} avatarUrl={item.avatarUrl} title={item.name} subtitle={item.jobTitle} />}
                    />
                ),
            },
            {
                name: 'Skills',
                value: (rowProps) => {
                    const isParent = !rowProps.value.parentId;
                    return (
                        <DataPickerRow
                            {...rowProps}
                            depth={isParent ? 0 : 1}
                            cx={isParent && css.parent}
                            isFoldable={false}
                            isChecked={isParent ? false : rowProps.isChecked}
                            isChildrenChecked={false}
                            isSelectable={isParent ? false : rowProps.isSelectable}
                            isFocused={isParent ? false : rowProps.isFocused}
                            borderBottom="none"
                            size={'36'}
                            renderItem={(i) => <Text size={'36'}>{i.name}</Text>}
                        />
                    );
                },
            },
        ],
    })
    .prop('cascadeSelection', { examples: [true, 'explicit', 'implicit'] });
