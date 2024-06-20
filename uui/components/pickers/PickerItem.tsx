import * as React from 'react';
import { DataRowProps, DataSourceState, Icon } from '@epam/uui-core';
import { AvatarProps, IconContainer } from '@epam/uui-components';
import { FlexCell, FlexRow, FlexRowProps } from '../layout';
import { Text, TextPlaceholder, TextProps } from '../typography';
import { Avatar } from '../widgets';
import { getHighlightedSearchMatches } from './highlight';
import { settings } from '../../settings';
import css from './PickerItem.module.scss';

export interface PickerItemProps<TItem, TId> extends DataRowProps<TItem, TId> {
    /**
     * Defines component size.
     */
    size?: '24' | '30' | '36' | '42' | '48';
    /** Path to the user avatar.
     * If omitted, no avatar will be rendered.
     * * */
    avatarUrl?: string;
    /** Icon to render in picker row.
     * If omitted, nothing will be rendered.
     * */
    icon?: Icon;
    /** Row title */
    title?: string;
    /** Row subtitle. Will be rendered as a second line, below the title */
    subtitle?: string;
    /** DataSourceState of the Picker.
     * Usually provided via renderItem callback params
     * */
    dataSourceState?: DataSourceState;
    /**
     * Enables highlighting of the items' text with search-matching results.
     * @default true
     * */
    highlightSearchMatches?: boolean;
}

export function PickerItem<TItem, TId>(props: PickerItemProps<TItem, TId>) {
    const {
        highlightSearchMatches = true,
        size, avatarUrl, isLoading, isDisabled, icon, cx,
    } = props;

    const itemSize = size || settings.sizes.defaults.pickerItem as PickerItemProps<any, any>['size'];
    const isMultiline = !!(props.title && props.subtitle);

    const { search } = props.dataSourceState ?? {};
    const title = highlightSearchMatches ? getHighlightedSearchMatches(props.title, search) : props.title;
    const subtitle = highlightSearchMatches ? getHighlightedSearchMatches(props.subtitle, search) : props.subtitle;

    return (
        <FlexCell width="auto" cx={ [css.root, 'uui-typography', cx] }>
            <FlexRow
                size={ itemSize as FlexRowProps['size'] }
                cx={ isMultiline && [css.multiline, css[`vertical-padding-${itemSize}`]] }
                columnGap="12"
            >
                { avatarUrl && (
                    <Avatar
                        isLoading={ isLoading }
                        img={ avatarUrl }
                        size={ getAvatarSize(itemSize, isMultiline).toString() as AvatarProps['size'] }
                    />
                ) }
                { icon && <IconContainer icon={ icon } /> }
                <FlexCell width="auto">
                    { title && (
                        <Text size={ itemSize as TextProps['size'] } cx={ css.text } color={ isDisabled ? 'disabled' : 'primary' }>
                            { isLoading ? <TextPlaceholder wordsCount={ 2 } /> : title }
                        </Text>
                    ) }
                    { subtitle && (
                        <Text size={ itemSize as TextProps['size'] } color={ isDisabled ? 'disabled' : 'secondary' } cx={ css.text }>
                            { isLoading ? <TextPlaceholder wordsCount={ 2 } /> : subtitle }
                        </Text>
                    ) }
                </FlexCell>
            </FlexRow>
        </FlexCell>
    );
}

function getAvatarSize(size: PickerItemProps<any, any>['size'], isMultiline: boolean): string | number {
    return settings.sizes.pickerItem.avatar[isMultiline ? 'multiline' : 'rest'][size];
}
