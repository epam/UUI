import * as React from 'react';
import { FlexRow, FlexCell, SearchInput, FlexSpacer, Text, PickerInput, Button } from '@epam/loveship';
import { PersonsTable } from './PersonsTable';
import { DataSourceState, useLens, IEditable, ArrayDataSource, LazyDataSource, LazyDataSourceApi } from '@epam/uui';
import { svc } from '../../services';
import * as css from './PersonsTableDemo.scss';
import { PersonTableFilter, PersonTableRecord, PersonTableRecordId } from './types';

const api: LazyDataSourceApi<PersonTableRecord, PersonTableRecordId, PersonTableFilter> = (request, ctx) => {
    let { ids: clientIds, filter: { groupBy, ...filter }, ...rq } = request;

    let ids = clientIds && clientIds.map(clientId => clientId[1]) as any[];

    if (groupBy == 'location') {
        if (!ctx.parent) {
            return svc.api.demo.locations({ range: rq.range, filter: { parentId: { isNull: true }}, ids });
        } else if (ctx.parent.__typename === 'Location' && ctx.parent.type !== 'city') {
            return svc.api.demo.locations({ range: rq.range, filter: { parentId: ctx.parent.id }, ids  });
        } else {
            return svc.api.demo.persons({ range: rq.range, filter: { locationId: ctx.parent.id }, ids  });
        }
    } else if (groupBy && !ctx.parent) {
        return svc.api.demo.personGroups({ ...rq, filter: { groupBy }, search: null, itemsRequest: { filter, search: rq.search }, ids } as any);
    } else {
        const parentFilter = ctx.parent && { [groupBy + 'Id']: ctx.parent.id };
        return svc.api.demo.persons({ ...rq, filter: { ...filter, ...parentFilter }, ids });
    }
};

interface PersonsTableState extends DataSourceState {
    isFolded?: boolean;
}

export const PersonsTableDemo = (props: {}) => {

    const groupings = React.useMemo(() => [
        { id: 'jobTitle', name: "Job Title" },
        { id: 'department', name: "Department" },
        { id: 'location', name: "Location" },
    ], []);

    const groupingDataSource = React.useMemo(() => new ArrayDataSource({ items: groupings }), []);

    const [value, onValueChange] = React.useState<PersonsTableState>(() => ({
        topIndex: 0,
        visibleCount: 100,
        sorting: [{ field: 'name' }],
        isFolded: true,
    }));

    const editable: IEditable<DataSourceState> = { value, onValueChange };

    let dataSource = React.useMemo(() => new LazyDataSource({
        api,
        getId: (i) => [i.__typename, i.id] as PersonTableRecordId,
        getChildCount: (item: PersonTableRecord) =>
            item.__typename === 'PersonGroup'
            ? item.count
            : item.__typename === 'Location' ? item.type == 'city'
                ? 1
                : 10
            : null,
    }), []);

    const personsDataView = dataSource.useView(value, onValueChange, {
        rowOptions: { checkbox: { isVisible: true } },
        isFoldedByDefault: () => value.isFolded,
        cascadeSelection: true,
    });

    return <div className={ css.container }>
        <FlexRow spacing='12' padding='24' vPadding='12' borderBottom={ true } >
            <FlexCell width={ 200 }>
                <SearchInput { ...useLens(editable, b => b.prop('search')) } size='30' />
            </FlexCell>
            <FlexCell width='auto'>
                <Text size='30'>Group By:</Text>
            </FlexCell>
            <FlexCell width={ 130 }>
                <PickerInput { ...useLens(editable, b => b.prop('filter').prop('groupBy')) } dataSource={ groupingDataSource } selectionMode='single' valueType='id' size='30' />
            </FlexCell>
            <FlexSpacer />
            <FlexCell width='auto'>
                <Button caption={ value.isFolded ? "Unfold All" : "Fold All" } onClick={ () => {
                    onValueChange({
                        ...value,
                        folded: {},
                        isFolded: !value.isFolded,
                    });
                } } size='30'/>
            </FlexCell>
            <FlexCell width='auto'>
                <Button caption="Reload" onClick={ () => dataSource.clearCache() } size='30'/>
            </FlexCell>
        </FlexRow>
        <PersonsTable { ...useLens(editable, b => b) } view={ personsDataView }/>
    </div>;
};