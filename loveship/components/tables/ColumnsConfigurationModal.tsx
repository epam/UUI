import React from 'react';
import sortBy from 'lodash.sortby';
import { DataColumnProps, DndActor } from '@epam/uui';
import { ColumnsConfigurationModalBase, DragHandle } from '@epam/uui-components';
import { ModalBlocker, ModalWindow, ModalFooter, FlexSpacer, Button, Panel, Checkbox, LinkButton, ModalHeader,
    ScrollBars, FlexRow, DropMarker } from '../';
import * as styles from './ColumnsConfigurationModal.scss';
import { i18n } from '../../i18n';

export class ColumnsConfigurationModal<TItem> extends ColumnsConfigurationModalBase<TItem> {
    renderDndRow = (column: DataColumnProps<TItem>, prevColumn: string, nextColumn: string) => {
        return <DndActor<DataColumnProps<TItem>, DataColumnProps<TItem>>
            key={ column.key }
            srcData={ column }
            dstData={ column }
            canAcceptDrop={ this.handleCanAcceptDrop }
            onDrop={ params => this.onDrop(params, prevColumn, nextColumn) }
            render={ props => {
                return <div { ...props.eventHandlers } className={ styles.dragElement }>
                    <div className={ styles.dndItem }>
                        <FlexRow background="white">
                            <DragHandle cx={ [styles.dragHandle] } />
                            <Checkbox
                                key={ column.key }
                                label={ column.caption }
                                { ...this.columnsLens.prop(column.key).prop('isVisible').toProps() }
                                isDisabled={ column.isAlwaysVisible || !!column.fix }
                            />
                        </FlexRow>
                    </div>
                    <DropMarker { ...props } />
                </div>;
            } }
        />;
    }

    render() {
        let { ...modalProps } = this.props;
        let { columns } = this.props;
        const sortedColumns = sortBy(columns, i => this.state.columnsConfig[i.key].order);

        let widthForModal = this.modalWindowWidth > 600 ? this.modalWindowWidth : 600;

        return (
            <ModalBlocker blockerShadow="dark" { ...modalProps }>
                <ModalWindow width="600" height="auto" style={ { width: `${widthForModal}px` } }>
                    <Panel background="white" cx={ styles.container }>
                        <ModalHeader borderBottom title={ i18n.tables.columnsConfigurationModal.configureColumnsTitle } onClose={ () => modalProps.abort() }/>
                        <ScrollBars>
                            <div className={ styles.checkboxContainer }>
                                { /*TODO: use ArrayDataSource(or Picker) for search*/ }
                                { sortedColumns
                                    .filter(column => !!column.caption)
                                    .map((item, index) => {
                                        let prevItem = index ? sortedColumns[index - 1] : null;
                                        let nextItem = index === sortedColumns.length - 1 ? null : sortedColumns[index + 1];
                                        return this.renderDndRow(
                                            item,
                                            prevItem && this.state.columnsConfig[prevItem.key].order,
                                            nextItem && this.state.columnsConfig[nextItem.key].order,
                                        );
                                    }) }
                            </div>
                        </ScrollBars>
                        <ModalFooter borderTop>
                            <FlexSpacer />
                            <LinkButton cx={ styles.actionLinkButton } caption={ i18n.tables.columnsConfigurationModal.checkAllButton } color="sky" onClick={ this.handleMarkAllAsChecked }/>
                            <LinkButton cx={ styles.actionLinkButton } caption={ i18n.tables.columnsConfigurationModal.uncheckAllButton } color="sky" onClick={ this.handleMarkAllAsUnchecked }/>
                            <Button cx={ styles.actionButton } caption={ i18n.tables.columnsConfigurationModal.applyButton } color="grass" onClick={ () => modalProps.success(this.state.columnsConfig) }/>
                        </ModalFooter>
                    </Panel>
                </ModalWindow>
            </ModalBlocker>
        );
    }
}
