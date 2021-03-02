import * as React from 'react';
import { IEditable, IHasIcon, ArrayDataSource, DataRowProps, Icon, cx } from '@epam/uui';
import * as css from './IconPicker.scss';
import { Button, Text, PickerInput, DataPickerRow, IconButton, Tooltip } from '../../components';
import { IconContainer } from '@epam/uui-components';
import { SizeInfo } from './SizeInfo';
import { IconList } from '@epam/assets/icons/helpers';
import * as infoIcon from '../../components/icons/notification-help-fill-12.svg';

interface IconPickerProps extends IEditable<IHasIcon> {
    icons: IconList<Icon>[];
    enableInfo?: boolean;
}

export class IconPicker extends React.Component<IconPickerProps, any> {
    state: any = {
        iconId: null,
    };

    renderItem(item: IconList<Icon>) {
        let itemText;

        if (item.parentId) {
            itemText = <>
                <Text size='18' fontSize='14' cx={ css.itemName }>{ item.size }</Text>
                <Text size='18' color='night400'>{ item.name }</Text>
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
        <Text fontSize='12' font='sans-semibold' color='sky' cx={ css.infoText }>I don't know what icon size use.</Text>
        <Tooltip cx={ css.tooltip } placement='top' content={ this.renderTooltip() } color='night100'>
            <IconButton icon={ infoIcon } color='sky'/>
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
                    onValueChange={ (id: string) => { this.props.onValueChange(icons[id].icon as any); this.setState({iconId: id}); } }
                    dataSource={ this.dataSource }
                    searchPosition='body'
                    renderToggler={ props => <Button
                        { ...props }
                        placeholder={ this.props.value ? '' : 'Select icon' }
                        icon={ this.props.value as any }
                        shape="square"
                        fill="none"
                        size='24'
                        onClear={ this.handleClear }
                    /> }
                    renderRow={ (props: DataRowProps<any, string>) => <DataPickerRow key={ props.id } size='48' renderItem={ this.renderItem }  { ...props } /> }
                    getRowOptions={ item => ({ isSelectable: item.parentId }) }
                />
                { this.props.enableInfo && this.renderInfo() }
            </div>
        </div>;
    }
}