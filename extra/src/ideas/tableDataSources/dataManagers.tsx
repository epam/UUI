import * as React from 'react';

type DataSource = {
    props: any;
    Component: React.ComponentType<any>;
};

function array(): DataSource {
    return null;
}

type DataTableProps<TItem> = {
    data: DataSource;
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
