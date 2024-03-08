import React, { useMemo, useState } from 'react';
import {
    DataColumnProps, DataTableRowProps, DataTableState, IHasRawProps, SortingOption, useArrayDataSource,
    useColumnsConfig,
} from '@epam/uui-core';
import { DataTableHeaderRow, DataTableRow, Text } from '@epam/uui';
import { isApiRefPropGroup, TDocsGenTypeSummary, TApiRefPropsItem, TTypeGroup } from './types';
import { Code } from '../docs/Code';
import { TsComment } from './components/TsComment';
import { Ref } from './components/Ref';
import { TType } from '@epam/uui-docs';
import css from './TypeRefTable.module.scss';

interface TypeRefTableProps extends IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    docsGenType: TType,
    docsGenSummaries: TDocsGenTypeSummary,
    isGrouped: boolean;
}
export function TypeRefTable(props: TypeRefTableProps) {
    const defaultColumns = getColumns(props.docsGenSummaries);

    const [tableState, setTableState] = useState<DataTableState>({ topIndex: 0, visibleCount: Number.MAX_SAFE_INTEGER });

    const items: TApiRefPropsItem[] = useMemo(() => {
        if (props.docsGenType?.details?.props) {
            const parents = new Map<string, TTypeGroup>();
            if (props.isGrouped) {
                props.docsGenType.details.props.forEach(({ from }) => {
                    if (from) {
                        const comment = props.docsGenSummaries[from]?.comment;
                        parents.set(from, { _group: true, from, comment });
                    }
                });
            }
            const parentsArr = Array.from(parents.values());
            return (props.docsGenType.details.props as TApiRefPropsItem[]).concat(parentsArr);
        }
        return [];
    }, [props.docsGenType, props.isGrouped, props.docsGenSummaries]);

    const { columns, config: columnsConfig } = useColumnsConfig(defaultColumns, tableState.columnsConfig);

    const exportPropsDs = useArrayDataSource<TApiRefPropsItem, string, unknown>(
        {
            items: items,
            getId: (item) => {
                if (isApiRefPropGroup(item)) {
                    return item.from as string;
                }
                return String(item.uid);
            },
            sortBy(item: TApiRefPropsItem, sorting: SortingOption): any {
                if (sorting.field === 'from') {
                    if (item.from) {
                        const [module, typeName] = item.from.split(':');
                        // typeName goes first here, so that it's sorted by typeName and then by module.
                        return `${typeName}:${module}`;
                    }
                }
                return item[sorting.field as keyof TApiRefPropsItem];
            },
            getParentId(item: TApiRefPropsItem): string | undefined {
                if (props.isGrouped && !isApiRefPropGroup(item) && item.from) {
                    return item.from;
                }
            },
        },
        [items, props.isGrouped],
    );

    const view = exportPropsDs.useView(tableState, setTableState, {
        isFoldedByDefault: () => false,
    });

    const renderRow = (props: DataTableRowProps<TApiRefPropsItem, string>) => {
        if (props.value && isApiRefPropGroup(props.value)) {
            const [col1, col2, col3] = columns;
            const groupColumns = [
                {
                    ...col1,
                    width: col1.width + col2.width,
                },
                col3,
            ];
            return <DataTableRow key={ props.id } { ...props } columns={ groupColumns } />;
        }
        return <DataTableRow key={ props.id } { ...props } indent={ Math.min(props.indent, 1) } columns={ columns } />;
    };

    return (
        <div { ...props.rawProps }>
            <div className={ css.stickyHeader }>
                <DataTableHeaderRow
                    columns={ columns }
                    allowColumnsResizing={ true }
                    value={ { ...tableState, columnsConfig } }
                    onValueChange={ setTableState }
                />
            </div>
            { view.getVisibleRows().map(renderRow) }
        </div>
    );
}

function getColumns(summaries: TDocsGenTypeSummary): DataColumnProps<TApiRefPropsItem>[] {
    const WIDTH = {
        name: 200,
        typeValue: 350,
        comment: 330,
    };
    return [
        {
            key: 'name',
            caption: 'Name',
            render: (item) => {
                if (isApiRefPropGroup(item)) {
                    return <Ref typeSummary={ summaries[item.from] } />;
                }
                return (
                    <span style={ { wordBreak: 'break-all' } }>
                        <Text color="primary">
                            {item.name}
                            {item.required && <span className="asterisk">*</span>}
                        </Text>
                    </span>
                );
            },
            width: WIDTH.name,
            isSortable: true,
        },
        {
            key: 'typeValue',
            caption: 'Type',
            render: (item) => {
                if (isApiRefPropGroup(item)) {
                    return null;
                }
                return (
                    <Code cx={ css.codeBg } codeAsHtml={ item.typeValue.html } isCompact={ true } />
                );
            },
            width: WIDTH.typeValue,
            isSortable: false,
        },
        {
            key: 'comment',
            caption: 'Comment',
            render: (item) => {
                return <TsComment comment={ item.comment } keepBreaks={ true } isCompact={ true } />;
            },
            width: WIDTH.comment,
            grow: 1,
        },
    ];
}
