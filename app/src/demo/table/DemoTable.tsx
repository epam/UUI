import React, { useCallback, useMemo, useState } from "react";
import css from './DemoTable.scss';
import { LazyDataSource, DataRowProps, DataRowOptions, cx, Link } from '@epam/uui';
import { Person, PersonGroup } from '@epam/uui-docs';
import { FlexRow, DataTable, DataTableRow, IconButton } from '@epam/promo';
import filterIcon from "@epam/assets/icons/common/content-filter_list-24.svg";

import { svc } from "../../services";
import { getFilters, presets, api } from "./data";
import { getColumns } from "./columns";
import { PersonsTableState, PersonTableRecord, PersonTableRecordId } from './types';
import { FilterPanel } from "./FilterPanel";
import { Presets } from "./Presets";
import { InfoSidebarPanel } from './InfoSidebarPanel';

export const DemoTable: React.FC = () => {
    const [value, setValue] = useState<PersonsTableState>(() => {
        const filter = svc.uuiRouter.getCurrentLink().query.filter;
        const value = {
            topIndex: 0,
            visibleCount: 100,
            sorting: [{ field: 'name' }],
            filter: filter ? JSON.parse(decodeURIComponent(filter)) : undefined,
            isFolded: true,
        };
        if (!value.filter) delete value.filter;
        return value;
    });

    const onValueChange = useCallback((value: PersonsTableState) => {
        setValue(value);
        console.log(value.filter);

        const newQuery = {
            ...svc.uuiRouter.getCurrentLink().query,
            filter: encodeURIComponent(JSON.stringify(value.filter)),
        };

        const newLink: Link = {
            pathname: location.pathname,
            query: newQuery,
        };
        svc.history.push(newLink);
    }, []);

    const [isFilterPanelOpened, setIsFilterPanelOpened] = useState<boolean>(false);
    const [filterPanelStyleModifier, setFilterPanelStyleModifier] = useState<'show' | 'hide'>('hide');
    const [isFilterButtonVisible, setIsFilterButtonVisible] = useState<boolean>(true);
    
    const openFilterPanel = useCallback(() => {
        setIsFilterPanelOpened(true);
        setIsFilterButtonVisible(false);
        setFilterPanelStyleModifier('show');
    }, []);
    
    const closeFilterPanel = useCallback(() => {
        Promise.resolve()
            .then(() => setFilterPanelStyleModifier('hide'))
            .then(() => setIsFilterButtonVisible(true))
            .then(() => {
                setTimeout(() => setIsFilterPanelOpened(false), 500);
            });
    }, []);

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

    const [filters] = useState(getFilters());
    const [columnsSet] = useState(getColumns(filters, openInfoPanel));

    const dataSource = useMemo(() => new LazyDataSource({
        api,
        getId: (i) => [i.__typename, i.id] as PersonTableRecordId,
        getChildCount: (item: PersonTableRecord) =>
            item.__typename === 'PersonGroup' ? item.count : null,
    }), []);

    const rowOptions: DataRowOptions<PersonTableRecord, PersonTableRecordId> = {
        checkbox: { isVisible: true },
        onClick: (rowProps: DataRowProps<PersonTableRecord, PersonTableRecordId>) => {
            if (infoPanelId === rowProps.id[1]) {
                closeInfoPanel();
            }
            openInfoPanel(rowProps.id[1]);
        },
    };

    const renderRow = (props: DataRowProps<PersonTableRecord, PersonTableRecordId>) => {
        let columns = (props.isLoading || props.value?.__typename === 'Person') ? props.columns : columnsSet.groupColumns;
        return <DataTableRow key={ props.rowKey } { ...props } size='36' columns={ columns }/>;
    };

    const personsDataView = dataSource.useView(value, setValue, {
        rowOptions,
        isFoldedByDefault: () => value.isFolded,
        cascadeSelection: true,
    });

    const renderInfoSidebarPanel = () => {
        const data = dataSource.getById(['Person', infoPanelId]) as Person;
        return <InfoSidebarPanel data={ data } onClose={ closeInfoPanel }/>;
    };

    return (
        <FlexRow cx={ css.wrapper } alignItems="top">
            { isFilterPanelOpened && (
                <div className={ cx(css.filterSidebarPanelWrapper, filterPanelStyleModifier) }>
                    <FilterPanel
                        filters={ filters }
                        close={ closeFilterPanel }
                        value={ value }
                        onValueChange={ onValueChange }
                    />
                </div>
            ) }
            <div className={ css.container }>
                <FlexRow background='white' borderBottom>
                    { isFilterButtonVisible && (
                        <div className={ css.iconContainer }>
                            <IconButton icon={ filterIcon } color="gray50" cx={ [css.icon] } onClick={ openFilterPanel }/>
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
                    value={ value }
                    onValueChange={ onValueChange }
                    { ...personsDataView.getListProps() }
                />
            </div>
            { infoPanelId && (
                <div className={ cx(css.infoSidebarPanelWrapper, isInfoPanelOpened ? 'show' : 'hide') }>
                    { renderInfoSidebarPanel() }
                </div>
            ) }
        </FlexRow>
    );
};