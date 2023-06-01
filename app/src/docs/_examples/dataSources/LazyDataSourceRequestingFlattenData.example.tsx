import React, { useState } from 'react';
import { DataQueryFilter, DataSourceState, useLazyDataSource } from '@epam/uui-core';
import { DataSourceViewer } from '@epam/uui-docs';

interface Item {
    id: number;
    name: string;
}

export default function LazyDataSourceRequestingFlattenDataExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({});
    const dataSource1 = useLazyDataSource<Item, string, DataQueryFilter<Item>>({
        api: async (req) => {
            const { count, from } = req.range;
            return {
                count: 30, // maximum elements, which will be requested
                items: Array(count)
                    .fill(0)
                    .map((_, index) => ({ id: index + from, name: `Name ${index + from}` })),
            };
        },
    }, []);
   
    const [value2, onValueChange2] = useState<DataSourceState>({});
    const dataSource2 = useLazyDataSource<Item, string, DataQueryFilter<Item>>({
        api: async ({ range: { count, from } }) => {
            const gap = 10;
            const newFrom = from === 0 ? from + gap : from;
            return {
                from: newFrom, // from with gap at start.
                items: Array(count + gap)
                    .fill(0)
                    .map((_, index) => ({ id: index + newFrom, name: `Name ${index + newFrom}` })),
            };
        },
    }, []);

    const [value3, onValueChange3] = useState<DataSourceState>({});
    const dataSource3 = useLazyDataSource<Item, string, DataQueryFilter<Item>>({
        api: async () => {
            const newCount = 50;
            const newFrom = 0;
            return {
                from: newFrom,
                count: newCount,
                items: Array(newCount)
                    .fill(0)
                    .map((_, index) => ({ id: index + newFrom, name: `Name ${index + newFrom}` })),
            };
        },
    }, []);

    const [value4, onValueChange4] = useState<DataSourceState>({});
    const dataSource4 = useLazyDataSource<Item, string, DataQueryFilter<Item>>({
        api: async (req) => {
            const { count, from } = req.range;
            return {
                items: Array(count)
                    .fill(0)
                    .map((_, index) => ({ id: index + from, name: `Name ${index + from}` })),
            };
        },
    }, []);
    
    return (
        <>
            <DataSourceViewer
                exampleTitle="count: 30. Will request maximum 30 elements."
                value={ value1 }
                onValueChange={ onValueChange1 }
                dataSource={ dataSource1 }
            />
            <DataSourceViewer
                exampleTitle="from: from + 10 at the beginning."
                value={ value2 }
                onValueChange={ onValueChange2 }
                dataSource={ dataSource2 }
            />
            <DataSourceViewer
                exampleTitle="from: 0, count: 50. Will request only 50 elements once."
                value={ value3 }
                onValueChange={ onValueChange3 }
                dataSource={ dataSource3 }
            />
            <DataSourceViewer
                exampleTitle="Without count and from. Will make requests while scrolling."
                value={ value4 }
                onValueChange={ onValueChange4 }
                dataSource={ dataSource4 }
            />
        </>
    );
}
