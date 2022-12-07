import * as React from 'react';
import { ArrayDataSource, LazyDataSource, AsyncDataSource, PickerBaseOptions } from "@epam/uui-core";
import { DocBuilder, PropSamplesCreationContext } from '@epam/uui-docs';
import { Text } from '../../typography';
import { DataPickerRow } from '../DataPickerRow';
import { demoData } from '@epam/uui-docs';
import { PickerItem } from '../PickerItem';
import css from './DataPickerRowDoc.scss';

export const getDataSourceExamples = (ctx: PropSamplesCreationContext) => [
    {
        name: 'Languages',
        isDefault: true,
        value: new AsyncDataSource({
            api: () => ctx.demoApi.languages({}).then(r => r.items),
        }),
    },
    {
        name: 'Language Levels',
        value: new ArrayDataSource({
            items: demoData.languageLevels,
        }),
    },
    {
        name: 'Cities',
        value: new AsyncDataSource({
            api: () => ctx.demoApi.cities({ sorting: [{ field: 'name' }] }).then(r => r.items),
        }),
    },
    {
        name: 'Locations',
        value: new AsyncDataSource({
            api: () => ctx.demoApi.locations({}).then(r => r.items),
        }),
    },
    {
        name: 'Persons',
        value: new LazyDataSource({
            api: rq => ctx.demoApi.persons({ ...rq, sorting: [{ field: 'name' }] }),
        }),
    },
];

export const pickerBaseOptionsDoc = new DocBuilder<PickerBaseOptions<any, any>>({ name: 'PickerBaseOptions' })
    .prop('dataSource', { examples: getDataSourceExamples, isRequired: true })
    .prop('emptyValue', {
        examples: [
            { name: 'undefined', value: undefined },
            { name: 'null', value: null },
            { name: '[]', value: [] },
        ],
    })
    .prop('getName', {
        examples: [
            { name: 'i => i.name', value: i => i.name },
            { name: 'i => i.level', value: i => i.level },
        ],
    })
    .prop('entityName', { examples: ['Language', 'City', 'Role', 'Location', 'Person'] })
    .prop('entityPluralName', { examples: ['Cities'] })
    .prop('renderRow', { examples: ctx => [
        {
            name: 'UserPickerRow',
            value: props => <DataPickerRow
                { ...props }
                key={ props.rowKey }
                alignActions='center'
                padding={ (ctx.getSelectedProps() as any).editMode === 'modal' ? '24' : '12' }
                renderItem={ (item, rowProps) =>
                    <PickerItem { ...rowProps } avatarUrl={ item.avatarUrl } title={ item.name } subtitle={ item.jobTitle } />
                }
            />,
        },
        {
            name: 'Skills',
            value: rowProps => {
                const isParent = !rowProps.value.parentId;
                return <DataPickerRow
                    { ...rowProps }
                    depth={ isParent ? 0 : 1 }
                    cx={ isParent && css.parent }
                    isFoldable={ false }
                    isChecked={ isParent ? false : rowProps.isChecked }
                    isChildrenChecked={ false }
                    isSelectable={ isParent ? false : rowProps.isSelectable }
                    isFocused={ isParent ? false : rowProps.isFocused }
                    borderBottom='none'
                    size={ '36' }
                    renderItem={ i => <Text size={ '36' }>{ i.name }</Text> }
                />;
            },
        },
    ]})
    .prop('cascadeSelection', { examples: [true] });

