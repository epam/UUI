import * as React from 'react';
import { DbContext } from '@epam/uui-db';
import { DemoDbRef, useDemoDbRef, PersonTableRecord } from './state';
import { FlexRow, FlexCell, SearchInput, FlexSpacer, Button } from '@epam/loveship';
import * as css from './DbDemo.scss';
import { DataSourceState, useLens, IEditable, LazyDataSource, LazyDataSourceApi, DataQueryFilter } from '@epam/uui';
import { Person } from '@epam/uui-docs';
import { svc } from '../../services';
import { PersonsTable } from './PersonsTable';

export const DbDemoImpl = () => {
    const dbRef = useDemoDbRef();

    (window as any).dbRef = dbRef;

    const api: LazyDataSourceApi<PersonTableRecord, number, DataQueryFilter<Person>> = React.useMemo(() => async (rq, ctx) => {
        if (!ctx.parent) {
            return svc.api.demo.personGroups({
                ...rq,
                filter: { groupBy: 'jobTitle' },
                search: null,
                itemsRequest: { filter: rq.filter, search: rq.search }
            } as any)
        } else {
            const result = await svc.api.demo.persons({ ...rq, filter: { ...rq.filter, jobTitleId: ctx.parentId } });
            dbRef.commitFetch({ persons: result.items });
            result.items = result.items.map(i => dbRef.db.persons.byId(dbRef.idMap.serverToClient('persons', i.id)));
            return result;
        }
    }, []);

    const [ value, onValueChange ] = React.useState<DataSourceState>(() => ({
        topIndex: 0,
        visibleCount: 30,
        sorting: [{ field: 'name' }],
    }));
    const editable: IEditable<DataSourceState> = { value, onValueChange };

    dbRef.jobTitlesLoader.load({});
    dbRef.departmentsLoader.load({});

    let dataSource = React.useMemo(() => new LazyDataSource({
        api,
        getChildCount: (item: PersonTableRecord) => item.__typename === 'PersonGroup' ? item.count : null,
    }), []);

    const personsDataView = dataSource.useView(value, onValueChange, {
        getRowOptions: (p: any) => ({ checkbox: { isVisible: true } }),
        isFoldedByDefault: () => false,
    });

    return <div className={ css.container }>
        <FlexRow spacing='12' padding='24' vPadding='12' borderBottom={ true } >
            <FlexCell width={ 200 }>
                <SearchInput { ...useLens(editable, b => b.prop('search')) } size='30' />
            </FlexCell>
            <FlexSpacer />
            <FlexCell width='auto'>
                <Button caption="Reload" onClick={ () => dataSource.clearCache() } size='30'/>
            </FlexCell>
        </FlexRow>
        <PersonsTable { ...useLens(editable, b => b) } view={ personsDataView }/>
    </div>;
};

export const DbDemo = () => {
    const demoDbRef = React.useMemo(() => new DemoDbRef(), []);

    return <DbContext.Provider value={ demoDbRef }><DbDemoImpl /></DbContext.Provider>;
};