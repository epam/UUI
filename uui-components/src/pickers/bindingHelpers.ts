import { IEditable, DataSourceState, IDataSource } from '@epam/uui';
import { PickerBaseProps } from "./PickerBase";

export type PickerBindingProps<TItem, TId> =
    (SinglePickerProps<TId, TItem> | ArrayPickerProps<TId, TItem>);

export type PickerBindingValueType = 'scalar' | 'array';

export type SinglePickerProps<TId, TItem> = ({ selectionMode: 'single', valueType: 'id'} & IEditable<TId>) | ({ selectionMode: 'single', valueType?: 'entity' } & IEditable<TItem>);
export type ArrayPickerProps<TId, TItem> = ({ selectionMode: 'multi', valueType: 'id', emptyValue?: [] | null } & IEditable<TId[]>)
    | ({ selectionMode: 'multi', valueType: 'entity', emptyValue?: [] | null } & IEditable<TItem[]>);

export interface PickerBindingHelper<TItem, TId, TValue> {
    dataSourceStateToValue(dsState: DataSourceState<any, TId>, props: PickerBaseProps<TId, TItem>, dataSource: IDataSource<TItem, TId, any>): any;
    applyValueToDataSourceState(dsState: DataSourceState<any, TId>, value: any, props: PickerBaseProps<TId, TItem>, dataSource: IDataSource<TItem, TId, any>): DataSourceState<any, TId>;
}

class ArrayBindingHelper<TItem, TId> implements PickerBindingHelper<TItem, TId, TId[]> {
    dataSourceStateToValue(dsState: DataSourceState<any, TId>, props: PickerBaseProps<TId, TItem>, dataSource: IDataSource<TItem, TId, any>) {
        if (dsState && Array.isArray(dsState.checked) && dsState.checked && dsState.checked.length > 0) {
            if (props.valueType === 'entity') {
                return dsState.checked.map(id => dataSource && dataSource.getById(id));
            }
            return dsState.checked;
        } else {
            return props.emptyValue;
        }
    }

    applyValueToDataSourceState(dsState: DataSourceState<any, TId>, value: any, props: PickerBaseProps<TId, TItem>, dataSource: IDataSource<TItem, TId, any>): DataSourceState<any, TId> {
        value = Array.isArray(value) && value || [];
        if (props.valueType === 'entity') {
            value = value.map((entity: any) => { dataSource && dataSource.setItem(entity); return dataSource && dataSource.getId(entity); });
        }

        return {
            ...dsState,
            selectedId: null,
            checked: value,
            filter: props.filter || dsState.filter,
            sorting: props.sorting ? [props.sorting] : dsState.sorting,
        };
    }
}

class ScalarBindingHelper<TItem, TId> implements PickerBindingHelper<TItem, TId, TId> {
    dataSourceStateToValue(dsState: DataSourceState<any, TId>, props: PickerBaseProps<TId, TItem>, dataSource: IDataSource<TItem, TId, any>) {
        if (dsState.selectedId != null && props.valueType === 'entity') {
            return dataSource && dataSource.getById(dsState.selectedId);
        }

        return dsState.selectedId;
    }
    applyValueToDataSourceState(dsState: DataSourceState<any, TId>, value: any, props: PickerBaseProps<TId, TItem>, dataSource: IDataSource<TItem, TId, any>): DataSourceState<any, TId> {
        const id = props.valueType === 'entity' ? (value && value.id) : value;

        if (value && props.valueType === 'entity') {
            dataSource && dataSource.setItem(value);
        }

        return {
            ...dsState,
            selectedId: id,
            checked: null,
            filter: props.filter || dsState.filter,
            sorting: props.sorting ? [props.sorting] : dsState.sorting,
        };
    }
}

const lookup: Record<string, PickerBindingHelper<any, any, any>> = {
    'multi': new ArrayBindingHelper(),
    'single': new ScalarBindingHelper(),
};

export function dataSourceStateToValue<TId, TItem>(props: any, dsState: DataSourceState<any, TItem>, dataSource: IDataSource<TItem, TId, any>): any {
    return lookup[props.selectionMode].dataSourceStateToValue(dsState, props, dataSource);
}

export function applyValueToDataSourceState<TId, TItem>(props: any, dsState: DataSourceState<any, TItem>, value: any, dataSource: IDataSource<TItem, TId, any>): DataSourceState<TItem, any> {
    return lookup[props.selectionMode].applyValueToDataSourceState(dsState, value, props, dataSource);
}
