import React, { useCallback, useState } from "react";
import css from "./Responsive.scss";
import { PickerInput, DataTable, DataTableRow } from "@epam/loveship";
import { DataRowProps, Link, useArrayDataSource } from "@epam/uui";
import { PersonsTableState, PersonTableRecord, PersonTableRecordId } from "../../demo/table/types";
import { svc } from "../../services";
import { getColumns } from "./columns";
import { getFilters } from "./filters";

export const Responsive: React.FC = () => {
    const [pickerValue, setPickerValue] = useState(null);
    const dataSource = useArrayDataSource({
        items: [
            { "id": 2, "level": "A1" },
            { "id": 3, "level": "A1+" },
            { "id": 4, "level": "A2" },
            { "id": 5, "level": "A2+" },
            { "id": 6, "level": "B1" },
            { "id": 7, "level": "B1+" },
            { "id": 8, "level": "B2" },
            { "id": 9, "level": "B2+" },
            { "id": 10, "level": "C1" },
            { "id": 11, "level": "C1+" },
            { "id": 12, "level": "C2" },
        ],
    }, []);
    
    

    const [value, setValue] = useState<PersonsTableState>(() => {
        const filter = svc.uuiRouter.getCurrentLink().query.filter;
        const value = {
            topIndex: 0,
            visibleCount: 40,
            sorting: [{ field: 'name' }],
            filter: filter ? JSON.parse(decodeURIComponent(filter)) : undefined,
            isFolded: true,
        };
        if (!value.filter) delete value.filter;
        return value;
    });

    const onValueChange = useCallback((value: PersonsTableState) => {
        setValue(value);

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

    const columnsSet = getColumns(getFilters());

    const rowOptions: any = {
        checkbox: { isVisible: true },
        onClick: (rowProps: DataRowProps<PersonTableRecord, PersonTableRecordId>) => {
        },
    };

    const renderRow: any = (props: DataRowProps<PersonTableRecord, PersonTableRecordId>) => {
        let columns = (props.isLoading || props.value?.__typename === 'Person') ? props.columns : columnsSet.groupColumns;
        return <DataTableRow key={ props.rowKey } { ...props } size='36' columns={ columns }/>;
    };

    const personsDataView = dataSource.useView(value, setValue, {
        rowOptions,
        isFoldedByDefault: () => value.isFolded,
        cascadeSelection: true,
    });

    return (
        <div className={ css.wrapper }>
            <PickerInput
                valueType="id"
                getName={ item => item.level }
                dataSource={ dataSource }
                selectionMode="multi"
                value={ pickerValue }
                onValueChange={ setPickerValue }
            />

            <DataTable
                headerTextCase='upper'
                getRows={ personsDataView.getVisibleRows }
                columns={ columnsSet.personColumns }
                renderRow={ renderRow }
                selectAll={ { value: false, isDisabled: true, onValueChange: null } }
                showColumnsConfig
                value={ value }
                onValueChange={ onValueChange }
                allowColumnsResizing={ true }
                { ...personsDataView.getListProps() }
            />
        </div>
    );
};