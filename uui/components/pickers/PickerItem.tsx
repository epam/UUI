import * as React from 'react';
import { DataRowProps, DataSourceState, Icon } from '@epam/uui-core';
import { AvatarProps, IconContainer } from '@epam/uui-components';
import { FlexCell, FlexRow } from '../layout';
import { Text, TextPlaceholder } from '../typography';
import { Avatar } from '../widgets';
import { SizeMod } from '../types';
import css from './PickerItem.module.scss';
import { getHighlightRanges, type HighlightRange } from './highlight';

const defaultSize = '36';

export interface PickerItemProps<TItem, TId> extends DataRowProps<TItem, TId>, SizeMod {
    avatarUrl?: string;
    icon?: Icon;
    title?: string;
    subtitle?: string;
    dataSourceState?: DataSourceState;
    highlightSearchMatches?: boolean;
}
export class PickerItem<TItem, TId> extends React.Component<PickerItemProps<TItem, TId>> {
    getAvatarSize = (size: string, isMultiline: boolean): string | number => {
        return isMultiline ? size : +size - 6;
    };

    highlightSearchMatches = (str: string) => {
        const { search } = this.props.dataSourceState ?? {};
        if (!search || !str) {
            return str;
        }

        const ranges = getHighlightRanges(search, str);
        if (!ranges.length) {
            return str;
        }

        return this.getDecoratedText(str, ranges);
    };

    getDecoratedText = (str: string, ranges: HighlightRange[]) => {
        return ranges.map((range, index) => {
            const rangeStr = str.substring(range.from, range.to);
            if (range.isHighlighted) {
                return this.getHighlightedText(rangeStr, index);
            }
            return this.getRegularText(rangeStr, index);
        });
    };

    getHighlightedText = (str: string, index: number) => {
        return <span key={ `${str}-${index}` } className={ css.highlightedText }>{str}</span>;
    };

    getRegularText = (str: string, index: number) => {
        return <span key={ `${str}-${index}` }>{str}</span>;
    };

    render() {
        const {
            size, avatarUrl, isLoading, isDisabled, icon, highlightSearchMatches = true,
        } = this.props;
        const itemSize = size && size !== 'none' ? size : defaultSize;
        const isMultiline = !!(this.props.title && this.props.subtitle);

        const title = highlightSearchMatches ? this.highlightSearchMatches(this.props.title) : this.props.title;
        const subtitle = highlightSearchMatches ? this.highlightSearchMatches(this.props.subtitle) : this.props.subtitle;
        return (
            <FlexCell width="auto" cx={ css.root }>
                <FlexRow size={ itemSize } cx={ isMultiline && css[`multiline-vertical-padding-${itemSize}`] } spacing="12">
                    {avatarUrl && <Avatar isLoading={ isLoading } img={ avatarUrl } size={ this.getAvatarSize(itemSize, isMultiline).toString() as AvatarProps['size'] } />}
                    {icon && <IconContainer icon={ icon } />}
                    <FlexCell width="auto">
                        {title && (
                            <Text size={ itemSize } cx={ css.text } color={ isDisabled ? 'disabled' : 'primary' }>
                                {isLoading ? <TextPlaceholder wordsCount={ 2 } /> : title}
                            </Text>
                        )}
                        {subtitle && (
                            <Text size={ itemSize } color={ isDisabled ? 'disabled' : 'secondary' } cx={ css.text }>
                                {isLoading ? <TextPlaceholder wordsCount={ 2 } /> : subtitle}
                            </Text>
                        )}
                    </FlexCell>
                </FlexRow>
            </FlexCell>
        );
    }
}
