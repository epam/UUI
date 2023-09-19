import {
    DataColumnProps,
    DataTableState,
    SortingOption,
    useArrayDataSource,
    useTableState,
} from '@epam/uui-core';
import { TTsDocExportedEntry, TType, TTypeProp } from '../types';
import { Code } from '../../../common/docs/Code';
import { TsComment } from './components/TsComment';
import { Ref } from './components/Ref';
import React, { useMemo, useState } from 'react';
import { Checkbox, DataTable, FlexRow, Text } from '@epam/uui';
import { useGetTsDocsForPackage } from '../dataHooks';
import { CodeExpandable } from './components/CodeExpandable';
import css from './ApiReferenceTable.module.scss';

type TTypeGroup = { _group: true, from: TTypeProp['from'] };
type TItem = TTypeProp | TTypeGroup;

function isGroup(item: TTypeProp | TTypeGroup): item is TTypeGroup {
    return (item as TTypeGroup)._group;
}

function groupComparator(f1: TTypeGroup, f2: TTypeGroup) {
    const from1 = (f1).from;
    const from2 = (f2).from;
    if (from1 && from2) {
        return String(from1.typeName.name).localeCompare(String(from2.typeName.name))
            || String(from1.module).localeCompare(String(from2.module));
    }
    return 0;
}

function getColumns(params: { isGroupedByFrom: boolean, hasFrom: boolean }): DataColumnProps<TItem>[] {
    const { hasFrom, isGroupedByFrom } = params;
    const isFromVisible = hasFrom && !isGroupedByFrom;
    const WIDTH = {
        name: 200,
        typeValue: isFromVisible ? 300 : 300 + 160,
        comment: 200,
        from: isFromVisible ? 160 : 0,
    };

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
            width: WIDTH.name,
            isSortable: true,
        },
        {
            key: 'typeValue',
            caption: 'Type',
            alignSelf: 'center',
            render: (item) => {
                if (isGroup(item)) {
                    return null;
                }
                return (
                    <Code codeAsHtml={ item.typeValue.raw } isCompact={ true } />
                );
            },
            width: WIDTH.typeValue,
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
                    <TsComment text={ item.comment } keepBreaks={ true } isCompact={ true } />
                );
            },
            width: WIDTH.comment,
            grow: 1,
        },
    ];
    if (isFromVisible) {
        return propsTableColumns.concat([
            {
                key: 'from',
                caption: 'From',
                alignSelf: 'center',
                render: (item) => <Ref refData={ item.from } />,
                width: WIDTH.from,
                isSortable: true,
            },
        ]);
    }
    return propsTableColumns;
}

function fromToString(from?: TTypeProp['from']) {
    if (from) {
        if (from.module) {
            return `${from.module}:${from.typeName.name}`;
        }
        return from.typeName.name;
    }
    return '';
}

function useIsGrouped(exportInfo?: TType): { canGroup: boolean, setIsGrouped: (isGrouped: boolean) => void, isGrouped: boolean } {
    const [isGrouped, setIsGrouped] = useState(false);
    const canGroup = useMemo(() => {
        if (exportInfo) {
            return Boolean(exportInfo.props?.some(({ from }) => !!from));
        }
        return false;
    }, [exportInfo]);

    return {
        canGroup,
        isGrouped: Boolean(canGroup && isGrouped),
        setIsGrouped,
    };
}

type ApiReferenceItemApiProps = {
    entry: TTsDocExportedEntry;
    showCode?: boolean;
};
export function ApiReferenceItemTable(props: ApiReferenceItemApiProps) {
    const { entry, showCode = false } = props;
    const [packageName, exportName] = entry.split(':');
    const exportsMap = useGetTsDocsForPackage(packageName);
    const exportInfo = exportsMap?.[exportName];
    const { canGroup, isGrouped, setIsGrouped } = useIsGrouped(exportInfo);
    const columns = getColumns({ isGroupedByFrom: isGrouped, hasFrom: canGroup });
    const isNoData = !exportInfo?.props?.length;
    const [tState, setTState] = useState<DataTableState>({});
    const exportPropsDsItems: TItem[] = useMemo(() => {
        if (exportInfo?.props) {
            const parents = new Map<string, TTypeGroup>();
            if (isGrouped) {
                exportInfo.props.forEach(({ from }) => {
                    if (from) {
                        parents.set(fromToString(from), { _group: true, from });
                    }
                });
            }
            const parentsArr = Array.from(parents.values()).sort(groupComparator);
            return (exportInfo.props as TItem[]).concat(parentsArr);
        }
        return [];
    }, [exportInfo, isGrouped]);
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
                        const { module, typeName } = item.from;
                        // name goes first here, so that it's sorted by name and then by module.
                        return `${typeName.name}:${module}`;
                    }
                }
                return item[sorting.field as keyof TItem];
            },
            getParentId(item: TItem): string | undefined {
                if (isGrouped && !isGroup(item)) {
                    return fromToString(item.from);
                }
            },
        },
        [exportPropsDsItems, isGrouped],
    );

    const tableStateApi = useTableState({
        value: tState,
        onValueChange: (v) => setTState(v),
        columns,

    });
    const { tableState, setTableState } = tableStateApi;
    const view = exportPropsDs.getView(tableState, setTableState, {
        isFoldedByDefault(): boolean {
            return false;
        },
    });

    if (isNoData) {
        return null;
    }

    return (
        <div className={ css.root }>
            { canGroup && (
                <FlexRow>
                    <Checkbox value={ isGrouped } onValueChange={ setIsGrouped } label="Group By: From" />
                </FlexRow>
            )}
            <DataTable
                allowColumnsResizing={ true }
                value={ tableState }
                onValueChange={ setTableState }
                columns={ columns }
                getRows={ view.getVisibleRows }
                { ...view.getListProps() }
            />
            <CodeExpandable showCode={ showCode } exportInfo={ exportInfo } />
        </div>
    );
}
