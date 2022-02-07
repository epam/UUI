import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Text,
    DataTable,
    Panel,
    FlexRow,
    DataTableRow, FlexCell,
} from '@epam/promo';
import {
    DataSourceState,
    DataColumnProps,
    useUuiContext,
    useLazyDataSource,
    DataRowProps, LazyDataSourceApiRequest,
} from '@epam/uui';
import { City, Country } from '@epam/uui-docs';
import * as css from "./TablesExamples.scss";
import { Button } from "@epam/loveship";

interface ICitiesTableState extends DataSourceState {
    isFolded?: boolean;
}

export default function CitiesTable(props: unknown) {
    const svc = useUuiContext();
    const [tableState, setTableState] = useState<ICitiesTableState>({ isFolded: true });

    // Define columns config array
    const citiesColumns: DataColumnProps<City, string>[] = useMemo(() => [
        {
            key: 'id',
            caption: 'ID',
            render: city => <Text color='gray80' fontSize='14'>{ city.id }</Text>,
            isSortable: true,
            grow: 0, shrink: 0, width: 200, fix: 'left',
        },
        {
            key: 'name',
            caption: 'NAME',
            render: city => <Text color='gray80' fontSize='14'>{ city.name }</Text>,
            isSortable: true,
            grow: 2, shrink: 0, width: 162,
        },
        {
            key: 'countryName',
            caption: 'COUNTRY',
            render: city => <Text color='gray80' fontSize='14'>{ city.countryName }</Text>,
            isSortable: true,
            grow: 1, shrink: 0, width: 128,
        },
    ], []);

    const api = useCallback((request: LazyDataSourceApiRequest<City | Country, string>, ctx) => {
        if (ctx.parentId) {
            return svc.api.demo.countries({ ...request, filter: {id: ctx.parent.country }}).then((res: any) => {
                // NOTE: This updatedItems is needed here because extraBlock row's id should be uniq.
                const updatedItems = res.items.map((item: any) => ({...item, id: `${item.id}_${ctx.parentId}`}));
                return { ...res, items: updatedItems };
            });
        }
        return svc.api.demo.cities(request);
    }, []);

    // Create DataSource instance for your table.
    // For more details go to the DataSources example
    const citiesDS = useLazyDataSource<City, string, unknown>({ api }, []);

    // IMPORTANT! Unsubscribe view from DataSource when you don't need it more.
    // Pass this.handleTableStateChange function which you provided to getView as a second argument
    useEffect(() => {
        return () => citiesDS.unsubscribeView(setTableState);
    }, []);

    // Create View according to your tableState and options
    const view = citiesDS.useView(tableState, setTableState, {
        getRowOptions: useCallback(item => ({
            checkbox: { isVisible: true },
        }), []),
        getChildCount: (item) => {
            if (item.id.includes("_")) {
                return 0;
            }
            return 1;
        },
        isFoldedByDefault: () => tableState.isFolded,
    });

    const renderRow = (rowProps: DataRowProps<City & Country & { key: string }, string>) => {
        const isDataLoaded = rowProps.isLoading !== true;
        const isExtraBlock = rowProps.depth === 1;

        const extraBlock = () => (
            <FlexRow background={ "gray5" } borderBottom={ "gray40" } padding={ "24" } vPadding={ "24" } alignItems={ 'top' }>
                <FlexCell grow={ 1 }>
                    <Text font={ 'sans-semibold' }>Country Info:</Text>
                    <Text size={ 'none' }>Name: { rowProps.value.name }</Text>
                    <Text size={ 'none' }>Continent: { rowProps.value.continent }</Text>
                </FlexCell>
                <FlexCell grow={ 1 }>
                    <Text font={ 'sans-semibold' }>Contacts</Text>
                    <Text size={ 'none' }>Name: { rowProps.value.phone }</Text>
                </FlexCell>
                <FlexCell grow={ 1 }>
                    <Text font={ 'sans-semibold' }>Capital</Text>
                    <Text>{ rowProps.value.capital }</Text>
                </FlexCell>
                <FlexCell grow={ 1 }>
                    <Text font={ 'sans-semibold' }>Currency</Text>
                    <Text size={ 'none' }>{ rowProps.value.currency }</Text>
                </FlexCell>
                <FlexCell grow={ 1 }>
                    <Text font={ 'sans-semibold' }>Languages</Text>
                    {
                        (rowProps.value.languages || []).map((lang, index) => (
                                <Text key={ lang } size={ 'none' }>
                                    { lang }
                                </Text>
                            ),
                        )
                    }
                </FlexCell>
            </FlexRow>
        );

        const mainRow = () => (
            <>
                <DataTableRow
                    { ...rowProps }
                    isFoldable={ isDataLoaded }
                />
            </>
        );

        return (
            <Panel>
                { !isExtraBlock || !rowProps.value ? mainRow() : extraBlock() }
            </Panel>
        );
    };

    return (
            <Panel shadow cx={ css.container }>
                <FlexCell width='auto'>
                    <Button
                        caption={ tableState.isFolded ? "Unfold All" : "Fold All" }
                        onClick={ () => setTableState({ ...tableState, folded: {}, isFolded: !tableState.isFolded }) }
                        size='30'
                    />
                </FlexCell>
                <DataTable
                    value={ tableState }
                    onValueChange={ setTableState }
                    { ...view.getListProps() }
                    getRows={ view.getVisibleRows }
                    showColumnsConfig={ true }
                    headerTextCase='upper'
                    columns={ citiesColumns }
                    { ...props }
                    renderRow={ renderRow }
                />
            </Panel>
    );
}
