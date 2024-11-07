import * as React from 'react';
import { FlexRow, FlexCell, FlexSpacer, Text, PickerInput, Button, SearchInput, DataTable, DataTableRow } from '@epam/loveship';
import { Person } from '@epam/uui-docs';
import { DataSourceState, useArrayDataSource, LazyDataSourceApiRequest, LazyDataSourceApiResponse, Lens, DataColumnProps, LazyDataSourceApi, useTree, useDataRows } from '@epam/uui-core';
import { PersonTableFilter, PersonTableRecord, PersonTableRecordId, PersonTableRecordType, PersonsApiResponse, PersonsSummary, PersonsTableState } from './types';
import { svc } from '../../services';
import { getColumns } from './columns';
import { getFilters } from './filters';
import cx from 'classnames';
import css from './PersonsTableDemo.module.scss';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 1,
        currency: 'USD',
        style: 'currency',
    }).format(value);
};

export function PersonsTableDemo() {
    const { personColumns, summaryColumns, personColumnsGroups } = React.useMemo(() => getColumns(), []);

    const [summary, setSummary] = React.useState<PersonsSummary & Pick<PersonsApiResponse, 'totalCount'>>({
        totalCount: undefined,
        totalSalary: '',
    });

    const groupings = React.useMemo(
        () => [
            { id: 'jobTitle', name: 'Job Title' }, { id: 'department', name: 'Department' }, { id: 'location', name: 'Location' },
        ],
        [],
    );

    const groupingDataSource = useArrayDataSource(
        {
            items: groupings,
        },
        [],
    );

    const [value, onValueChange] = React.useState<PersonsTableState & { filter?: PersonTableFilter }>(() => ({
        topIndex: 0,
        visibleCount: 100,
        sorting: [{ field: 'name' }],
        isFolded: true,
    }));

    const lens = Lens.onEditable<DataSourceState>({ value, onValueChange });

    const api: LazyDataSourceApi<PersonTableRecord, PersonTableRecordId, PersonTableFilter> = async (request, ctx) => {
        const { ids, filter: requestFilter, ...rq } = request;

        if (ids != null) {
            const idsByType: Record<PersonTableRecordType, (string | number)[]> = {} as any;
            ids.forEach(([type, id]) => {
                idsByType[type] = idsByType[type] || [];
                idsByType[type].push(id);
            });

            const typesToLoad = Object.keys(idsByType) as PersonTableRecordType[];
            const response: LazyDataSourceApiResponse<PersonTableRecord> = { items: [] };

            const promises = typesToLoad.map(async (type) => {
                const idsRequest: LazyDataSourceApiRequest<any, any> = { ids: idsByType[type] };
                const apiRequest = type === 'Person' ? svc.api.demo.persons : type === 'PersonEmploymentGroup' ? svc.api.demo.personGroups : type === 'Location' ? svc.api.demo.locations : null;

                const apiResponse = await apiRequest(idsRequest);
                response.items = [...response.items, ...apiResponse.items];
            });

            await Promise.all(promises);
            return response;
        }

        const { groupBy, ...filter } = (requestFilter as PersonTableFilter) || {};

        const updateSummary = (response: PersonsApiResponse) => {
            const { summary: summaryRes, totalCount } = response;
            const totalSalary = formatCurrency(Number(summaryRes.totalSalary));
            setSummary({ totalCount, totalSalary });
        };

        const getPersons = async (personRequest: LazyDataSourceApiRequest<Person, number>) => {
            if (groupBy && !ctx.parent) {
                const personGroupsResponse = await svc.api.demo.personGroups({
                    ...personRequest,
                    filter: { groupBy },
                    search: null,
                    itemsRequest: { filter, search: personRequest.search },
                    ids,
                } as any);
                updateSummary(personGroupsResponse as PersonsApiResponse);
                return personGroupsResponse;
            } else {
                const personsResponse = await svc.api.demo.persons(personRequest);
                updateSummary(personsResponse as PersonsApiResponse);
                return personsResponse;
            }
        };

        if (request.search) {
            return getPersons({ ...rq, filter });
        } else if (groupBy === 'location') {
            if (!ctx.parent) {
                return svc.api.demo.locations({ range: rq.range, filter: { parentId: { isNull: true } } });
            } else if (ctx.parent.__typename === 'Location' && ctx.parent.type !== 'city') {
                return svc.api.demo.locations({ range: rq.range, filter: { parentId: ctx.parent.id } });
            } else {
                return getPersons({ range: rq.range, filter: { locationId: ctx.parent.id } });
            }
        } else if (groupBy && !ctx.parent) {
            return getPersons({
                ...rq,
                filter: { groupBy },
                search: null,
                itemsRequest: { filter, search: rq.search },
                ids,
            } as any);
        } else {
            const parentFilter = ctx.parent && { [`${groupBy}Id`]: ctx.parent.id };
            return getPersons({ ...rq, filter: { ...filter, ...parentFilter } });
        }
    };

    const tree = useTree<PersonTableRecord, PersonTableRecordId, PersonTableFilter>(
        {
            type: 'lazy',
            dataSourceState: value,
            setDataSourceState: onValueChange,
            api,
            getId: (i) => [i.__typename, i.id],
            complexIds: true,
            getParentId: (i) => {
                const groupBy = value.filter?.groupBy;
                if (i.__typename === 'PersonEmploymentGroup') {
                    return null;
                } else if (i.__typename === 'Location') {
                    return i.parentId ? ['Location', i.parentId] : undefined;
                } else if (i.__typename === 'Person') {
                    if (groupBy === 'location') {
                        return ['Location', i.locationId];
                    } else if (groupBy === 'jobTitle') {
                        return ['PersonEmploymentGroup', i.jobTitleId];
                    } else if (groupBy === 'department') {
                        return ['PersonEmploymentGroup', i.departmentId];
                    } else {
                        return undefined;
                    }
                }

                throw new Error('PersonTableDemo: unknown typename/groupBy combination');
            },
            getChildCount: (item) => (item.__typename === 'PersonEmploymentGroup' ? item.count : item.__typename === 'Location' ? (item.type === 'city' ? 1 : 10) : null),
            fetchStrategy: value.filter?.groupBy === 'location' ? 'sequential' : 'parallel',
            rowOptions: { checkbox: { isVisible: true } },
            isFoldedByDefault: () => value.isFolded,
            cascadeSelection: true,
            backgroundReload: true,
        },
        [value.filter?.groupBy],
    );
    const { rows, listProps } = useDataRows(tree);

    return (
        <div className={ cx(css.container, css.uuiThemeLoveship) }>
            <FlexRow spacing="12" padding="24" vPadding="12" borderBottom={ true }>
                <FlexCell width={ 200 }>
                    <SearchInput { ...lens.prop('search').toProps() } size="30" />
                </FlexCell>
                <FlexCell width="auto">
                    <Text size="30">Group By:</Text>
                </FlexCell>
                <FlexCell width={ 130 }>
                    <PickerInput { ...lens.prop('filter').prop('groupBy').toProps() } dataSource={ groupingDataSource } selectionMode="single" valueType="id" size="30" />
                </FlexCell>
                <FlexSpacer />
                <FlexCell width="auto">
                    <Button
                        caption={ value.isFolded ? 'Unfold All' : 'Fold All' }
                        onClick={ () => onValueChange({ ...value, folded: {}, isFolded: !value.isFolded }) }
                        size="30"
                    />
                </FlexCell>
                <FlexCell width="auto">
                    <Button caption="Reload" onClick={ () => tree.reload() } size="30" />
                </FlexCell>
            </FlexRow>
            <DataTable
                rows={ rows }
                columns={ personColumns as DataColumnProps<PersonTableRecord, PersonTableRecordId, any>[] }
                columnGroups={ personColumnsGroups }
                value={ value }
                onValueChange={ onValueChange }
                filters={ getFilters() }
                { ...listProps }
            />
            <DataTableRow columns={ summaryColumns } cx={ css.stickyFooter } id="footer" rowKey="footer" index={ 100500 } value={ summary } />
        </div>
    );
}
