import {
    DataColumnProps, DataTableRowProps,
    DataTableState,
    SortingOption,
    useArrayDataSource,
    useTableState,
} from '@epam/uui-core';
import { TDocsGenExportedType, TDocsGenTypeSummary } from '../types';
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
import { useDocsGenForType, useDocsGenSummaries } from '../dataHooks';
import { CodeExpandable } from './components/CodeExpandable';
import css from './ApiReferenceTable.module.scss';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/table-info-fill-18.svg';
import { TType, TTypeProp } from '../sharedTypes';

type TTypeGroup = { _group: true, from: TTypeProp['from'], comment: TTypeProp['comment'] };
type TItem = TTypeProp | TTypeGroup;

function isGroup(item: TTypeProp | TTypeGroup): item is TTypeGroup {
    return (item as TTypeGroup)._group;
}

type TGetColumnsParams = {
    isGroupColumns?: boolean,
    docsGenSummaries: TDocsGenTypeSummary
};
function getColumns(params: TGetColumnsParams): DataColumnProps<TItem>[] {
    const { isGroupColumns = false, docsGenSummaries } = params;
    const WIDTH = {
        name: 200,
        typeValue: 460,
        comment: 200,
    };
    const propsTableColumns: DataColumnProps<TItem>[] = [
        {
            key: 'name',
            alignSelf: 'center',
            caption: 'Name',
            render: (item) => {
                if (isGroup(item)) {
                    return <Ref typeSummary={ docsGenSummaries[item.from] } />;
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
    return propsTableColumns;
}

function useIsGrouped(docsGenType?: TType): { canGroup: boolean, setIsGrouped: (isGrouped: boolean) => void, isGrouped: boolean } {
    const [isGrouped, setIsGrouped] = useState(false);
    const canGroup = useMemo(() => {
        if (docsGenType) {
            return Boolean(docsGenType.details?.props?.some(({ from }) => !!from));
        }
        return false;
    }, [docsGenType]);

    return {
        canGroup,
        isGrouped: Boolean(canGroup && isGrouped),
        setIsGrouped,
    };
}

export function ApiReferenceItemTableForTypeRef(props: { showCode?: boolean; typeRef: TDocsGenExportedType; }) {
    const docsGenType = useDocsGenForType(props.typeRef);
    const docsGenSummaries = useDocsGenSummaries();
    if (!docsGenType || !docsGenSummaries) {
        return null;
    }
    return (
        <ApiReferenceItemTable { ...props } docsGenType={ docsGenType } docsGenSummaries={ docsGenSummaries } />
    );
}
export function ApiReferenceItemTable(props: { showCode?: boolean, docsGenType: TType, docsGenSummaries: TDocsGenTypeSummary }) {
    const { showCode = false, docsGenType, docsGenSummaries } = props;
    const { canGroup, isGrouped, setIsGrouped } = useIsGrouped(docsGenType);
    const columns = getColumns({ docsGenSummaries });
    const isNoData = !docsGenType?.details?.props?.length;
    const propsFromUnion = docsGenType?.details?.propsFromUnion;
    const [tState, setTState] = useState<DataTableState>({});
    const exportPropsDsItems: TItem[] = useMemo(() => {
        if (docsGenType?.details?.props) {
            const parents = new Map<string, TTypeGroup>();
            if (isGrouped) {
                docsGenType.details.props.forEach(({ from }) => {
                    if (from) {
                        const comment = docsGenSummaries[from]?.comment;
                        parents.set(from, { _group: true, from, comment });
                    }
                });
            }
            const parentsArr = Array.from(parents.values());
            return (docsGenType.details.props as TItem[]).concat(parentsArr);
        }
        return [];
    }, [docsGenType, isGrouped, docsGenSummaries]);
    const exportPropsDs = useArrayDataSource<TItem, string, unknown>(
        {
            items: exportPropsDsItems,
            getId: (item) => {
                if (isGroup(item)) {
                    return item.from as string;
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
                    if (props.value && isGroup(props.value)) {
                        return <DataTableRow key={ props.id } { ...props } columns={ getColumns({ isGroupColumns: true, docsGenSummaries }) } />;
                    }
                    return <DataTableRow key={ props.id } { ...props } indent={ 0 } columns={ columns } />;
                } }
                { ...view.getListProps() }
            />
            <CodeExpandable showCode={ showCode } docsGenType={ docsGenType } />
        </div>
    );
}
