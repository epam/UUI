import * as React from 'react';
import { FlexRow, FlexCell, SearchInput, FlexSpacer, Text, PickerInput, Button } from '@epam/loveship';
import { PersonsTable } from './PersonsTable';
import { Person, PersonGroup } from '@epam/uui-docs';
import { DataSourceState, useLens, IEditable, useArrayDataSource, useLazyDataSource, LazyDataSourceApiRequest, DataQueryFilter, LazyDataSourceApiResponse } from '@epam/uui';
import { PersonTableFilter, PersonTableRecord, PersonTableRecordId } from './types';
import { svc } from '../../services';
import * as css from './PersonsTableDemo.scss';

interface PersonsTableState extends DataSourceState {
    isFolded?: boolean;
}

interface PersonsApiResponse extends LazyDataSourceApiResponse<Person | PersonGroup> {
    summary: PersonsSummary;
    totalCount: number;
}

export interface PersonsSummary extends Pick<PersonsApiResponse, 'totalCount'> {
    totalSalary: string;
}


const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 1,
        currency: 'USD',
        style: 'currency',
    }).format(value);
};

export const PersonsTableDemo = () => {
    const [summary, setSummary] = React.useState<PersonsSummary & Pick<PersonsApiResponse, 'totalCount'>>({
        totalCount: undefined,
        totalSalary: '',
    });

    const groupings = React.useMemo(() => [
        { id: 'jobTitle', name: "Job Title" },
        { id: 'department', name: "Department" },
        { id: 'location', name: "Location" },
    ], []);

    const groupingDataSource = useArrayDataSource({
        items: groupings,
    }, []);

    const [value, onValueChange] = React.useState<PersonsTableState>(() => ({
        topIndex: 0,
        visibleCount: 100,
        sorting: [{ field: 'name' }],
        isFolded: true,
    }));

    const editable: IEditable<DataSourceState> = { value, onValueChange };

    const dataSource = useLazyDataSource<PersonTableRecord, PersonTableRecordId, PersonTableFilter>({
        api(request, ctx) {
            const { ids: clientIds, filter: { groupBy, ...filter }, ...rq } = request;
            const ids = clientIds?.map(clientId => typeof clientId === 'number' && clientId[1]);

            const updateSummary = (response: PersonsApiResponse) => {
                const { summary, totalCount } = response;
                const totalSalary = formatCurrency(Number(summary.totalSalary));
                setSummary({ totalCount, totalSalary });
            };

            const getPersons = (rq: LazyDataSourceApiRequest<Person, number, DataQueryFilter<Person>>) => {
                if (groupBy && !ctx.parent) {
                    return svc.api.demo.personGroups({
                        ...rq,
                        filter: { groupBy },
                        search: null,
                        itemsRequest: { filter, search: rq.search },
                        ids,
                    } as any).then(res => {
                        updateSummary(res as PersonsApiResponse);
                        return res;
                    });
                } else {
                    return svc.api.demo.persons(rq).then(res => {
                        updateSummary(res as PersonsApiResponse);
                        return res;
                    });
                }
            };

            if (request.search) {
                return getPersons({ ...rq, filter, ids });
            } else if (groupBy == 'location') {
                if (!ctx.parent) {
                    return svc.api.demo.locations({ range: rq.range, filter: { parentId: { isNull: true }}, ids });
                } else if (ctx.parent.__typename === 'Location' && ctx.parent.type !== 'city') {
                    return svc.api.demo.locations({ range: rq.range, filter: { parentId: ctx.parent.id }, ids  });
                } else {
                    return getPersons({ range: rq.range, filter: { locationId: ctx.parent.id }, ids  });
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
                return getPersons({ ...rq, ids, filter: { ...filter, ...parentFilter } });
            }
        },
        getId: i => [i.__typename, i.id],
        getChildCount: item =>
            item.__typename === 'PersonGroup'
            ? item.count
            : item.__typename === 'Location' ? item.type == 'city'
                ? 1
                : 10
            : null,
        fetchStrategy: value.filter?.groupBy == 'location' ? 'sequential' : 'parallel',
    }, [value.filter?.groupBy]);

    const personsDataView = dataSource.useView(value, onValueChange, {
        rowOptions: { checkbox: { isVisible: true } },
        isFoldedByDefault: () => value.isFolded,
        cascadeSelection: true,
    });

    return (
        <div className={ css.container }>
            <FlexRow spacing='12' padding='24' vPadding='12' borderBottom={ true } >
                <FlexCell width={ 200 }>
                    <SearchInput { ...useLens(editable, b => b.prop('search')) } size='30' />
                </FlexCell>
                <FlexCell width='auto'>
                    <Text size='30'>Group By:</Text>
                </FlexCell>
                <FlexCell width={ 130 }>
                    <PickerInput
                        { ...useLens(editable, b => b.prop('filter').prop('groupBy')) }
                        dataSource={ groupingDataSource }
                        selectionMode='single'
                        valueType='id'
                        size='30'
                    />
                </FlexCell>
                <FlexSpacer />
                <FlexCell width='auto'>
                    <Button
                        caption={ value.isFolded ? "Unfold All" : "Fold All" }
                        onClick={ () => onValueChange({ ...value, folded: {}, isFolded: !value.isFolded }) }
                        size='30'
                    />
                </FlexCell>
                <FlexCell width='auto'>
                    <Button caption="Reload" onClick={ () => dataSource.clearCache() } size='30'/>
                </FlexCell>
            </FlexRow>
            <PersonsTable
                showColumnsConfig
                summary={ summary }
                { ...useLens(editable, b => b) }
                view={ personsDataView }
            />
        </div>
    );
};