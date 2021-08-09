import { ColumnPickerFilter, FlexRow, Tag, Text } from "@epam/loveship";
import * as React from "react";
import { Person, PersonGroup } from "@epam/uui-docs";
import { DataColumnProps, DataQueryFilter, IEditable, ILens } from "@epam/uui";
import { ITableFilter } from "../../demo/table/types";
import * as css from "../../demo/table/DemoTable.scss";

export function getColumns(filters: ITableFilter[]) {
    const makeFilterRenderCallback = <TField extends keyof Person>(filterKey: TField) => {
        const filter = filters.find(f => f.id === filterKey);

        const Filter = (props: IEditable<any>) => {
            return <ColumnPickerFilter
                dataSource={ filter.dataSource }
                selectionMode={ filter.selectionMode }
                valueType="id"
                getName={ i => (i as any)?.name || "Not Specified" }
                showSearch
                { ...props }
            />;
        };

        return (filterLens: ILens<any>) => {
            const props = filterLens
                .prop(filter.id)
                .toProps();

            return <Filter { ...props } />;
        };
    };

    const personColumns = [
        {
            key: 'jobTitle',
            caption: "Title",
            render: (r: any) => <Text>{ r.jobTitle }</Text>,
            grow: 0,
            shrink: 0,
            width: 200,
            isSortable: true,
            renderFilter: makeFilterRenderCallback("jobTitleId"),
            isFilterActive: (f: any) => !!f.jobTitleId,
        },
    ];

    const groupColumns: DataColumnProps<PersonGroup, number, DataQueryFilter<Person>>[] = [
        {
            key: 'name',
            caption: "Name",
            render: p => <FlexRow><Text>{ p.name }</Text><Tag cx={ css.counter } count={ p.count }/></FlexRow>,
            grow: 1,
        },
    ];

    return {
        personColumns,
        groupColumns,
    } as any;
}