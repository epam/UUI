import * as React from 'react';
import { IPropDocEditor } from '@epam/uui-docs';
import { IEditable, IHasIcon, Icon, cx, ArrayDataSource } from '@epam/uui-core';
import { IconContainer } from '@epam/uui-components';
import { Button, DataPickerRow, IconButton, PickerInput, Text, Tooltip } from '@epam/uui';
import { SizeInfo } from './SizeInfo';
import { IconList } from '../../../../../documents/iconListHelpers';

import css from './IconPicker.module.scss';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/notification-help-fill-18.svg';

export function IconPickerWithInfo(props: IPropDocEditor) {
    const { value, onValueChange } = props;
    const examples = props.examples?.map((ex) => ex.value);
    const editable = { value, onValueChange };
    return (
        <IconPickerInner icons={ examples } { ...editable } enableInfo={ true } />
    );
}

interface IconPickerInnerProps extends IEditable<IHasIcon> {
    icons: IconList<Icon>[];
    enableInfo?: boolean;
}

interface IconPickerInnerState {
    iconId?: string;
    iconName?: string;
}

class IconPickerInner extends React.Component<IconPickerInnerProps, IconPickerInnerState> {
    state: IconPickerInnerState = {};
    renderItem(item: IconList<Icon>) {
        let itemText;

        if (item.parentId) {
            itemText = (
                <>
                    <Text size="18" fontSize="14" cx={ css.itemName }>
                        {item.size}
                    </Text>
                    <Text size="18" color="secondary">
                        {item.name}
                    </Text>
                </>
            );
        } else {
            itemText = <Text cx={ css.itemName }>{item.name}</Text>;
        }

        return (
            <div key={ item.id } className={ css.item }>
                <IconContainer icon={ item.icon } cx={ cx(css.itemIcon, !item.parentId && css.customSize) } />
                <div className={ css.itemText } onClick={ (e) => e.stopPropagation() }>
                    {itemText}
                </div>
            </div>
        );
    }

    renderTooltip() {
        return (
            <div className={ css.contentTooltip }>
                <SizeInfo size={ (this.props as any).size || '36' } caption={ (this.props as any).caption || '' } showHorizontalHighlight={ true } />
            </div>
        );
    }

    renderInfo() {
        return (
            <div className={ css.infoContainer }>
                <Tooltip maxWidth={ 600 } placement="top" content={ this.renderTooltip() }>
                    <IconButton icon={ InfoIcon } color="neutral" />
                </Tooltip>
            </div>
        );
    }

    dataSource = new ArrayDataSource({
        items: this.props.icons,
    });

    handleClear = () => {
        this.props.onValueChange(undefined);
        this.setState({ iconId: null });
    };

    render() {
        const icons: { [key: string]: IconList<Icon> } = {};
        this.props.icons.forEach((icon) => {
            icons[icon.id] = icon;
        });

        return (
            <div className={ css.container }>
                <div className={ css.selectContainer }>
                    <PickerInput<any, string>
                        selectionMode="single"
                        value={ this.state.iconId }
                        onValueChange={ (id: string | undefined) => {
                            if (typeof id === 'undefined') {
                                this.handleClear();
                                return;
                            }

                            this.props.onValueChange(icons[id].icon as IHasIcon);
                            this.setState({ iconId: id, iconName: icons[id].parentId });
                        } }
                        dataSource={ this.dataSource }
                        searchPosition="body"
                        renderToggler={ (props) => (
                            <Button
                                { ...props }
                                caption={ this.props.value ? this.state.iconName : 'Select icon' }
                                icon={ this.props.value as any }
                                fill="none"
                                color="primary"
                                size="24"
                                onClear={ this.props.value && this.handleClear }
                            />
                        ) }
                        renderRow={ (props) => <DataPickerRow { ...props } key={ props.id } size="48" renderItem={ this.renderItem } /> }
                        getRowOptions={ (item) => ({ isSelectable: item.parentId }) }
                    />
                    {this.props.enableInfo && this.renderInfo()}
                </div>
            </div>
        );
    }
}
