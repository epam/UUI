import { DataColumnProps, DataTableState, SortingOption, useArrayDataSource, useTableState } from '@epam/uui-core';
import { TTypeProp } from '../types';
import { Code } from '../../../common/docs/Code';
import { TsComment } from './components/TsComment';
import { Ref } from './components/Ref';
import React, { useMemo, useState } from 'react';
import { DataTable, Text } from '@epam/uui';
import { useGetTsDocsForPackage } from '../dataHooks';

const propsTableColumns: DataColumnProps<TTypeProp>[] = [
    {
        key: 'name',
        alignSelf: 'center',
        caption: 'Name',
        render: (prop) => <Text color="primary">{prop.name}</Text>,
        width: 200,
        isSortable: true,
    },
    {
        key: 'value',
        caption: 'Type',
        alignSelf: 'center',
        render: (prop) => (
            <Code codeAsHtml={ prop.value } isCompact={ true } />
        ),
        width: 300,
        isSortable: false,
    },
    {
        key: 'comment',
        caption: 'Comment',
        alignSelf: 'center',
        render: (prop) => <TsComment text={ prop.comment } keepBreaks={ false } />,
        width: 200,
        grow: 1,
    },
    {
        key: 'inheritedFrom',
        caption: 'From',
        alignSelf: 'center',
        render: (prop) => <Ref refData={ prop.inheritedFrom } />,
        width: 160,
        isSortable: true,
    },
];

type ApiReferenceItemApiProps = {
    packageName: string;
    exportName: string;
};
export function ApiReferenceItemTable(props: ApiReferenceItemApiProps) {
    const { packageName, exportName } = props;
    const exportsMap = useGetTsDocsForPackage(packageName);
    const exportInfo = exportsMap?.[exportName];

    const [tState, setTState] = useState<DataTableState>({});
    const exportPropsDsItems: TTypeProp[] = useMemo(() => {
        if (exportInfo) {
            return exportInfo?.props || [];
        }
        return [];
    }, [exportInfo]);
    const exportPropsDs = useArrayDataSource<TTypeProp, TTypeProp['name'], unknown>(
        {
            items: exportPropsDsItems,
            getId: (item) => item.name,
            sortBy(item: TTypeProp, sorting: SortingOption): any {
                if (sorting.field === 'inheritedFrom') {
                    if (item.inheritedFrom) {
                        const { module, name } = item.inheritedFrom;
                        return `${name}_${module || ''}`;
                    }
                }
                return item[sorting.field as keyof TTypeProp];
            },
        },
        [exportPropsDsItems],
    );

    const tableStateApi = useTableState({
        value: tState,
        onValueChange: (v) => setTState(v),
        columns: propsTableColumns,
    });
    const { tableState, setTableState } = tableStateApi;
    const view = exportPropsDs.getView(tableState, setTableState);

    return (
        <DataTable
            allowColumnsResizing={ true }
            value={ tableState }
            onValueChange={ setTableState }
            columns={ propsTableColumns }
            getRows={ view.getVisibleRows }
            { ...view.getListProps() }
        />
    );
}
