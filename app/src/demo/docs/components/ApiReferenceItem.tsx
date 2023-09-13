import { TRef, TTypeProp } from '../types';
import React, { useMemo, useState } from 'react';
import { DataTable, LinkButton, RichTextView, Text, ScrollBars } from '@epam/uui';
import { useTableState, useArrayDataSource, DataColumnProps, SortingOption, DataTableState } from '@epam/uui-core';
import { useGetTsDocsForPackage } from '../dataHooks';
import { svc } from '../../../services';
import { ContentSection } from '../../../common';
import { Code } from '../../../common/docs/Code';
import css from './ApiReferenceItem.module.scss';

function formatRef(ref: TRef) {
    if (ref) {
        const { module, name } = ref;
        if (module && name) {
            const link = { pathname: '/documents', query: { id: `${module}/${name}` } };
            return (
                <React.Fragment key={ name }>
                    <LinkButton link={ link } caption={ name } />
                    {' '}
                    (
                    {module}
                    )
                </React.Fragment>
            );
        }
        return <React.Fragment key={ name }>name</React.Fragment>;
    }
}

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
        render: (prop) => <TsComment text={ prop.comment } keepBreaks={ false } />,
        width: 200,
        grow: 1,
    },
    {
        key: 'inheritedFrom',
        caption: 'From',
        render: (prop) => <Text color="primary">{formatRef(prop.inheritedFrom)}</Text>,
        width: 160,
        isSortable: true,
    },
];

type TExportInfoParams = {
    exportName: string;
    packageName: string;
};

export function ApiReferenceItem() {
    const { id } = svc.uuiRouter.getCurrentLink().query;
    const [p1, p2, exportName] = id.split('/');
    const packageName = `${p1}/${p2}`;

    return (
        <ContentSection>
            <PackageExportDescription exportName={ exportName } packageName={ packageName } />
        </ContentSection>
    );
}

export function PackageExportDescription(params: TExportInfoParams) {
    const [tState, setTState] = useState<DataTableState>({});
    const { packageName, exportName } = params;
    const exportsMap = useGetTsDocsForPackage(packageName);
    const exportPropsDsItems: TTypeProp[] = useMemo(() => {
        if (exportsMap && exportName) {
            const moduleInfo = exportsMap?.[exportName];
            return moduleInfo?.props || [];
        }
        return [];
    }, [exportName, exportsMap]);
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
    const info = exportsMap?.[exportName];
    const {
        name,
        valuePrint,
        comment,
    } = info || {};

    if (!info) {
        return null;
    }

    const hasComment = comment?.length > 0;
    const hasProps = exportPropsDsItems?.length > 0;

    return (
        <ScrollBars>
            <div className={ css.root }>
                <RichTextView>
                    <h1>{name}</h1>
                </RichTextView>
                { hasComment && (
                    <InnerBlock title="Description">
                        <TsComment text={ comment } keepBreaks={ false } />
                    </InnerBlock>
                )}
                {
                    hasProps && (
                        <InnerBlock>
                            <DataTable
                                allowColumnsResizing={ true }
                                value={ tableState }
                                onValueChange={ setTableState }
                                columns={ propsTableColumns }
                                getRows={ view.getVisibleRows }
                                { ...view.getListProps() }
                            />
                        </InnerBlock>
                    )
                }
                <InnerBlock>
                    <Code codeAsHtml={ valuePrint.join('\n') } />
                </InnerBlock>
            </div>
        </ScrollBars>
    );
}

type TInnerBlock = {
    title?: string;
    children: React.ReactNode;
};
function InnerBlock(props: TInnerBlock) {
    return (
        <div className={ css.innerBlock }>
            { props.title && (
                <RichTextView>
                    <h2>{props.title}</h2>
                </RichTextView>
            )}
            { props.children }
        </div>
    );
}

function TsComment(props: { text?: string[], keepBreaks: boolean }) {
    const { text, keepBreaks } = props;

    function formatComment(commentInput: string) {
        // Playground to modify and debug https://regex101.com/r/dd4hyi/1
        const linksRegex = /(?:\[(.*)])?\{\s*@link\s*(https:\/\/\S+?)\s*}/gm;
        let comment = commentInput;
        comment = comment.replace(linksRegex, (_, a, b) => `<a href='${b}'>${a ?? b}</a>`);
        return comment;
    }
    function escape(htmlStr: string) {
        return htmlStr.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    const textStr = useMemo(() => {
        if (text && text.length > 0) {
            if (keepBreaks) {
                return `<pre>${formatComment(escape(text.join('\n')))}</pre>`;
            }
            return `<p>${formatComment(escape(text.join(' ')))}</p>`;
        }
    }, [text, keepBreaks]);

    if (!textStr) {
        return null;
    }
    return <RichTextView htmlContent={ textStr } size="16" />;
}
