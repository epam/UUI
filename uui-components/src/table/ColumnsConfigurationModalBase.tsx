import * as React from 'react';
import { AcceptDropParams, DropParams, getOrderBetween, IModal, Lens, DataColumnProps, ColumnsConfig } from '@epam/uui';

interface ColumnsConfigurationModalBaseProps<T>
    extends IModal<ColumnsConfig> {
    columns: DataColumnProps<T>[];
    columnsConfig?: ColumnsConfig;
    defaultConfig?: ColumnsConfig;
}

interface ColumnsConfigurationModalBaseState {
    columnsConfig: ColumnsConfig;
}

export abstract class ColumnsConfigurationModalBase<TItem> extends React.Component<ColumnsConfigurationModalBaseProps<TItem>, ColumnsConfigurationModalBaseState> {
    state = {
        columnsConfig: this.props.columnsConfig || this.props.defaultConfig,
    };

    stateLens = Lens.onState<ColumnsConfigurationModalBaseState>(this);

    columnsLens = this.stateLens.prop('columnsConfig');

    modalWindowWidth = Math.ceil(this.props.columns.length / 13) * 325;

    handleMarkAllAsChecked = () => {
        let colConf: ColumnsConfig = {};

        this.props.columns.forEach((item: any) => {
            colConf[item.key] = { isVisible: true, order: this.state.columnsConfig[item.key].order };
        });
        this.setState({ columnsConfig: colConf });
    }

    handleMarkAllAsUnchecked = () => {
        let colConf: ColumnsConfig = {};

        this.props.columns.forEach(item => {
            let order = this.state.columnsConfig[item.key].order;
            colConf[item.key] =  { isVisible: item.isAlwaysVisible || !!item.fix, order: order };
        });
        this.setState({ columnsConfig: colConf });
    }

    handleCanAcceptDrop = (props: AcceptDropParams<DataColumnProps<TItem>, DataColumnProps<TItem>>) => {
        if (props.srcData.fix) {
            return {};
        }

        if (props.dstData && props.dstData.fix) {
            return props.dstData.fix === "left" ? { bottom: true } : { top: true };
        }

        return {
            top: true,
            bottom: true,
        };
    }

    onDrop = (params: DropParams<DataColumnProps<TItem>, DataColumnProps<TItem>>, prevColumnOrder: string, nextColumnOrder: string) => {
        const draggedColumn = this.state.columnsConfig[params.srcData.key];

        let newOrder = params.position === 'bottom'
                       ? getOrderBetween(this.state.columnsConfig[params.dstData.key].order, nextColumnOrder)
                       : getOrderBetween(prevColumnOrder, this.state.columnsConfig[params.dstData.key].order);

        this.setState({ columnsConfig: { ...this.state.columnsConfig, [params.srcData.key]: { ...draggedColumn, order: newOrder } } });
    }
}