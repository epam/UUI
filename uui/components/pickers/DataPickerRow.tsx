import * as React from 'react';
import { DataRowProps, DataColumnProps } from '@epam/uui-core';
import { DataPickerRow as UUIDataPickerRow } from '@epam/uui-components';
import { FlexSpacer, IconContainer } from '../layout';
import { DataTableCell } from '../tables';
import { ReactComponent as TickIcon_24 } from '@epam/assets/icons/common/notification-done-24.svg';
import { ReactComponent as TickIcon_18 } from '@epam/assets/icons/common/notification-done-18.svg';
import { ReactComponent as TickIcon_12 } from '@epam/assets/icons/common/notification-done-12.svg';
import css from './DataPickerRow.scss';

export interface DataPickerRowProps<TItem, TId> extends DataRowProps<TItem, TId> {
    renderItem(item: TItem, rowProps: DataRowProps<TItem, TId>): React.ReactNode;
    padding?: '12' | '24';
    size?: 'none' | '24' | '30' | '36' | '42' | '48' | '60';
    borderBottom?: 'none' | 'gray20';
    alignActions?: 'top' | 'center';
}

export class DataPickerRow<TItem, TId> extends React.Component<DataPickerRowProps<TItem, TId>> {
    private getIcon = (size: string) => {
        switch (size) {
            case '24':
                return TickIcon_12;
            case '30':
                return TickIcon_18;
            case '36':
                return TickIcon_18;
            case '42':
                return TickIcon_24;
            default:
                return TickIcon_18;
        }
    };

    column: DataColumnProps<TItem> = {
        key: 'name',
        grow: 1,
        width: 0,
        render: (item, rowProps) => (
            <div key={rowProps.id} className={css.renderItem}>
                {this.props.renderItem(item, rowProps)}
                <FlexSpacer />
                {(rowProps.isChildrenSelected || rowProps.isSelected) && (
                    <div className={css.iconWrapper}>
                        <IconContainer icon={this.getIcon(this.props.size)} cx={rowProps.isChildrenSelected ? css.iconDefault : css.iconPrimary} />
                    </div>
                )}
            </div>
        ),
    };

    renderContent = () => {
        return (
            <DataTableCell
                key="name"
                size={this.props.size || '36'}
                padding={this.props.padding || '24'}
                isFirstColumn={true}
                isLastColumn={false}
                tabIndex={-1}
                column={this.column}
                rowProps={this.props}
                alignActions={this.props.alignActions || 'top'}
            />
        );
    };

    render() {
        return <UUIDataPickerRow {...this.props} cx={[css.pickerRow, this.props.cx]} renderContent={this.renderContent} />;
    }
}
