import { demoData } from '@epam/uui-docs';
import { DataQueryFilter } from '../../../../types';
import { ArrayDataSource, ArrayDataSourceProps } from '../../ArrayDataSource';
import { LocationItem } from './types';

type Props<TItem, TId, TFilter> = Partial<ArrayDataSourceProps<TItem, TId, TFilter>>;

export function getArrayLocationsDS(props: Props<LocationItem, string, DataQueryFilter<LocationItem>>) {
    return new ArrayDataSource({
        items: demoData.locations,
        getId: ({ id }) => id,
        getParentId: ({ parentId }) => parentId,

        ...props,
    });
}
