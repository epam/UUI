import React, { useMemo, useState } from 'react';
import { DataColumnProps } from '@epam/uui-core';
import { Text } from '@epam/uui';
import { isApiRefPropGroup, TDocsGenExportedType, TDocsGenTypeSummary, TApiRefPropsItem, TTypeGroup } from './types';
import { Code } from '../docs/Code';
import { TsComment } from './components/TsComment';
import { Ref } from './components/Ref';
import { useDocsGenForType, useDocsGenSummaries } from './dataHooks';
import { TType } from './sharedTypes';
import { ApiRefTypePropsView } from './ApiRefTypePropsView';

export function ApiRefTypeProps(props: { showCode?: boolean; typeRef: TDocsGenExportedType; }) {
    const docsGenType = useDocsGenForType(props.typeRef);
    const docsGenSummaries = useDocsGenSummaries();
    if (!docsGenType || !docsGenSummaries) {
        return null;
    }
    return (
        <ApiRefTypePropsContainer { ...props } docsGenType={ docsGenType } docsGenSummaries={ docsGenSummaries } />
    );
}

function ApiRefTypePropsContainer(props: { showCode?: boolean, docsGenType: TType, docsGenSummaries: TDocsGenTypeSummary }) {
    const { showCode = false, docsGenType, docsGenSummaries } = props;
    const { canGroup, isGrouped, setIsGrouped } = useIsGrouped(docsGenType);
    const columns = getColumns({ docsGenSummaries });
    const groupColumns = getColumns({ isGroupColumns: true, docsGenSummaries });

    const items: TApiRefPropsItem[] = useMemo(() => {
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
            return (docsGenType.details.props as TApiRefPropsItem[]).concat(parentsArr);
        }
        return [];
    }, [docsGenType, isGrouped, docsGenSummaries]);

    return (
        <ApiRefTypePropsView
            canGroup={ canGroup }
            columns={ columns }
            docsGenType={ docsGenType }
            groupColumns={ groupColumns }
            isGrouped={ isGrouped }
            items={ items }
            onSetIsGrouped={ setIsGrouped }
            showCode={ showCode }
        />
    );
}

function getColumns(params: {
    isGroupColumns?: boolean,
    docsGenSummaries: TDocsGenTypeSummary
}): DataColumnProps<TApiRefPropsItem>[] {
    const { isGroupColumns = false, docsGenSummaries } = params;
    const WIDTH = {
        name: 200,
        typeValue: 460,
        comment: 200,
    };
    const propsTableColumns: DataColumnProps<TApiRefPropsItem>[] = [
        {
            key: 'name',
            alignSelf: 'center',
            caption: 'Name',
            render: (item) => {
                if (isApiRefPropGroup(item)) {
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
                if (isApiRefPropGroup(item)) {
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
