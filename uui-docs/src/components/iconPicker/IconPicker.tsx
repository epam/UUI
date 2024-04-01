import * as React from 'react';
import { Icon, cx, ArrayDataSource } from '@epam/uui-core';
import { IconContainer } from '@epam/uui-components';
import { DataPickerRow, FlexRow, PickerInput, Text } from '@epam/uui';
import css from './IconPicker.module.scss';
import { useMemo } from 'react';

type TIconParams = { id: string, name: string, icon: Icon };
type IconPickerValueExtended = { id: string; name?: string; icon?: Icon } | undefined;

interface IconPickerInnerProps {
    /** icon id */
    value: string;
    onValueChange: (newValue: IconPickerValueExtended) => void
    icons: TIconParams[];
    enableInfo?: boolean;
}

export function IconPickerWithInfo(props: IconPickerInnerProps) {
    const icons = useMemo(() => {
        return props.icons.reduce<{ [key: string]: TIconParams }>((acc, icon) => {
            acc[icon.id] = icon;
            return acc;
        }, {});
    }, [props.icons]);

    const renderItem = (item: TIconParams) => {
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
    };

    const valueNorm: IconPickerValueExtended | undefined = useMemo(() => {
        const iconId = props.value;
        if (iconId != null) {
            const iconObj = icons?.[iconId];
            if (iconObj) {
                return {
                    id: iconObj.id,
                    icon: iconObj.icon,
                    name: iconObj.name,
                };
            }
            return {
                id: iconId,
            };
        }
    }, [props.value, icons]);

    return (
        <div className={ css.container }>
            <div className={ css.selectContainer }>
                <PickerInput
                    dataSource={ dataSource }
                    size="24"
                    icon={ valueNorm?.icon }
                    selectionMode="single"
                    placeholder="Select icon"
                    searchPosition="body"
                    value={ valueNorm?.id }
                    onValueChange={ (id: string | undefined) => {
                        if (typeof id === 'undefined') {
                            handleClear();
                            return;
                        }
                        props.onValueChange({ id, name: icons[id].name, icon: icons[id].icon });
                    } }
                    renderRow={ (props) => <DataPickerRow { ...props } padding="12" key={ props.id } renderItem={ renderItem } /> }
                />
            </div>
        </div>
    );
}
