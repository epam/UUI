import * as React from 'react';
import { IEditable, IHasIcon, Icon, cx, ArrayDataSource, DataRowProps } from '@epam/uui';
import { IconContainer } from '@epam/uui-components';
import { Button, DataPickerRow, IconButton, PickerInput, Text, Tooltip } from '../../components';
import { SizeInfo } from '../editors';
import * as css from './IconPicker.scss';
import { IconList } from '@epam/assets/icons/helpers';
import * as infoIcon from '@epam/assets/icons/common/notification-help-fill-18.svg';

interface IconPickerProps extends IEditable<IHasIcon> {
    icons: IconList<Icon>[];
    enableInfo?: boolean;
}

interface IconPickerState {
    iconId?: string;
    iconName?: string;
}

export class IconPicker extends React.Component<IconPickerProps, IconPickerState> {
    state: IconPickerState = {};

    renderItem(item: IconList<Icon>) {
        let itemText;

        if (item.parentId) {
            itemText = <>
                <Text size='18' fontSize='14' cx={ css.itemName }>{ item.size }</Text>
                <Text size='18' color='gray80'>{ item.name }</Text>
            </>;
        } else {
            itemText = <Text cx={ css.itemName }>{ item.name }</Text>;
        }

        return <div key={ item.id } className={ css.item }>
            <IconContainer icon={ item.icon } cx={ cx(css.itemIcon, !item.parentId && css.customSize) }/>
            <div className={ css.itemText } onClick={ e => e.stopPropagation() }>{ itemText }</div>
        </div>;
    }

    renderTooltip() {
        return <div className={ css.contentTooltip }>
            <SizeInfo
                size={ (this.props as any).size || '36' }
                caption={ (this.props as any).caption || '' }
                showHorizontalHighlight={ true }
            />
        </div>;
    }

    renderInfo() {
        return <div className={ css.infoContainer }>
            <Tooltip cx={ css.tooltip } placement='top' content={ this.renderTooltip() } color='gray90'>
                <IconButton icon={ infoIcon }  color='gray60'/>
            </Tooltip>
        </div>;
    }

    dataSource = new ArrayDataSource({
        items: this.props.icons,
    });

    handleClear = () => {
        this.props.onValueChange(null);
        this.setState({ iconId: null });
    }

    render() {
        let icons: { [key: string]: IconList<Icon> } = {};
        this.props.icons.forEach(icon => {
            icons[icon.id] = icon;
        });

        return <div className={ css.container }>
            <div className={ css.selectContainer }>
                <PickerInput<any, string>
                    selectionMode='single'
                    value={ this.state.iconId }
                    onValueChange={ (id: string) => { this.props.onValueChange(icons[id].icon as any); this.setState({ iconId: id, iconName: icons[id].parentId }); } }
                    dataSource={ this.dataSource }
                    searchPosition='body'
                    renderToggler={ props => <Button
                        { ...props }
                        placeholder={ this.props.value ? this.state.iconName : 'Select icon' }
                        icon={ this.props.value as any }
                        fill="none"
                        color='gray50'
                        size='24'
                        onClear={ this.props.value && this.handleClear }
                    /> }
                    renderRow={ (props: DataRowProps<any, string>) => <DataPickerRow { ...props } key={ props.id } size='48' renderItem={ this.renderItem }/> }
                    getRowOptions={ item => ({ isSelectable: item.parentId }) }
                />
                { this.props.enableInfo && this.renderInfo() }
            </div>
        </div>;
    }
}