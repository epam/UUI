import {
    IEditable, DataSourceState, IDataSource, PickerBaseProps,
} from '@epam/uui-core';

export type PickerBindingProps<TItem, TId> = SinglePickerProps<TId, TItem> | ArrayPickerProps<TId, TItem>;

export type PickerBindingValueType = 'scalar' | 'array';

export type SinglePickerProps<TId, TItem> =
    | ({ selectionMode: 'single'; valueType: 'id' } & IEditable<TId>)
    | ({ selectionMode: 'single'; valueType?: 'entity' } & IEditable<TItem>);
export type ArrayPickerProps<TId, TItem> =
    | ({ selectionMode: 'multi'; valueType: 'id'; emptyValue?: [] | null } & IEditable<TId[]>)
    | ({ selectionMode: 'multi'; valueType: 'entity'; emptyValue?: [] | null } & IEditable<TItem[]>);

interface PickerBindingHelper<TItem, TId> {
    dataSourceStateToValue(dsState: DataSourceState<any, TId>, props: PickerBaseProps<TId, TItem>, dataSource: IDataSource<TItem, TId, any>): any;
    applyValueToDataSourceState(
        dsState: DataSourceState<any, TId>,
        value: any,
        props: PickerBaseProps<TId, TItem>,
        dataSource: IDataSource<TItem, TId, any>
    ): DataSourceState<any, TId>;
}

class ArrayBindingHelper<TItem, TId> implements PickerBindingHelper<TItem, TId> {
    emptyValueArray: any[] = [];
    dataSourceStateToValue(dsState: DataSourceState<any, TId>, props: PickerBaseProps<TId, TItem>, dataSource: IDataSource<TItem, TId, any>) {
        if (props.valueType === 'entity') {
            return dsState.checked?.map((id) => dataSource && dataSource.getById(id));
        }
        return dsState.checked;
    }

    applyValueToDataSourceState(
        dsState: DataSourceState<any, TId>,
        value: any,
        props: PickerBaseProps<TId, TItem>,
        dataSource: IDataSource<TItem, TId, any>,
    ): DataSourceState<any, TId> {
        let checked = (Array.isArray(value) && value) || this.emptyValueArray;
        if (props.valueType === 'entity') {
            checked = value?.map((entity: any) => {
                dataSource && dataSource.setItem(entity);
                return dataSource && dataSource.getId(entity);
            });
        }

        return {
            ...dsState,
            selectedId: null,
            checked: checked,
            filter: props.filter || dsState.filter,
            sorting: props.sorting ? [props.sorting] : dsState.sorting,
        };
    }
}

class ScalarBindingHelper<TItem, TId> implements PickerBindingHelper<TItem, TId> {
    dataSourceStateToValue(dsState: DataSourceState<any, TId>, props: PickerBaseProps<TId, TItem>, dataSource: IDataSource<TItem, TId, any>) {
        if (dsState.selectedId != null && props.valueType === 'entity') {
            return dataSource && dataSource.getById(dsState.selectedId);
        }

        return dsState.selectedId;
    }

    applyValueToDataSourceState(
        dsState: DataSourceState<any, TId>,
        value: any,
        props: PickerBaseProps<TId, TItem>,
        dataSource: IDataSource<TItem, TId, any>,
    ): DataSourceState<any, TId> {
        let selectedId = value;

        if (value && props.valueType === 'entity' && dataSource) {
            dataSource.setItem(value);
            selectedId = dataSource.getId(value);
        }

        return {
            ...dsState,
            selectedId: selectedId,
            checked: null,
            filter: props.filter || dsState.filter,
            sorting: props.sorting ? [props.sorting] : dsState.sorting,
        };
    }
}

const lookup: Record<string, PickerBindingHelper<any, any>> = {
    multi: new ArrayBindingHelper(),
    single: new ScalarBindingHelper(),
};

export function dataSourceStateToValue<TId, TItem>(props: any, dsState: DataSourceState<any, TItem>, dataSource: IDataSource<TItem, TId, any>): any {
    return lookup[props.selectionMode].dataSourceStateToValue(dsState, props, dataSource);
}

export function applyValueToDataSourceState<TId, TItem>(
    props: any,
    dsState: DataSourceState<any, TItem>,
    value: any,
    dataSource: IDataSource<TItem, TId, any>,
): DataSourceState<TItem, any> {
    return lookup[props.selectionMode].applyValueToDataSourceState(dsState, value, props, dataSource);
}
