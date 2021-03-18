import React, { useCallback, useMemo, useState } from "react";
import css from './DemoTable.scss';
import { LazyDataSource, DataRowProps, DataRowOptions } from '@epam/uui';
import { Person, PersonGroup } from '@epam/uui-docs';
import { FlexRow, DataTable, DataTableRow, IconButton } from '@epam/promo';
import filterIcon from "@epam/assets/icons/common/content-filter_list-24.svg";

import { getFilters, presets, api } from "./data";
import { getColumns } from "./columns";
import { PersonsTableState, PersonTableRecord, PersonTableRecordId } from './types';
import { Panel } from "./Panel";
import { Presets } from "./Presets";

export const DemoTable: React.FC = () => {
    const [value, setValue] = useState<PersonsTableState>(() => ({
        topIndex: 0,
        visibleCount: 100,
        sorting: [{ field: 'name' }],
        isFolded: true,
    }));
    const [activeRowId, setActiveRowId] = useState<Person["uid"] | null>(null);
    const [filters] = useState(getFilters());
    const [columnsSet] = useState(getColumns(filters, setActiveRowId));

    const [isPanelOpened, setIsPanelOpened] = useState(false);
    const openPanel = useCallback(() => setIsPanelOpened(true), []);
    const closePanel = useCallback(() => setIsPanelOpened(false), []);

    let dataSource = useMemo(() => new LazyDataSource({
        api,
        getId: (i) => [i.__typename, i.id] as PersonTableRecordId,
        getChildCount: (item: PersonTableRecord) =>
            item.__typename === 'PersonGroup' ? item.count : null,
    }), []);

    const rowOptions: DataRowOptions<PersonTableRecord, PersonTableRecordId> = {
        checkbox: { isVisible: true },
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

    return (
        <FlexRow alignItems="top">
            { isPanelOpened && (
                <Panel
                    filters={ filters }
                    close={ closePanel }
                    value={ value }
                    onValueChange={ setValue }
                />
            ) }

            <div className={ css.container }>
                <FlexRow background="white" borderBottom>
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
                    value={ value }
                    onValueChange={ setValue }
                    { ...personsDataView.getListProps() }
                />
            </div>
        </FlexRow>
    );
};