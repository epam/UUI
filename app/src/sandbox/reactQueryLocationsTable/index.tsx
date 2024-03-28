import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { LocationsTable } from './LocationsTable';

const queryClient = new QueryClient();

export function ReactQueryLocationsTable() {
    return (
        <QueryClientProvider client={ queryClient }>
            <LocationsTable />
        </QueryClientProvider>
    );
}
