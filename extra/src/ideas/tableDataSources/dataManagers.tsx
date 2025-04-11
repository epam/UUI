import * as React from 'react';

type DataSourceFactory<TParams, TItem> = (params: TParams) => DataSource<TItem>;

type DataSource<T> = {
    props: any;
    Component: React.ComponentType<any>;
};

interface ArrayDataManagerProps<T> {
    parentField?: string;
}

function array<T>(data: T[], params: ArrayDataManagerProps<T>): DataSource<T> {
    return null;
}

interface LazyDataManagerProps<T> {
    getItems(): T[];
    cacheSettings?: any;
}

function lazy<T>(params: LazyDataManagerProps<T>): DataSource<T> {
    return null;
}

type DataTableProps<TItem> = {
    data: DataSource<TItem>;
    someColor: 'blue' | 'red';
    render(item: TItem): any;
};

class DataTable<TItem> extends React.Component<DataTableProps<TItem>> {
    static of<T>() {
        return DataTable as new (props: DataTableProps<any>, context: {}) => DataTable<T>;
    }
}

interface ArrItemType {
    id: number;
    value: string;
}

const arr = [{ id: 1, value: '123 ' }];

function testLoad() {
    return [{ key: '123', val: 'test' }];
}

const ArrDataTable = DataTable.of<ArrItemType>();
//const t1 = <ArrDataTable data={ array(arr, { parentField: 'parentId' }) } someColor="blue" render={ (x) => x.value } />;

// const t2 = <DataTable
//     data={lazy({ getItems: testLoad })}
//     someColor='blue'
//     render={x => x.asd}
// />

function testFac<TItem>(props: DataTableProps<TItem>): null {
    return null;
}

testFac({
    data: array(arr, { parentField: 'parentId' }),
    someColor: 'blue',
    render: (x) => x.value,
});