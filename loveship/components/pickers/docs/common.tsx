import React from 'react';
import { ArrayDataSource, LazyDataSource, DataRowProps, AsyncDataSource } from '@epam/uui';
import { DocBuilder, PropSamplesCreationContext } from '@epam/uui-docs';
import { PickerBaseOptions } from '@epam/uui-components';
import { TextPlaceholder, Text } from '../../typography';
import { Avatar } from '../../widgets';
import { DataPickerRow } from '../DataPickerRow';
import { demoData } from '@epam/uui-docs';
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
        // value: (props: any) => <LazyDataSource<any>
        //     key='persons'
        //     api={ rq => ctx.demoApi.persons({ ...rq, sorting: [{ field: 'name' }] }) }
        //     { ...props }
        // />,
        value: new LazyDataSource({
            api: rq => ctx.demoApi.persons({ ...rq, sorting: [{ field: 'name' }] }),
        }),
    },
    // {
    //     name: 'Empty',
    //     value: (props: any) => <ArrayDataSource<{ name: string }>
    //         key='empty'
    //         getSearchFields={ l => [l.name] }
    //         items={ [] }
    //         { ...props }
    //     />,
    // },
    // {
    //     name: 'Skills',
    //     value: (props: any) => <ArrayDataSource<{ uid: number, parentUid: number, name: string }>
    //         key='Skills'
    //         getSearchFields={ (l: { uid: number, parentUid: number, name: string }) => !!l.parentUid ? [l.name] : [] }
    //         items={ [
    //             { uid: 1, parentUid: null, name: '.Net' },
    //             { uid: 2, parentUid: 1, name: 'Front-End Desktop Development' },
    //             { uid: 3, parentUid: 1, name: 'Front-End Desktop Development' },
    //             { uid: 4, parentUid: null, name: 'Front-End' },
    //             { uid: 5, parentUid: 4, name: 'JavaScript Development' },
    //             { uid: 6, parentUid: 4, name: 'UX Development' },
    //             { uid: 7, parentUid: null, name: 'Java' },
    //             { uid: 8, parentUid: 7, name: 'Back-end Development' },
    //             { uid: 9, parentUid: 7, name: 'Back-end Development' },
    //         ] }
    //         getId={ s => s.uid }
    //         getParentId={ s => s.parentUid }
    //         isFoldedByDefault={ () => false }
    //         { ...props }
    //     />,
    // },
];

export const pickerBaseOptionsDoc = new DocBuilder<PickerBaseOptions<any, any>>({ name: 'PickerBaseOptions' })
    .prop('dataSource', {examples: getDataSourceExamples})
    .prop('sorting', { examples: [
            { value: { field: 'name', direction: 'asc' }, name: 'name' },
            { value: { field: 'id', direction: 'asc' }, name: 'id' },
            { value: { field: 'population', direction: 'asc' }, name: 'population' }
        ]
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
            size='60'
            padding={ (ctx.getSelectedProps() as any).editMode === 'modal' ? '24' : '12' }
            renderItem={ item =>
                <div style={ { display: 'flex', padding: '6px 0'} }>
                    <Avatar size='48' img={ props.isLoading ?
                        'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/avatar_placeholder.jpg'
                        : item.avatarUrl
                    } />
                    <div style={ { marginLeft: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' } }>
                        <Text size='30' cx={ css.userName }>
                            { props.isLoading ? <TextPlaceholder wordsCount={ 2 }/> : item.name }
                        </Text>
                        <Text size='24' color='night400' cx={ css.userTitle }>
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
