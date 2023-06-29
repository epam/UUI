import * as React from 'react';
import { DataRowProps, DataSourceState, Icon } from '@epam/uui-core';
import { AvatarProps, IconContainer } from '@epam/uui-components';
import { FlexCell, FlexRow } from '../layout';
import { Text, TextPlaceholder } from '../typography';
import { Avatar } from '../widgets';
import { SizeMod } from '../types';
import css from './PickerItem.module.scss';

const defaultSize = '36';

export interface PickerItemProps<TItem, TId> extends DataRowProps<TItem, TId>, SizeMod {
    avatarUrl?: string;
    icon?: Icon;
    title?: string;
    subtitle?: string;
    dataSourceState?: DataSourceState;
    highlightSearchMatches?: boolean;
}

interface Range {
    from: number;
    to: number;
    isHighlighted: boolean;
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

        const ranges = this.getRanges(search, str);
        if (!ranges.length) {
            return str;
        }

        return this.getDecoratedText(str, ranges);
    };

    getDecoratedText = (str: string, ranges: Range[]) => {
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

    mergeRanges = (ranges: Range[]) => {
        const mergedRanges: Range[] = [];
        ranges.forEach((range) => {
            if (!mergedRanges.length) {
                mergedRanges.push({ ...range, isHighlighted: true });
            }
              
            const lastRange = mergedRanges[mergedRanges.length - 1];
            if (range.from >= lastRange.from && range.from <= lastRange.to + 1 && range.to > lastRange.to) {
                lastRange.to = range.to;
            }
        
            if (lastRange.to < range.from - 1) {
                mergedRanges.push({ ...range, isHighlighted: true });
            }
        });

        return mergedRanges;
    };

    addNotHighlightedRanges = (ranges: Range[], str: string) => {
        const allRanges: Range[] = [];
        ranges.forEach((range, index) => {
            if (index === 0 && range.from !== 0) {
                allRanges.push({ from: 0, to: range.from, isHighlighted: false });
            }
            const prevRange = ranges[index - 1];
            if (prevRange && prevRange.to + 1 < range.from) {
                allRanges.push({ from: prevRange.to, to: range.from, isHighlighted: false });
            }
        
            allRanges.push(range);
            const lastIndex = ranges.length - 1;
            if (index === lastIndex && range.to < str.length) {
                allRanges.push({ from: range.to, to: str.length, isHighlighted: false });
            }
        });
        return allRanges;
    };

    getRanges = (search: string, str: string) => {
        const words = search
            .split(' ')
            .filter(Boolean)
            .map((word) => new RegExp(word, 'ig'));
        const matches = words.flatMap((word) => [...str.matchAll(word)]);

        const ranges = matches
            .map((match) => ({ from: match.index, to: match[0].length + match.index, isHighlighted: true }))
            .sort((range1, range2) => range1.from - range2.from);

        if (!ranges) {
            return [];
        }

        const mergedRanges = this.mergeRanges(ranges);
        return this.addNotHighlightedRanges(mergedRanges, str);
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
