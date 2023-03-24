import * as React from 'react';
import { DataSourceState, LazyDataSource, LazyDataSourceApi, DataQueryFilter, Lens } from '@epam/uui-core';
import { DbContext } from '@epam/uui-db';
import { Person } from '@epam/uui-docs';
import { FlexRow, FlexCell, FlexSpacer, Button, SuccessNotification, ErrorNotification, Text, SearchInput } from '@epam/loveship';
import { DemoDbRef, useDemoDbRef, PersonTableRecord } from './state';
import { svc } from '../../services';
import { PersonsTable } from './PersonsTable';
import css from './DbDemo.scss';

export const DbDemoImpl = () => {
    const dbRef = useDemoDbRef();

    (window as any).dbRef = dbRef;
    dbRef.setAutoSave(false);

    const handleSave = () => {
        dbRef.save()
            .then((patch) => {
                svc.uuiNotifications.show((props) =>
                    <SuccessNotification { ...props } >
                        <Text size="24" font='sans' fontSize='14'>Data has been saved! See console for details.</Text>
                    </SuccessNotification>, { duration: 2 }
                );
            })
            .catch((e) => {
                svc.uuiNotifications.show((props) =>
                    <ErrorNotification { ...props } >
                        <Text size="24" font='sans' fontSize='14'>Error saving data</Text>
                    </ErrorNotification>, { duration: 2 }
                );
            })
    }

    const api: LazyDataSourceApi<PersonTableRecord, number, DataQueryFilter<Person>> = React.useMemo(() => async (rq, ctx) => {
        if (!ctx.parent) {
            return svc.api.demo.personGroups({
                ...rq,
                filter: { groupBy: 'jobTitle' },
                search: null,
                itemsRequest: { filter: rq.filter, search: rq.search },
            } as any);
        } else {
            const result = await svc.api.demo.persons({ ...rq, filter: { ...rq.filter, jobTitleId: ctx.parentId } });
            dbRef.commitFetch({ persons: result.items });
            result.items = result.items.map(i => dbRef.db.persons.byId(dbRef.idMap.serverToClient('persons', i.id)));
            return result;
        }
    }, []);

    const [value, onValueChange] = React.useState<DataSourceState>(() => ({
        topIndex: 0,
        visibleCount: 30,
        sorting: [{ field: 'name' }],
    }));

    const lens = Lens.onEditable<DataSourceState>({ value, onValueChange });

    dbRef.jobTitlesLoader.load({});
    dbRef.departmentsLoader.load({});

    let dataSource = React.useMemo(() => new LazyDataSource({
        api,
        getChildCount: (item: PersonTableRecord) => item.__typename === 'PersonGroup' ? item.count : null,
    }), []);

    const personsDataView = dataSource.useView(value, onValueChange, {
        getRowOptions: p => ({ checkbox: { isVisible: true } }),
        isFoldedByDefault: () => false,
    });

    return <div className={ css.container }>
        <FlexRow spacing='12' padding='24' vPadding='12' borderBottom={ true } >
            <FlexCell width={ 200 }>
                <SearchInput { ...lens.prop('search').toProps() } size='30' />
            </FlexCell>
            <FlexSpacer />
            <FlexCell width='auto'>
                <Button caption="Save" onClick={ handleSave } size='30'/>
            </FlexCell>
            <FlexCell width='auto'>
                <Button caption="Revert" onClick={ () => dbRef.revert() } size='30'/>
            </FlexCell>
            <FlexCell width='auto'>
                <Button caption="Reload" onClick={ () => dataSource.clearCache() } size='30'/>
            </FlexCell>
        </FlexRow>
        <PersonsTable { ...lens.toProps() } view={ personsDataView }/>
    </div>;
};

export const DbDemo = () => {
    const demoDbRef = React.useMemo(() => new DemoDbRef(), []);

    return <DbContext.Provider value={ demoDbRef }><DbDemoImpl /></DbContext.Provider>;
};
