import { TTypeProp } from '../types';
import React, { useMemo } from 'react';
import { DataTable, FlexCell } from '@epam/uui';
import { useTableState, useArrayDataSource, DataColumnProps } from '@epam/uui-core';
import { RichTextView, Text, FlexRow, Panel } from '@epam/promo';
import { useGetTsDocsForPackage } from '../dataHooks';

function formatInheritedFrom(inheritedFrom: TTypeProp['inheritedFrom']) {
    if (inheritedFrom) {
        const { module, name } = inheritedFrom;
        if (module && name) {
            return `${module}/${name}`;
        }
        return name;
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
        width: 200,
        isSortable: true,
    },
    {
        key: 'optional',
        caption: 'Optional',
        render: (prop) => <Text color="gray80">{prop.optional ? 'Optional' : ''}</Text>,
        width: 200,
        isSortable: true,
    },
    {
        key: 'inheritedFrom',
        caption: 'Inherited From',
        render: (prop) => <Text color="gray80">{formatInheritedFrom(prop.inheritedFrom)}</Text>,
        width: 200,
        isSortable: true,
    },
    {
        key: 'comment',
        caption: 'Description',
        render: (prop) => <Comment comment={ prop.comment } />,
        width: 200,
        grow: 1,
    },
];

type TExportInfoParams = {
    exportName: string;
    packageName: string;
};

export function ExportInfo(params: TExportInfoParams) {
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
        },
        [exportPropsDsItems],
    );

    const tableStateApi = useTableState({
        columns: propsTableColumns,
    });
    const { tableState, setTableState } = tableStateApi;
    const view = exportPropsDs.getView(tableState, setTableState);
    const info = exportsMap?.[exportName];
    const {
        kind,
        name,
        value,
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
                    { comment?.length > 0 && <NameValue name="Comment" value={ <Comment comment={ comment } /> } /> }
                </Panel>
                { exportPropsDsItems?.length > 0 && (
                    <Panel margin="24">
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

function Comment(props: { comment?: string[] }) {
    function formatCommentForHtml(comment?: string[]) {
        if (comment) {
            const str = comment.join(' ');
            return '<p>' + str + '</p>';
        }
    }
    return <RichTextView htmlContent={ formatCommentForHtml(props.comment) } />;
}
