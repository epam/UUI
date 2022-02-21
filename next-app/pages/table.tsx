import {DataTable, FlexRow, FlexSpacer, Paginator, Panel, Text} from "@epam/promo";
import React, {useMemo, useState, useCallback} from "react";
import {
    DataColumnProps,
    useLazyDataSource,
    LazyDataSourceApiRequest,
    DataSourceState,
    useUuiContext,
} from "@epam/uui-core";
import {Person} from "@epam/uui-docs";
import {NextPageContext} from "next";
import {fetcher, UUI_API_POINT} from "../helpers/apiHelper";

interface PagedTableState extends DataSourceState<{}> {
    page?: number;
    pageSize?: number;
    totalCount?: number;
}

const TableExample = () => {
    const [state, setState] = useState<PagedTableState>({ page: 1, visibleCount: 15, totalCount: 0, pageSize: 100 });
    const svc = useUuiContext();

    const api = useCallback(async (rq: LazyDataSourceApiRequest<{}>) => {
        const result = await svc.api.demo.personsPaged({
            ...rq,
            filter: { departmentId: 13 }, // to get less results and non round-numbered number of people
            page: state.page ? state.page - 1 : 1, // server counts from 0, UI - from 1
            pageSize: state.pageSize,
        });
        setState(s => ({ ...s, totalCount: result.totalCount }));
        return result;
    }, [state.page, state.pageSize]);

    const dataSource = useLazyDataSource<Person, number, unknown>({ api }, [state.page]);

    const view = dataSource.useView(state, setState, {});

    const personsColumns: DataColumnProps<Person>[] = useMemo(() => [
        {
            key: 'name',
            caption: 'NAME',
            render: person => <Text color='gray80' font='sans-semibold'>{ person.name }</Text>,
            isSortable: true,
            grow: 1, minWidth: 224,
        },
        {
            key: 'location',
            caption: 'LOCATION',
            render: person => <Text>{ person.locationName }</Text>,
            grow: 0, shrink: 0, width: 144,
        }], []);

    return (
        <div className={ 'withGap' }>
            <h2>Demo example with table</h2>

            <Panel shadow rawProps={ {
                style: {
                    width: '100%',
                    height: 'auto',
                    maxHeight: '600px',
                    borderRadius: 0,
                },
            } }>
                <DataTable
                    { ...view.getListProps() }
                    getRows={ view.getVisibleRows }
                    value={ state }
                    onValueChange={ setState }
                    columns={ personsColumns }
                    headerTextCase='upper'
                />
                <FlexRow size='36' padding='12' background='gray5'>
                    <FlexSpacer />
                    <Paginator
                        value={ state.page || 1 }
                        onValueChange={ newPage => setState({ ...state, page: newPage }) }
                        totalPages={ state.totalCount && state.pageSize ? Math.ceil(state.totalCount / state.pageSize) : view.getVisibleRows.length }
                        size='30'
                    />
                    <FlexSpacer />
                </FlexRow>
            </Panel>
        </div>
    );
};

export default TableExample;

export async function getServerSideProps(context: NextPageContext) {
    const personsInitBody = {
        filter: {},
        range: {from: 0, count: 20},
        search: "",
    };

    const personsData = await fetcher(`${UUI_API_POINT}/persons-paged`, {
        method: 'POST',
        body: JSON.stringify(personsInitBody) });

    return {
        props: {
            personsData,
        },
    };
}