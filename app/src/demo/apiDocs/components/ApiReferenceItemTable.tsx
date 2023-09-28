import {
    DataColumnProps, DataTableRowProps,
    DataTableState,
    SortingOption,
    useArrayDataSource,
    useTableState,
} from '@epam/uui-core';
import { TTsDocExportedEntry } from '../types';
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
import { useTsDocForType } from '../dataHooks';
import { CodeExpandable } from './components/CodeExpandable';
import css from './ApiReferenceTable.module.scss';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/table-info-fill-18.svg';
import { TType, TTypeProp } from '../docsGenSharedTypes';

type TTypeGroup = { _group: true, from: TTypeProp['from'], comment: TTypeProp['comment'] };
type TItem = TTypeProp | TTypeGroup;

function isGroup(item: TTypeProp | TTypeGroup): item is TTypeGroup {
    return (item as TTypeGroup)._group;
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
                    return <Ref typeRefShort={ item.from } />;
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
                return <TsComment text={ item.comment } keepBreaks={ true } isCompact={ true } />;
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
                render: (item) => <Ref typeRefShort={ item.from } />,
                width: WIDTH.from,
                isSortable: true,
            },
        ]);
    }
    return propsTableColumns;
}

function useIsGrouped(tsDocsType?: TType): { canGroup: boolean, setIsGrouped: (isGrouped: boolean) => void, isGrouped: boolean } {
    const [isGrouped, setIsGrouped] = useState(false);
    const canGroup = useMemo(() => {
        if (tsDocsType) {
            return Boolean(tsDocsType.props?.some(({ from }) => !!from));
        }
        return false;
    }, [tsDocsType]);

    return {
        canGroup,
        isGrouped: Boolean(canGroup && isGrouped),
        setIsGrouped,
    };
}

export function ApiReferenceItemTableForTypeRef(props: { showCode?: boolean; tsDocsRef: TTsDocExportedEntry; }) {
    const tsDocsType = useTsDocForType(props.tsDocsRef);
    if (!tsDocsType) {
        return null;
    }
    return (
        <ApiReferenceItemTable { ...props } tsDocsType={ tsDocsType } />
    );
}
export function ApiReferenceItemTable(props: { showCode?: boolean, tsDocsType: TType }) {
    const { showCode = false, tsDocsType } = props;
    const { canGroup, isGrouped, setIsGrouped } = useIsGrouped(tsDocsType);
    const columns = getColumns({ isGroupedByFrom: isGrouped, hasFrom: canGroup });
    const isNoData = !tsDocsType?.props?.length;
    const propsFromUnion = tsDocsType?.propsFromUnion;
    const [tState, setTState] = useState<DataTableState>({});
    const exportPropsDsItems: TItem[] = useMemo(() => {
        if (tsDocsType?.props) {
            const parents = new Map<string, TTypeGroup>();
            if (isGrouped) {
                tsDocsType.props.forEach(({ from, comment }) => {
                    if (from) {
                        parents.set(from, { _group: true, from, comment });
                    }
                });
            }
            const parentsArr = Array.from(parents.values());
            return (tsDocsType.props as TItem[]).concat(parentsArr);
        }
        return [];
    }, [tsDocsType, isGrouped]);
    const exportPropsDs = useArrayDataSource<TItem, string, unknown>(
        {
            items: exportPropsDsItems,
            getId: (item) => {
                if (isGroup(item)) {
                    return item.from;
                }
                return String(item.uid);
            },
            sortBy(item: TItem, sorting: SortingOption): any {
                if (sorting.field === 'from') {
                    if (item.from) {
                        const [module, typeName] = item.from.split(':');
                        // typeName goes first here, so that it's sorted by typeName and then by module.
                        return `${typeName}:${module}`;
                    }
                }
                return item[sorting.field as keyof TItem];
            },
            getParentId(item: TItem): string | undefined {
                if (isGrouped && !isGroup(item) && item.from) {
                    return item.from;
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
            <CodeExpandable showCode={ showCode } tsDocsType={ tsDocsType } />
        </div>
    );
}
