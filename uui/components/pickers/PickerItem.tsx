import * as React from 'react';
import { DataRowProps, DataSourceState, Icon } from '@epam/uui-core';
import { AvatarProps, IconContainer } from '@epam/uui-components';
import { FlexCell, FlexRow } from '../layout';
import { Text, TextPlaceholder } from '../typography';
import { Avatar } from '../widgets';
import { SizeMod } from '../types';
import css from './PickerItem.module.scss';
import { getHighlightedSearchMatches } from './highlight';

const defaultSize = '36';

export interface PickerItemProps<TItem, TId> extends DataRowProps<TItem, TId>, SizeMod {
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

const PickerItemComponent = /* @__PURE__ */getPickerItemComponent();
export { PickerItemComponent as PickerItem };

function getPickerItemComponent() {
    return class PickerItem<TItem, TId> extends React.Component<PickerItemProps<TItem, TId>> {
        public static defaultProps = {
            highlightSearchMatches: true,
        };

        getAvatarSize = (size: string, isMultiline: boolean): string | number => {
            return isMultiline ? size : +size - 6;
        };

        render() {
            const {
                size, avatarUrl, isLoading, isDisabled, icon, highlightSearchMatches, cx,
            } = this.props;
            const itemSize = size || defaultSize;
            const isMultiline = !!(this.props.title && this.props.subtitle);

            const { search } = this.props.dataSourceState ?? {};
            const title = highlightSearchMatches ? getHighlightedSearchMatches(this.props.title, search) : this.props.title;
            const subtitle = highlightSearchMatches ? getHighlightedSearchMatches(this.props.subtitle, search) : this.props.subtitle;

            return (
                <FlexCell width="auto" cx={ [css.root, 'uui-typography', cx] }>
                    <FlexRow
                        size={ itemSize }
                        cx={ isMultiline && [css.multiline, css[`vertical-padding-${itemSize}`]] }
                        columnGap="12"
                    >
                        { avatarUrl && (
                            <Avatar
                                isLoading={ isLoading }
                                img={ avatarUrl }
                                size={ this.getAvatarSize(itemSize, isMultiline).toString() as AvatarProps['size'] }
                            />
                        ) }
                        { icon && <IconContainer icon={ icon } /> }
                        <FlexCell width="auto">
                            { title && (
                                <Text size={ itemSize } cx={ css.text } color={ isDisabled ? 'disabled' : 'primary' }>
                                    { isLoading ? <TextPlaceholder wordsCount={ 2 } /> : title }
                                </Text>
                            ) }
                            { subtitle && (
                                <Text size={ itemSize } color={ isDisabled ? 'disabled' : 'secondary' } cx={ css.text }>
                                    { isLoading ? <TextPlaceholder wordsCount={ 2 } /> : subtitle }
                                </Text>
                            ) }
                        </FlexCell>
                    </FlexRow>
                </FlexCell>
            );
        }
    };
}
