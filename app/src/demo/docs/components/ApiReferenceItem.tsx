import { TRef, TTypeProp } from '../types';
import React, { useMemo, useState } from 'react';
import { DataTable, FlexCell } from '@epam/uui';
import { useTableState, useArrayDataSource, DataColumnProps, SortingOption, DataTableState } from '@epam/uui-core';
import { RichTextView, Text, FlexRow, Panel, LinkButton } from '@epam/promo';
import { useGetTsDocsForPackage } from '../dataHooks';
import { svc } from '../../../services';
import { ContentSection } from '../../../common';

function formatRef(ref: TRef) {
    if (ref) {
        const { module, name } = ref;
        if (module && name) {
            const link = { pathname: '/documents', query: { id: `${module}/${name}` } };
            return (
                <React.Fragment key={ name }>
                    <LinkButton link={ link } caption={ name } />
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
        caption: 'NAME',
        render: (prop) => <Text color="gray80">{prop.name}</Text>,
        width: 200,
        isSortable: true,
    },
    {
        key: 'value',
        caption: 'Type',
        render: (prop) => (
            <Text color="gray80">
                <span style={ { whiteSpace: 'pre-wrap' } }>{prop.value}</span>
            </Text>
        ),
        width: 300,
        isSortable: true,
    },
    {
        key: 'optional',
        caption: 'Required',
        render: (prop) => <Text color="gray80">{prop.optional ? '' : 'Y'}</Text>,
        width: 110,
        isSortable: true,
    },
    {
        key: 'inheritedFrom',
        caption: 'Inherited From',
        render: (prop) => <Text color="gray80">{formatRef(prop.inheritedFrom)}</Text>,
        width: 160,
        isSortable: true,
    },
    {
        key: 'comment',
        caption: 'Comment',
        render: (prop) => <MultiLineText text={ prop.comment } keepBreaks={ false } />,
        width: 200,
        grow: 1,
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
        kind,
        name,
        value,
        valuePrint,
        comment,
    } = info || {};

    if (!info) {
        return null;
    }

    return (
        <FlexRow>
            <FlexCell width="auto">
                <h2>
                    <Text fontSize="18">
                        {`[${kind}] `}
                        {name}
                    </Text>
                </h2>
                <Panel shadow={ true }>
                    { value !== name && <NameValue name="Value" value={ value } /> }
                    { valuePrint && <NameValue name="Print" value={ <MultiLineText text={ valuePrint } keepBreaks={ true } /> } /> }
                    { comment?.length > 0 && <NameValue name="Comment" value={ <MultiLineText text={ comment } keepBreaks={ true } /> } /> }
                </Panel>
                { exportPropsDsItems?.length > 0 && (
                    <Panel>
                        <Text font="sans-semibold" color="gray80">Props</Text>
                        <DataTable
                            value={ tableState }
                            onValueChange={ setTableState }
                            columns={ propsTableColumns }
                            getRows={ view.getVisibleRows }
                            { ...view.getListProps() }
                        />
                    </Panel>
                )}
            </FlexCell>
        </FlexRow>
    );
}

function NameValue(props: { name: string; value?: any }) {
    const { name, value } = props;
    if (!value) {
        return null;
    }
    return (
        <FlexRow spacing="6">
            <label>
                <Text font="sans-semibold" color="gray80">{name}</Text>
                <Text>{value}</Text>
            </label>
        </FlexRow>
    );
}

function MultiLineText(props: { text?: string[], keepBreaks: boolean }) {
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
    return <RichTextView htmlContent={ textStr } />;
}
