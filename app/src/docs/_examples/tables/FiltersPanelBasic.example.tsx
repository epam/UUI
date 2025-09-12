import React, { useCallback } from 'react';
import dayjs from 'dayjs';
import {
    defaultPredicates, rangeDatePickerPresets, FiltersPanel, DataTable, Panel, FlexRow, Text, Switch, Badge,
    BadgeProps, DataPickerRow, PickerItem,
} from '@epam/uui';
import {
    DataColumnProps,
    getSeparatedValue,
    TableFiltersConfig,
    useLazyDataSource,
    useTableState,
    useUuiContext,
    RangeDatePickerValue,
    DataTableState,
} from '@epam/uui-core';
import { Country, Person } from '@epam/uui-docs';

const personColumns: DataColumnProps<Person, number>[] = [
    {
        key: 'name',
        caption: 'Name',
        render: (p) => <Text>{p.name}</Text>,
        width: 180,
        isSortable: true,
        isAlwaysVisible: true,
    },
    {
        key: 'profileStatus',
        caption: 'Profile status',
        render: (p) =>
            p.profileStatus && (
                <FlexRow>
                    <Badge indicator size="24" fill="outline" color={ p.profileStatus.toLowerCase() as BadgeProps['color'] } caption={ p.profileStatus } />
                </FlexRow>
            ),
        width: 140,
        isSortable: true,
        isFilterActive: (f) => !!f.profileStatusId,
    },
    {
        key: 'salary',
        caption: 'Salary',
        render: (p) => (
            <Text>
                {getSeparatedValue(+p.salary, {
                    style: 'currency', currency: 'USD', maximumFractionDigits: 2, minimumFractionDigits: 2,
                }, 'en-US')}
            </Text>
        ),
        width: 150,
        textAlign: 'right',
        isSortable: true,
    },
    {
        key: 'jobTitle',
        caption: 'Title',
        render: (r) => <Text>{r.jobTitle}</Text>,
        width: 200,
        isFilterActive: (f) => !!f.jobTitleId,
    },
    {
        key: 'productionCategory',
        caption: 'Is Production',
        render: (r) => <Text>{r.productionCategory ? 'Yes' : 'No' }</Text>,
        width: 100,
        isFilterActive: (f) => !!f.jobTitleId,
    },
    {
        key: 'birthDate',
        caption: 'Birth date',
        render: (p) => p?.birthDate && <Text>{dayjs(p.birthDate).format('MMM D, YYYY')}</Text>,
        width: 120,
        isSortable: true,
    },
    {
        key: 'hireDate',
        caption: 'Hire date',
        render: (p) => p?.hireDate && <Text>{dayjs(p.hireDate).format('MMM D, YYYY')}</Text>,
        width: 120,
        isSortable: true,
    },
];

type FilterType = Person & { hireDatePreventEmpty: RangeDatePickerValue; birthDatePreventEmpty: string };

export default function FiltersPanelExample() {
    const svc = useUuiContext();

    const profileStatusDS = useLazyDataSource({ api: svc.api.demo.statuses }, []);
    const jobTitleDS = useLazyDataSource({ api: svc.api.demo.jobTitles }, []);
    const countryDS = useLazyDataSource({ api: svc.api.demo.countries }, []);
    const cityDS = useLazyDataSource({ api: svc.api.demo.cities }, []);

    const getFiltersConfig = useCallback((filter?: FilterType): TableFiltersConfig<FilterType>[] => [
        {
            field: 'profileStatusId',
            columnKey: 'profileStatus',
            title: 'Profile status',
            type: 'multiPicker',
            isAlwaysVisible: true,
            dataSource: profileStatusDS,
            predicates: defaultPredicates.multiPicker,
            showSearch: false,
            maxCount: 3,
        },
        {
            field: 'jobTitleId',
            columnKey: 'jobTitle',
            title: 'Title',
            type: 'multiPicker',
            togglerWidth: 400,
            dataSource: jobTitleDS,
        },
        {
            field: 'countryId',
            columnKey: 'countryName',
            title: 'Country',
            type: 'singlePicker',
            dataSource: countryDS,
            renderRow: (props, dataSourceState) => (
                <DataPickerRow
                    { ...props }
                    key={ props.rowKey }
                    renderItem={ (item: Country, rowProps) => (
                        <PickerItem
                            { ...rowProps }
                            title={ item.name }
                            subtitle={ item.capital }
                            dataSourceState={ dataSourceState }
                        />
                    ) }
                />
            ),
        },
        {
            field: 'cityId',
            columnKey: 'cityName',
            title: 'City',
            type: 'multiPicker',
            filter: { country: filter?.countryId },
            dataSource: cityDS,
        },
        {
            field: 'salary',
            columnKey: 'salary',
            title: 'Salary',
            type: 'numeric',
            predicates: defaultPredicates.numeric,
        },
        {
            field: 'productionCategory',
            columnKey: 'productionCategory',
            title: 'Is Production',
            type: 'custom',
            render: (props) => {
                return (
                    <FlexRow vPadding="12" padding="12">
                        <Switch label="Show only production projects" value={ props.value } onValueChange={ props.onValueChange } />
                    </FlexRow>
                );
            },
            getTogglerValue: (props) => {
                if (props.value !== undefined) {
                    return props.value ? 'Yes' : 'No';
                }
            },
        },
        {
            field: 'hireDate',
            columnKey: 'hireDate',
            title: 'Hire date',
            type: 'rangeDatePicker',
            predicates: defaultPredicates.rangeDatePicker,
            presets: {
                ...rangeDatePickerPresets,
                last3Days: {
                    name: 'Last 3 days',
                    getRange: () => {
                        return { from: dayjs().subtract(3, 'day').toString(), to: dayjs().toString(), order: 11 };
                    },
                },
                last7Days: {
                    name: 'Last 7 days',
                    getRange: () => {
                        return { from: dayjs().subtract(7, 'day').toString(), to: dayjs().toString(), order: 12 };
                    },
                },
            },
        },
        {
            field: 'hireDatePreventEmpty',
            columnKey: 'hireDate',
            title: 'Hire date prevent empty',
            type: 'rangeDatePicker',
            preventEmptyFromDate: true,
            preventEmptyToDate: true,
        },
        {
            field: 'birthDatePreventEmpty',
            columnKey: 'birthDate',
            title: 'Birth Date prevent empty',
            type: 'datePicker',
            preventEmpty: true,
        },
    ], []);

    const { tableState, setTableState } = useTableState({
        filters: getFiltersConfig(),
    });

    const dataSource = useLazyDataSource<Person, number, Person>(
        {
            api: svc.api.demo.persons,
            backgroundReload: true,
        },
        [],
    );

    const view = dataSource.useView(tableState, setTableState);

    const setTableStateWithFiltersReset = (state: DataTableState<FilterType>) => {
        const newState = state;

        // Reset city filter value if country filter was changed
        if (state.filter?.countryId !== tableState.filter?.countryId) {
            newState.filter.cityId = undefined;
        }

        setTableState(newState);
    };

    return (
        <Panel background="surface-main" shadow style={ { height: '400px' } }>
            <FlexRow padding="12" vPadding="24" rawProps={ { style: { flexWrap: 'wrap', gap: '3px' } } }>
                <FiltersPanel filters={ getFiltersConfig(tableState.filter) } tableState={ tableState } setTableState={ setTableStateWithFiltersReset } />
            </FlexRow>
            <DataTable getRows={ view.getVisibleRows } columns={ personColumns } value={ tableState } onValueChange={ setTableState } { ...view.getListProps() } />
        </Panel>
    );
}
