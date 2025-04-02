import { useLayoutEffect, useState } from 'react';
import { DataSourceState } from '@epam/uui-core';

interface UseShowSelectedProps {
    dataSourceState: DataSourceState;
}

export function useShowSelected(props: UseShowSelectedProps) {
    const [showSelected, setShowSelected] = useState<boolean>(false);

    useLayoutEffect(() => {
        if (showSelected && (!props.dataSourceState.checked?.length || props.dataSourceState.search)) {
            setShowSelected(false);
        }
    }, [props.dataSourceState.checked, props.dataSourceState.search, showSelected]);

    return {
        showSelected,
        setShowSelected,
    };
}
