"use client";

import {
    DataTable,
    Panel,
    Text,
    defaultPredicates,
    FiltersPanel,
    FlexRow,
} from "@epam/promo";
import React, { useMemo } from "react";
import {
    DataColumnProps,
    useLazyDataSource,
    LazyDataSource,
    useUuiContext,
    useTableState,
    TableFiltersConfig,
} from "@epam/uui-core";
import { Person } from "@epam/uui-docs";
// import { UUI_API_POINT, fetcher } from "@shared/helpers";

const personsColumns: DataColumnProps<Person>[] = [
    {
        key: "name",
        caption: "NAME",
        render: (person) => (
            <Text color="gray80" font="sans-semibold">
                {person.name}
            </Text>
        ),
        isSortable: true,
        fix: "left",
        grow: 1,
        width: 250,
        minWidth: 224,
    },
    {
        key: "profileStatus",
        caption: "Profile Status",
        render: (person) => (
            <Text color="gray80" font="sans-semibold">
                {person.profileStatus}
            </Text>
        ),
        isSortable: true,
        width: 200,
    },
    {
        key: "city",
        caption: "City",
        render: (person) => <Text>{person.cityName}</Text>,
        width: 150,
    },
    {
        key: "country",
        caption: "Country",
        render: (person) => <Text>{person.countryName}</Text>,
        width: 150,
    },
];

const TableExample = () => {
    const svc = useUuiContext();

    const filters = useMemo((): TableFiltersConfig<Person>[] => {
        return [
            {
                field: "cityId",
                columnKey: "city",
                title: "City",
                type: "multiPicker",
                isAlwaysVisible: true,
                dataSource: new LazyDataSource({ api: svc.api.demo.cities }),
                predicates: defaultPredicates.multiPicker,
            },
            {
                field: "countryId",
                columnKey: "country",
                title: "Country",
                type: "multiPicker",
                dataSource: new LazyDataSource({ api: svc.api.demo.countries }),
                predicates: defaultPredicates.multiPicker,
            },
        ];
    }, []);

    const { tableState, setTableState } = useTableState<Person>({
        columns: personsColumns,
        filters: filters,
    });

    const dataSource = useLazyDataSource<Person, number, unknown>(
        { api: svc.api.demo.persons },
        []
    );

    const view = dataSource.useView(tableState, setTableState, {});

    return (
        <div className={"withGap"}>
            <h2>Demo example with table</h2>
            <FlexRow spacing="6">
                <FiltersPanel
                    filters={filters}
                    tableState={tableState}
                    setTableState={setTableState}
                />
            </FlexRow>
            <Panel
                shadow
                rawProps={{
                    style: {
                        width: "100%",
                        height: "auto",
                        maxHeight: "600px",
                        borderRadius: 0,
                    },
                }}
            >
                <DataTable
                    {...view.getListProps()}
                    getRows={view.getVisibleRows}
                    value={tableState}
                    filters={filters}
                    onValueChange={setTableState}
                    columns={personsColumns}
                    headerTextCase="upper"
                />
            </Panel>
        </div>
    );
};

const TableLoader = async () => {
    // await getServerSideProps();
    return <TableExample />;
};

export default TableLoader;

// async function getServerSideProps() {
//     const personsInitBody = {
//         filter: {},
//         range: { from: 0, count: 20 },
//         search: "",
//     };

//     const personsData = await fetcher(`${UUI_API_POINT}/persons`, {
//         method: "POST",
//         body: JSON.stringify(personsInitBody),
//     });

//     return {
//         props: {
//             personsData,
//         },
//     };
// }
