import { Component } from 'react';
import { AcceptDropParams, DropParams, getOrderBetween, IModal, Lens, DataColumnProps, ColumnsConfig } from '@epam/uui';

interface ColumnsConfigurationModalBaseProps<TItem, TId>
    extends IModal<ColumnsConfig> {
    columns: DataColumnProps<TItem, TId>[];
    columnsConfig?: ColumnsConfig;
    defaultConfig?: ColumnsConfig;
}

interface ColumnsConfigurationModalBaseState {
    columnsConfig: ColumnsConfig;
}

export abstract class ColumnsConfigurationModalBase<TItem, TId> extends Component<ColumnsConfigurationModalBaseProps<TItem, TId>, ColumnsConfigurationModalBaseState> {
    state = { columnsConfig: this.props.columnsConfig || this.props.defaultConfig };

    stateLens = Lens.onState<ColumnsConfigurationModalBaseState>(this);

    columnsLens = this.stateLens.prop('columnsConfig');

    modalWindowWidth = Math.ceil(this.props.columns.length / 13) * 325;

    handleMarkAllAsChecked = () => {
        const colConf = this.props.columns.reduce<ColumnsConfig>((config, column) => ({
           ...config,
           [column.key]: {
               ...config[column.key],
               isVisible: true,
               order: this.state.columnsConfig[column.key].order
           }
        }), {});

        this.setState({ columnsConfig: colConf });
    }

    handleMarkAllAsUnchecked = () => {
        const colConf = this.props.columns.reduce<ColumnsConfig>((config, column) => ({
            ...config,
            [column.key]: {
                ...config[column.key],
                isVisible: column.isAlwaysVisible || !!column.fix,
                order: this.state.columnsConfig[column.key].order
            }
        }), {});

        this.setState({ columnsConfig: colConf });
    }

    handleCanAcceptDrop = (props: AcceptDropParams<DataColumnProps<TItem, TId>, DataColumnProps<TItem, TId>>) => {
        if (props.srcData.fix) return {};

        if (props.dstData?.fix) {
            return props.dstData.fix === "left" ? { bottom: true } : { top: true };
        }

        return { top: true, bottom: true };
    }

    onDrop = (params: DropParams<DataColumnProps<TItem, TId>, DataColumnProps<TItem, TId>>, prevColumnOrder: string, nextColumnOrder: string) => {
        const draggedColumn = this.state.columnsConfig[params.srcData.key];

        const newOrder = params.position === 'bottom'
            ? getOrderBetween(this.state.columnsConfig[params.dstData.key].order, nextColumnOrder)
            : getOrderBetween(prevColumnOrder, this.state.columnsConfig[params.dstData.key].order);

        this.setState({
            columnsConfig: {
                ...this.state.columnsConfig,
                [params.srcData.key]: {
                    ...draggedColumn,
                    order: newOrder
                }
            }
        });
    }
}