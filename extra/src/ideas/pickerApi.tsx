import * as React from 'react';

type DataSourceProps<TItem, TId> = ArrayProps<TItem, TId> | ApiProps<TItem, TId>;

type ArrayProps<TItem, TId> = {
    source: 'array';
    items: TItem[];
    getId: (item: TItem) => TId;
};

type ApiProps<TItem, TId> = {
    source: 'api';
    api: (request: any) => Promise<TItem[]>;
};

type TestProps<TItem, TId> = DataSourceProps<TItem, TId> & {
    example: TItem;
};

class Test<TItem, TId> extends React.Component<TestProps<TItem, TId>> {}

const arr = (
    <Test
        source="array"
        items={ [
            1, 2, 3,
        ] }
        getId={ (i) => i }
        example={ 1 }
    />
);

const api = <Test source="api" api={ (_) => Promise.resolve(['1', '2']) } example="1" />;
