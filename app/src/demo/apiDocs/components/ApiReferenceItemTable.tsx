import {
    DataColumnProps, DataTableRowProps,
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
import {
    Checkbox,
    DataTable,
    DataTableRow,
    FlexRow,
    FlexSpacer,
    IconContainer,
    RichTextView,
    Text,
    Tooltip,
} from '@epam/uui';
import { useTsDocs } from '../dataHooks';
import { CodeExpandable } from './components/CodeExpandable';
import css from './ApiReferenceTable.module.scss';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/table-info-fill-18.svg';

type TTypeGroup = { _group: true, from: TTypeProp['from'], comment: TTypeProp['comment'] };
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

function getColumns(params: { isGroupedByFrom?: boolean, hasFrom?: boolean, isGroupColumns?: boolean }): DataColumnProps<TItem>[] {
    const { hasFrom = false, isGroupedByFrom = false, isGroupColumns = false } = params;
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
                return (
                    <TsComment text={ item.comment } keepBreaks={ true } isCompact={ true } />
                );
            },
            width: WIDTH.comment,
            grow: 1,
        },
    ];

    if (isGroupColumns) {
        return [
            {
                ...propsTableColumns[0],
                width: propsTableColumns[0].width + propsTableColumns[1].width,
            },
            propsTableColumns[2],
        ];
    }

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
    const tsDocs = useTsDocs();
    const exportInfo = tsDocs.get(packageName, exportName);
    const { canGroup, isGrouped, setIsGrouped } = useIsGrouped(exportInfo);
    const columns = getColumns({ isGroupedByFrom: isGrouped, hasFrom: canGroup });
    const isNoData = !exportInfo?.props?.length;
    const propsFromUnion = exportInfo?.propsFromUnion;
    const [tState, setTState] = useState<DataTableState>({});
    const exportPropsDsItems: TItem[] = useMemo(() => {
        if (exportInfo?.props) {
            const parents = new Map<string, TTypeGroup>();
            if (isGrouped) {
                exportInfo.props.forEach(({ from }) => {
                    if (from) {
                        const comment = tsDocs.get(from.module, from.typeName.name)?.comment;
                        parents.set(fromToString(from), { _group: true, from, comment });
                    }
                });
            }
            const parentsArr = Array.from(parents.values()).sort(groupComparator);
            return (exportInfo.props as TItem[]).concat(parentsArr);
        }
        return [];
    }, [exportInfo, isGrouped, tsDocs]);
    const exportPropsDs = useArrayDataSource<TItem, string, unknown>(
        {
            items: exportPropsDsItems,
            getId: (item) => {
                if (isGroup(item)) {
                    return fromToString(item.from);
                }
                return item.uniqueId;
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
                if (isGrouped && !isGroup(item) && item.from) {
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
    const hasToolbar = canGroup || propsFromUnion;
    const renderGroupBy = () => {
        if (canGroup) {
            return (
                <Checkbox value={ isGrouped } onValueChange={ setIsGrouped } label="Group By: From" />
            );
        }
    };
    const renderPropsInfo = () => {
        if (propsFromUnion) {
            const renderContent = () => {
                const html = `
                        <h5>This type uses unions</h5>
                        <p>
                            The table may contain same props with same or different types. 
                            Please see the source code to better understand exact typing.
                        </p>
                `;
                return (
                    <RichTextView htmlContent={ html } />
                );
            };
            return (
                <>
                    <Text>Union</Text>
                    <Tooltip renderContent={ renderContent } color="default">
                        <IconContainer icon={ InfoIcon } style={ { fill: '#008ACE', marginLeft: '5px' } }></IconContainer>
                    </Tooltip>
                </>
            );
        }
    };
    const renderToolbar = () => {
        if (hasToolbar) {
            return (
                <FlexRow>
                    { renderGroupBy() }
                    <FlexSpacer />
                    { renderPropsInfo() }
                </FlexRow>
            );
        }
    };

    return (
        <div className={ css.root }>
            { renderToolbar() }
            <DataTable
                allowColumnsResizing={ false }
                value={ tableState }
                onValueChange={ setTableState }
                columns={ columns }
                getRows={ view.getVisibleRows }
                renderRow={ (props: DataTableRowProps<TItem, string>) => {
                    if (isGroup(props.value)) {
                        return <DataTableRow key={ props.id } { ...props } columns={ getColumns({ isGroupColumns: true }) } />;
                    }
                    return <DataTableRow key={ props.id } { ...props } indent={ 0 } columns={ columns } />;
                } }
                { ...view.getListProps() }
            />
            <CodeExpandable showCode={ showCode } exportInfo={ exportInfo } />
        </div>
    );
}
