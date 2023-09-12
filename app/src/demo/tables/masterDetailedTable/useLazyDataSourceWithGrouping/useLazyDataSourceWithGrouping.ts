import { useMemo } from 'react';
import { GroupingConfigBuilder } from './groupingConfigBuilder';

type Setup<TGroups, TId, TFilter> = (
    configBuilder: GroupingConfigBuilder<TGroups, TId, TFilter>
) => GroupingConfigBuilder<TGroups, TId, TFilter>;

export function useLazyDataSourceWithGrouping<TGroups, TId, TFilter>(
    setup: Setup<TGroups, TId, TFilter>,
    deps: unknown[] = [],
) {
    const config = useMemo(
        () => setup(new GroupingConfigBuilder()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        deps,
    );


}
