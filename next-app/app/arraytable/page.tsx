"use client";

import { Panel, Text, DataTable, Spinner } from "@epam/promo";
import {
    DataSourceState,
    DataColumnProps,
    useArrayDataSource,
    useUuiContext,
} from "@epam/uui-core";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Badge } from "@epam/promo";
import { AppContextType } from "../../helpers/appContext";
import { TApi } from "../../helpers/apiDefinition";

type Location = {
    name: string;
    url: string;
};

type ItemData = {
    created: string;
    episode: string[];
    gender: string;
    id: number;
    image: string;
    location: Location;
    name: string;
    origin: Location;
    species: string;
    status: string;
    type: string;
    url: string;
};

export interface PagedTableState extends DataSourceState<{}> {
    page: number;
    pageSize: number;
    totalCount: number;
}

const ArrayTable = () => {
    const { uuiApp } = useUuiContext<TApi, AppContextType>();

    const [value, onValueChange] = useState({});

    const dataSource = useArrayDataSource<ItemData, number, unknown>(
        {
            items: uuiApp.results,
        },
        []
    );

    const view = dataSource.useView(value, onValueChange, {});

    const tableColumns: DataColumnProps<ItemData>[] = useMemo(() => {
        return [
            {
                key: "id",
                caption: "Id",
                render: (item) => <Text color="gray80">{item.id}</Text>,
                isSortable: true,
                isAlwaysVisible: true,
                grow: 0,
                shrink: 0,
                width: 50,
            },
            {
                key: "image",
                caption: "Image",
                render: (item) => (
                    <Image src={item.image} width={70} height={70} alt="" />
                ),
                grow: 0,
                shrink: 0,
                width: 70,
            },
            {
                key: "name",
                caption: "Name",
                render: (item) => <Text color="gray80">{item.name}</Text>,
                isSortable: true,
                grow: 0,
                minWidth: 150,
                width: 150,
            },
            {
                key: "status",
                caption: "Status",
                render: (item) => (
                    <Badge
                        color={item.status === "Alive" ? "green" : "red"}
                        fill="semitransparent"
                        caption={item.status}
                    />
                ),
                isSortable: true,
                grow: 0,
                minWidth: 150,
                width: 150,
            },
            {
                key: "description",
                caption: "Description",
                render: (item) => <Text color="gray80">{item.species}</Text>,
                grow: 1,
                shrink: 0,
                width: 150,
            },
        ];
    }, []);

    return !Object.values(view).length ? (
        <Spinner />
    ) : (
        <div className={"withGap"}>
            <h2>Demo example with appData</h2>
            <Panel shadow>
                <DataTable
                    {...view.getListProps()}
                    getRows={view.getVisibleRows}
                    value={value}
                    onValueChange={onValueChange}
                    columns={tableColumns}
                    headerTextCase="upper"
                />
            </Panel>
        </div>
    );
};

export default ArrayTable;
