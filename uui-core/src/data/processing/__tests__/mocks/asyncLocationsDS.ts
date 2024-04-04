import { demoData } from '@epam/uui-docs';
import { getAsyncDataSourceMock } from '@epam/uui-test-utils';
import { DataQueryFilter } from '../../../../types';
import { AsyncDataSourceProps } from '../../AsyncDataSource';
import { LocationItem } from './types';

type Props<TItem, TId, TFilter> = Partial<AsyncDataSourceProps<TItem, TId, TFilter>>;

export function getAsyncLocationsDS(props: Props<LocationItem, string, DataQueryFilter<LocationItem>>) {
    return getAsyncDataSourceMock(
        demoData.locations,
        {
            getId: ({ id }) => id,
            getParentId: ({ parentId }) => parentId,
            getSearchFields: ({ name }) => [name],

            ...props,
        },
    );
}
