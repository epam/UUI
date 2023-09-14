import {
    DataColumnProps,
    DataTableState,
    SortingOption,
    useArrayDataSource,
    useTableState,
} from '@epam/uui-core';
import { TTypeProp } from '../types';
import { Code } from '../../../common/docs/Code';
import { TsComment } from './components/TsComment';
import { Ref } from './components/Ref';
import React, { useMemo, useState } from 'react';
import { Checkbox, DataTable, FlexRow, Text } from '@epam/uui';
import { useGetTsDocsForPackage } from '../dataHooks';

type TTypeGroup = { _group: true, from: TTypeProp['from'] };
type TItem = TTypeProp | TTypeGroup;

function isGroup(item: TTypeProp | TTypeGroup): item is TTypeGroup {
    return (item as TTypeGroup)._group;
}

function getColumns(isGrouped: boolean): DataColumnProps<TItem>[] {
    const propsTableColumns: DataColumnProps<TItem>[] = [
        {
            key: 'name',
            alignSelf: 'center',
            caption: 'Name',
            render: (item) => {
                if (isGroup(item)) {
                    return <Ref refData={ item.from } />;
                }
                return (
                    <span style={ { wordBreak: 'break-all' } }>
                        <Text color="primary">{item.name}</Text>
                    </span>
                );
            },
            width: 200,
            isSortable: true,
        },
        {
            key: 'value',
            caption: 'Type',
            alignSelf: 'center',
            render: (item) => {
                if (isGroup(item)) {
                    return null;
                }
                return (
                    <Code codeAsHtml={ item.value } isCompact={ true } />
                );
            },
            width: isGrouped ? 460 : 300,
            isSortable: false,
        },
        {
            key: 'comment',
            caption: 'Comment',
            alignSelf: 'center',
            render: (item) => {
                if (isGroup(item)) {
                    return null;
                }
                return (
                    <TsComment text={ item.comment } keepBreaks={ false } />
                );
            },
            width: 200,
            grow: 1,
        },
    ];
    if (!isGrouped) {
        return propsTableColumns.concat([
            {
                key: 'from',
                caption: 'From',
                alignSelf: 'center',
                render: (item) => <Ref refData={ item.from } />,
                width: 160,
                isSortable: true,
            },
        ]);
    }
    return propsTableColumns;
}

type ApiReferenceItemApiProps = {
    packageName: string;
    exportName: string;
};

function fromToString(from: TTypeProp['from']) {
    if (from) {
        if (from.module) {
            return `${from.module}/${from.name}`;
        }
        return from.name;
    }
}

export function ApiReferenceItemTable(props: ApiReferenceItemApiProps) {
    const [grouped, setGrouped] = useState(false);
    const { packageName, exportName } = props;
    const exportsMap = useGetTsDocsForPackage(packageName);
    const exportInfo = exportsMap?.[exportName];
    const columns = getColumns(grouped);

    const [tState, setTState] = useState<DataTableState>({});
    const exportPropsDsItems: TItem[] = useMemo(() => {
        if (exportInfo?.props) {
            const parents = new Map<string, TItem>();
            if (grouped) {
                exportInfo.props.forEach(({ from }) => {
                    if (from) {
                        parents.set(fromToString(from), { _group: true, from });
                    }
                });
            }
            const parentsArr = [...parents.values()].sort((f1, f2) => {
                const from1 = (f1 as TTypeGroup).from;
                const from2 = (f2 as TTypeGroup).from;
                return String(from1.module).localeCompare(String(from2.module))
                    || String(from1.name).localeCompare(String(from2.name));
            });
            return (exportInfo.props as TItem[]).concat(parentsArr);
        }
        return [];
    }, [exportInfo, grouped]);
    const exportPropsDs = useArrayDataSource<TItem, string, unknown>(
        {
            items: exportPropsDsItems,
            getId: (item) => {
                if (isGroup(item)) {
                    return fromToString(item.from);
                }
                return item.name;
            },
            sortBy(item: TItem, sorting: SortingOption): any {
                if (sorting.field === 'from') {
                    if (item.from) {
                        const { module, name } = item.from;
                        return `${name}_${module || ''}`;
                    }
                }
                return item[sorting.field as keyof TItem];
            },
            getParentId(item: TItem): string | undefined {
                if (grouped && !isGroup(item)) {
                    return fromToString(item.from);
                }
            },
        },
        [exportPropsDsItems, grouped],
    );

    const tableStateApi = useTableState({
        value: tState,
        onValueChange: (v) => setTState(v),
        columns,

    });
    const { tableState, setTableState } = tableStateApi;
    const view = exportPropsDs.getView(tableState, setTableState, {
        isFoldedByDefault(): boolean {
            return true;
        },
    });

    return (
        <>
            <FlexRow>
                <Checkbox value={ grouped } onValueChange={ setGrouped } label="Group By: From" />
            </FlexRow>
            <DataTable
                allowColumnsResizing={ true }
                value={ tableState }
                onValueChange={ setTableState }
                columns={ columns }
                getRows={ view.getVisibleRows }
                { ...view.getListProps() }
            />
        </>
    );
}
