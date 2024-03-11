import * as React from 'react';
import { IconBase } from '../../types';
import { IEditable, IHasIcon, Icon, cx, ArrayDataSource } from '@epam/uui-core';
import { IconContainer } from '@epam/uui-components';
import { DataPickerRow, FlexRow, PickerInput, Text } from '@epam/uui';
import css from './IconPicker.module.scss';
import { useEffect, useState } from 'react';

interface IconPickerInnerProps extends IEditable<IHasIcon> {
    icons: IconBase<Icon>[];
    enableInfo?: boolean;
}

interface IconPickerInnerState {
    iconId?: string;
    iconName?: string;
    icon?: Icon;
}

export function IconPickerWithInfo(props: IconPickerInnerProps) {
    const [state, setState] = useState<IconPickerInnerState>({
        iconId: null,
        iconName: null,
        icon: null,
    });

    const icons: { [key: string]: IconBase<Icon> } = {};

    useEffect(() => {
        props.icons.forEach((icon) => {
            icons[icon.id] = icon;
        });
    }, [props.icons]);

    const renderItem = (item: IconBase<Icon>) => {
        return (
            <FlexRow key={ item.id } cx={ css.item }>
                <IconContainer icon={ item.icon } size={ 18 } cx={ cx(css.itemIcon) } />
                <div className={ css.itemText }>
                    <Text size="18" color="secondary">
                        { item.name.replace('.svg', '') }
                    </Text>
                </div>
            </FlexRow>
        );
    };

    const dataSource = new ArrayDataSource({
        items: props.icons,
    });

    const handleClear = () => {
        props.onValueChange(undefined);
        setState(() => ({
            iconId: null,
            iconName: null,
            icon: null,
        }));
    };

    return (
        <div className={ css.container }>
            <div className={ css.selectContainer }>
                <PickerInput
                    dataSource={ dataSource }
                    size="24"
                    icon={ state.icon }
                    selectionMode="single"
                    placeholder="Select icon"
                    searchPosition="body"
                    value={ state.iconId }
                    onValueChange={ (id: string | undefined) => {
                        if (typeof id === 'undefined') {
                            handleClear();
                            return;
                        }
                        props.onValueChange(icons[id]?.icon as IHasIcon);
                        setState(() => ({ iconId: id, iconName: icons[id].name, icon: icons[id].icon }));
                    } }
                    renderRow={ (props) => <DataPickerRow { ...props } padding="12" key={ props.id } renderItem={ renderItem } /> }
                />
            </div>
        </div>
    );
}
