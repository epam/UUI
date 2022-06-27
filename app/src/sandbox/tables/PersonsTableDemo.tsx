import * as React from 'react';
import { FlexRow, FlexCell, SearchInput, FlexSpacer, Text, PickerInput, Button } from '@epam/loveship';
import { PersonsTable } from './PersonsTable';
import { Person, PersonGroup } from '@epam/uui-docs';
import { DataSourceState, IEditable, useArrayDataSource, useLazyDataSource, LazyDataSourceApiRequest, DataQueryFilter, LazyDataSourceApiResponse, Lens } from '@epam/uui';
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

    const lens = Lens.onEditable<DataSourceState>({ value, onValueChange });

    const groupBy = value.filter?.groupBy;

    const dataSource = useLazyDataSource<PersonTableRecord, string, PersonTableFilter>({
        // TBD: rework this, it's really scary. Probably we need a helper for such API transformation.
        api(request, ctx) {
            const { ids: clientIds, filter: requestFilter, ...rq } = request;

            const complexIds = clientIds?.map(id => JSON.parse(id));

            if (complexIds && complexIds.length > 0) {
                console.log(complexIds);
            }

            const { groupBy, ...filter } = requestFilter;

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
                return getPersons({ ...rq, filter });
            } else if (groupBy == 'location') {
                if (!ctx.parent) {
                    return svc.api.demo.locations({ range: rq.range, filter: { parentId: { isNull: true }} });
                } else if (ctx.parent.__typename === 'Location' && ctx.parent.type !== 'city') {
                    return svc.api.demo.locations({ range: rq.range, filter: { parentId: ctx.parent.id }  });
                } else {
                    return getPersons({ range: rq.range, filter: { locationId: ctx.parent.id }  });
                }
            } else if (groupBy && !ctx.parent) {
                return getPersons({
                    ...rq,
                    filter: { groupBy },
                    search: null,
                    itemsRequest: { filter, search: rq.search },
                } as any);
            } else {
                const parentFilter = ctx.parent && { [`${groupBy}Id`]: ctx.parent.id };
                return getPersons({ ...rq, filter: { ...filter, ...parentFilter } });
            }
        },
        getId: i => JSON.stringify([i.__typename, i.id]),
        getParentId: i =>
            (groupBy && i.__typename === 'Person')
            ? JSON.stringify([
                groupBy === 'Location' ? 'Location' : 'PersonGroup',
                (i as any)[`${groupBy}Id`]
            ])
            : null,
        getChildCount: item =>
            item.__typename === 'PersonGroup'
            ? item.count
            : item.__typename === 'Location' ? item.type == 'city'
                ? 1
                : 10
            : null,
        fetchStrategy: value.filter?.groupBy == 'location' ? 'sequential' : 'parallel',
    }, [groupBy]);

    const personsDataView = dataSource.useView(value, onValueChange, {
        rowOptions: { checkbox: { isVisible: true } },
        isFoldedByDefault: () => value.isFolded,
        cascadeSelection: true,
    });

    return (
        <div className={ css.container }>
            <FlexRow spacing='12' padding='24' vPadding='12' borderBottom={ true } >
                <FlexCell width={ 200 }>
                    <SearchInput { ...lens.prop('search').toProps() } size='30' />
                </FlexCell>
                <FlexCell width='auto'>
                    <Text size='30'>Group By:</Text>
                </FlexCell>
                <FlexCell width={ 130 }>
                    <PickerInput
                        { ...lens.prop('filter').prop('groupBy').toProps() }
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
                value={ value }
                onValueChange={ onValueChange }
                summary={ summary }
                view={ personsDataView }
            />
        </div>
    );
};