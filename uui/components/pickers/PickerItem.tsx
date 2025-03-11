import * as React from 'react';
import cx from 'classnames';
import { DataRowProps, DataSourceState, Icon, Overwrite } from '@epam/uui-core';
import { IconContainer } from '@epam/uui-components';
import { FlexCell, FlexRow } from '../layout';
import { Avatar } from '../widgets';
import { getHighlightedSearchMatches } from './highlight';
import { settings } from '../../settings';

import css from './PickerItem.module.scss';

export interface PickerItemModsOverride {}

interface PickerItemMods {
    /**
     * Defines component size.
     */
    size?: '24' | '30' | '36' | '42' | '48';
}

export interface PickerItemProps<TItem, TId> extends Overwrite<PickerItemMods, PickerItemModsOverride>,
    DataRowProps<TItem, TId> {
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
        size, avatarUrl, isLoading, isDisabled, icon,
    } = props;

    const itemSize = size || settings.pickerInput.sizes.body.row;
    const isMultiline = !!(props.title && props.subtitle);

    const { search } = props.dataSourceState ?? {};
    const title = highlightSearchMatches ? getHighlightedSearchMatches(props.title, search) : props.title;
    const subtitle = highlightSearchMatches ? getHighlightedSearchMatches(props.subtitle, search) : props.subtitle;

    return (
        <FlexCell width="auto" cx={ [css.root, 'uui-picker_input-item', 'uui-typography', props.cx] }>
            <FlexRow
                size={ itemSize }
                cx={ [isMultiline && css.multiline, css.columnGap] }
                rawProps={ { style: { '--uui-picker_item-vertical-padding': `${settings.pickerInput.sizes.body.itemVerticalPaddingMap[itemSize]}px` } as React.CSSProperties } }
            >
                { avatarUrl && (
                    <Avatar
                        isLoading={ isLoading }
                        img={ avatarUrl }
                        size={ getAvatarSize(itemSize, isMultiline) }
                    />
                ) }
                { icon && <IconContainer icon={ icon } /> }
                <FlexCell width="auto">
                    { title && (
                        <div className={ cx(css.title, isDisabled && css.disabled, `uui-size-${itemSize}`) }>
                            { title }
                        </div>
                    ) }
                    { subtitle && (
                        <div className={ cx(css.subtitle, isDisabled && css.disabled, `uui-size-${itemSize}`) }>
                            { subtitle }
                        </div>
                    ) }
                </FlexCell>
            </FlexRow>
        </FlexCell>
    );
}

function getAvatarSize(size: PickerItemProps<unknown, unknown>['size'], isMultiline: boolean) {
    return settings.pickerInput.sizes.body[isMultiline ? 'itemAvatarMultilineMap' : 'itemAvatarMap'][size];
}
