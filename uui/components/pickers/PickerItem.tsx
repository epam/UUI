import * as React from 'react';
import { DataRowProps } from '@epam/uui-core';
import { AvatarProps } from '@epam/uui-components';
import { FlexCell, FlexRow } from '../layout/FlexItems';
import { Text, TextPlaceholder } from '../typography';
import { Avatar } from '../widgets';
import { SizeMod } from '../types';
import css from './PickerItem.scss';

const defaultSize = '36';

export interface PickerItemProps<TItem, TId> extends DataRowProps<TItem, TId>, SizeMod {
    avatarUrl?: string;
    title?: string;
    subtitle?: string;
}

export class PickerItem<TItem, TId> extends React.Component<PickerItemProps<TItem, TId>> {
    getAvatarSize = (size: string, isMultiline: boolean): string | number => {
        return isMultiline ? size : +size - 6;
    };

    render() {
        const { size, avatarUrl, title, subtitle, isLoading, isDisabled } = this.props;
        const itemSize = size && size !== 'none' ? size : defaultSize;
        const isMultiline = !!(title && subtitle);

        return (
            <FlexCell width="auto" cx={css.root}>
                <FlexRow size={itemSize} cx={isMultiline && css[`multiline-vertical-padding-${itemSize}`]} spacing="12">
                    {avatarUrl && (
                        <Avatar
                            isLoading={isLoading}
                            img={avatarUrl}
                            size={this.getAvatarSize(itemSize, isMultiline).toString() as AvatarProps['size']}
                        />
                    )}
                    <FlexCell width="auto">
                        {title && (
                            <Text size={itemSize} cx={css.text} color={isDisabled ? 'disabled' : 'primary'}>
                                {isLoading ? <TextPlaceholder wordsCount={2} /> : title}
                            </Text>
                        )}
                        {subtitle && (
                            <Text size={itemSize} color="disabled" cx={css.text}>
                                {isLoading ? <TextPlaceholder wordsCount={2} /> : subtitle}
                            </Text>
                        )}
                    </FlexCell>
                </FlexRow>
            </FlexCell>
        );
    }
}
