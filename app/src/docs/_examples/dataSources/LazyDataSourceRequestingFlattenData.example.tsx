/* eslint-disable no-console */
import React, { useState } from 'react';
import { DataQueryFilter, DataSourceState, useLazyDataSource } from '@epam/uui-core';
import { DataSourceViewer } from '@epam/uui-docs';

interface Item {
    id: number;
    name: string;
}

export default function LazyDataSourceRequestingFlattenDataExample() {
    const [requests1, setRequestsCount1] = useState(0);
    const [value1, onValueChange1] = useState<DataSourceState>({});
    const dataSource1 = useLazyDataSource<Item, string, DataQueryFilter<Item>>({
        api: async (request) => {
            const { count, from } = request.range;
            setRequestsCount1((value) => value + 1);
            
            const response = {
                count: 30, // maximum elements, which will be requested
                items: Array(count)
                    .fill(0)
                    .map((_, index) => ({ id: index + from, name: `Name ${index + from}` })),
            };
     
            console.log('request #1:', request);
            console.log('response #1:', response);
            return response;
        },
    }, []);
   
    const [requests2, setRequestsCount2] = useState(0);
    const [value2, onValueChange2] = useState<DataSourceState>({});
    const dataSource2 = useLazyDataSource<Item, string, DataQueryFilter<Item>>({
        api: async (request) => {
            const { range: { count, from } } = request;
            const gap = 10;
            const newFrom = from === 0 ? from + gap : from;
            setRequestsCount2((value) => value + 1);
            const response = {
                from: newFrom, // from with gap at start.
                items: Array(count)
                    .fill(0)
                    .map((_, index) => ({ id: index + newFrom, name: `Name ${index + newFrom}` })),
            };
            
            console.log('request #2:', request);
            console.log('response #2:', response);
            return response;
        },
    }, []);

    const [requests3, setRequestsCount3] = useState(0);
    const [value3, onValueChange3] = useState<DataSourceState>({});
    const dataSource3 = useLazyDataSource<Item, string, DataQueryFilter<Item>>({
        api: async (request) => {
            const newCount = 50;
            const newFrom = 0;
            setRequestsCount3((value) => value + 1);
            const response = {
                from: newFrom,
                count: newCount,
                items: Array(newCount)
                    .fill(0)
                    .map((_, index) => ({ id: index + newFrom, name: `Name ${index + newFrom}` })),
            };

            console.log('request #3:', request);
            console.log('response #3:', response);
            return response;
        },
    }, []);

    const [requests4, setRequestsCount4] = useState(0);
    const [value4, onValueChange4] = useState<DataSourceState>({});
    const dataSource4 = useLazyDataSource<Item, string, DataQueryFilter<Item>>({
        api: async (request) => {
            const { count, from } = request.range;
            setRequestsCount4((value) => value + 1);
            const response = {
                items: Array(count)
                    .fill(0)
                    .map((_, index) => ({ id: index + from, name: `Name ${index + from}` })),
            };

            console.log('request #4:', request);
            console.log('response #4:', response);
            return response;
        },
    }, []);
    
    return (
        <>
            <DataSourceViewer
                exampleTitle={
                    `count: 30.\nWill request maximum 30 elements.\nNumber of requests: ${requests1}`
                }
                value={ value1 }
                onValueChange={ onValueChange1 }
                dataSource={ dataSource1 }
            />
            <DataSourceViewer
                exampleTitle={
                    `from: from + 10 at the beginning.\nWill make requests while scrolling.\nNumber of requests: ${requests2}`
                }
                value={ value2 }
                onValueChange={ onValueChange2 }
                dataSource={ dataSource2 }
            />
            <DataSourceViewer
                exampleTitle={
                    `from: 0, count: 50.\nWill request only 50 elements once.\nNumber of requests: ${requests3}`
                }
                value={ value3 }
                onValueChange={ onValueChange3 }
                dataSource={ dataSource3 }
            />
            <DataSourceViewer
                exampleTitle={
                    `Without count and from.\nWill make requests while scrolling.\nNumber of requests: ${requests4}`
                }
                value={ value4 }
                onValueChange={ onValueChange4 }
                dataSource={ dataSource4 }
            />
        </>
    );
}
