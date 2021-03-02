import * as React from 'react';
import { ArrayDataSource, LazyDataSource, DataRowProps, AsyncDataSource } from '@epam/uui';
import { DocBuilder, PropSamplesCreationContext } from '@epam/uui-docs';
import { PickerBaseOptions, Avatar } from '@epam/uui-components';
import { TextPlaceholder, Text } from '../../typography';
import { DataPickerRow } from '../DataPickerRow';
import { demoData, Location, City, Language, LanguageLevel } from '@epam/uui-docs';
import * as css from './DataPickerRowDoc.scss';

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
            { name: 'i => i.name', value: (i: any) => i.name },
            { name: 'i => i.level', value: (i: any) => i.level },
        ],
    })
    .prop('entityName', { examples: ['Language', 'City', 'Role', 'Location', 'Person'] })
    .prop('entityPluralName', { examples: ['Cities'] })
    .prop('renderRow', { examples: (ctx) => [
        { name: 'UserPickerRow', value: (props: DataRowProps<any, any>) => <DataPickerRow
            { ...props }
            key={ props.rowKey }
            size='48'
            padding={ (ctx.getSelectedProps() as any).editMode === 'modal' ? '24' : '12' }
            renderItem={ item =>
                <div style={ { display: 'flex', padding: '6px 0'} }>
                    <Avatar size='36' img={ props.isLoading ?
                        'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/avatar_placeholder.jpg'
                        : item.avatarUrl
                    } />
                    <div style={ { marginLeft: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' } }>
                        <Text size='30' cx={ css.userName }>
                            { props.isLoading ? <TextPlaceholder wordsCount={ 2 }/> : item.name }
                        </Text>
                        <Text size='24' color='gray60' cx={ css.userTitle }>
                            { props.isLoading ? <TextPlaceholder wordsCount={ 2 }/> : item.jobTitle }
                        </Text>
                    </div>
                </div>
            }
        />},
        {
            name: 'Skills',
            value: (rowProps: DataRowProps<any, any>) => {
                let isParent = !rowProps.value.parentId;
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

