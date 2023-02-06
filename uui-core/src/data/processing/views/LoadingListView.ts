import { IEditable, DataSourceState, DataSourceListCounts, DataRowPathItem } from "../../../types";
import { BaseListView } from "./BaseListView";

export class LoadingListView<TId> extends BaseListView<any, any, any> {
    value: DataSourceState<any>;

    constructor(editable: IEditable<DataSourceState<any, any>>, public props: any) {
        super(editable, props);
        this.value = editable.value;
        this.getVisibleRows = this.getVisibleRows.bind(this);
    }

    update(value: any, props: any) {
        this.value = value;
        this.props = props;
    }

    getById(id: TId) {
        return this.getLoadingRow('_loading_' + id);
    }

    getVisibleRows() {
        let result = [];
        for (let i = 0; i < this.value.visibleCount; i++) {
            result.push(this.getLoadingRow('_loading_' + (this.value.topIndex + i)));
        }
        return result;
    }

    getListProps(): DataSourceListCounts {
        return {
            rowsCount: 50,
            exactRowsCount: null,
            knownRowsCount: 50,
        };
    }

    getSelectedRows: () => any = () => {
        return [];
    }
}