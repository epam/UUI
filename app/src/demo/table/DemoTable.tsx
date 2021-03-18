import React, { useCallback, useState } from "react";
import css from './DemoTable.scss';
import { DataSourceState, useLens, IEditable, LazyDataSource, DataRowProps, LazyDataSourceApi, DataRowOptions, cx } from '@epam/uui';
import { Person, PersonGroup } from '@epam/uui-docs';
import { FlexRow, DataTable, DataTableRow, IconButton } from '@epam/promo';
import filterIcon from "@epam/assets/icons/common/content-filter_list-24.svg";
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { svc } from '../../services';
import { filters, presets } from "./data";
import { PersonTableFilter, PersonTableRecord, PersonTableRecordId } from './types';
import { getColumns } from './columns';
import { Panel } from "./Panel";
import { Presets } from "./Presets";
import { SidebarPanel } from "./SidebarPanel";

export const api: LazyDataSourceApi<PersonTableRecord, PersonTableRecordId, PersonTableFilter> = (request, ctx) => {
    let { ids: clientIds, filter: { groupBy, ...filter }, ...rq } = request;

    let ids = clientIds && clientIds.map(clientId => clientId[1]) as any[];

    if (groupBy && !ctx.parent) {
        return svc.api.demo.personGroups({
            ...rq,
            filter: { groupBy },
            search: null,
            itemsRequest: { filter, search: rq.search },
            ids,
        } as any);
    } else {
        const parentFilter = ctx.parent && { [groupBy + 'Id']: ctx.parent.id };
        return svc.api.demo.persons({ ...rq, filter: { ...filter, ...parentFilter }, ids });
    }
};

interface PersonsTableState extends DataSourceState {
    isFolded?: boolean;
}

export const DemoTable: React.FC = () => {
    const [value, onValueChange] = React.useState<PersonsTableState>(() => ({
        topIndex: 0,
        visibleCount: 100,
        sorting: [{ field: 'name' }],
        isFolded: true,
    }));
    const [infoPanelId, setInfoPanelId] = useState<number | null>(null);
    const [isInfoPanelOpened, setInfoPanelOpened] = useState<boolean>(false);

    const openInfoPanel = useCallback((id) => {
        setInfoPanelId(id);
        setInfoPanelOpened(true);
    }, []);

    const closeInfoPanel = useCallback(() => {
        Promise.resolve(false)
            .then(value => setInfoPanelOpened(value))
            .then(() => {
                setTimeout(() => setInfoPanelId(null), 500);
            });
    }, []);

    const [isPanelOpened, setIsPanelOpened] = useState<boolean>(false);
    const openPanel = useCallback(() => setIsPanelOpened(true), []);
    const closePanel = useCallback(() => setIsPanelOpened(false), []);

    const editable: IEditable<DataSourceState> = { value, onValueChange };

    let dataSource = React.useMemo(() => new LazyDataSource({
        api,
        getId: (i) => [i.__typename, i.id] as PersonTableRecordId,
        getChildCount: (item: PersonTableRecord) =>
            item.__typename === 'PersonGroup' ? item.count : null,
    }), []);

    const rowOptions: DataRowOptions<PersonTableRecord, PersonTableRecordId> = {
        checkbox: { isVisible: true },
    };

    const tableLens = useLens(useLens(editable, b => b), b => b.onChange((o, n) => ({ ...n, topIndex: 0 })));

    const columnsSet = React.useMemo(() => getColumns(filters, openInfoPanel), []);

    const renderRow = (props: DataRowProps<PersonTableRecord, PersonTableRecordId>) => {
        let columns = (props.isLoading || props.value?.__typename === 'Person') ? props.columns : columnsSet.groupColumns;
        return <DataTableRow key={ props.rowKey } { ...props } size='36' columns={ columns }/>;
    };

    const personsDataView = dataSource.useView(value, onValueChange, {
        rowOptions,
        isFoldedByDefault: () => value.isFolded,
        cascadeSelection: true,
    });

    const renderActiveRowDataSidebarPanel = () => {
        const data = dataSource.getById(['Person', infoPanelId]) as Person;
        return <SidebarPanel cxSb={ 'right-sidebar' } data={ data } onClose={ closeInfoPanel } />;
    };

    return (
        <FlexRow alignItems="top">
            <TransitionGroup className={ css.wrapper } >
                { isPanelOpened &&
                    <CSSTransition classNames={ 'left-sidebar' } timeout={ 500 }>
                        <Panel filters={ filters } close={ closePanel }/>
                    </CSSTransition>
                }
                {/*<div className={ cx(css.filterSidebarPanelWrapper, isPanelOpened ? 'show' : 'hide') }>*/}
                {/*    <Panel filters={ filters } close={ closePanel }/>*/}
                {/*</div>*/}
                <div className={ css.container }>
                    <FlexRow background='white' borderBottom >
                        { !isPanelOpened && (
                            <div className={ css.iconContainer }>
                                <IconButton icon={ filterIcon } color="gray50" cx={ [css.icon] } onClick={ openPanel }/>
                            </div>
                        ) }
                        <Presets presets={ presets }/>
                    </FlexRow>
                    <DataTable
                        headerTextCase='upper'
                        getRows={ () => personsDataView.getVisibleRows() }
                        columns={ columnsSet.personColumns }
                        renderRow={ renderRow }
                        selectAll={ { value: false, isDisabled: true, onValueChange: null } }
                        showColumnsConfig
                        { ...tableLens }
                        { ...personsDataView.getListProps() }
                    />
                </div>
                {/*{ isInfoPanelOpened &&*/}
                {/*    <CSSTransition classNames={ 'right-sidebar' } timeout={ 500 }>*/}
                {/*        { infoPanelId && renderActiveRowDataSidebarPanel() }*/}
                {/*    </CSSTransition>*/}
                {/*}*/}
                <div className={ cx(css.infoSidebarPanelWrapper, isInfoPanelOpened ? 'show' : 'hide') }>
                    { infoPanelId && renderActiveRowDataSidebarPanel() }
                </div>
            </TransitionGroup>
        </FlexRow>
    );
};