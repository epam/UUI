import * as React from 'react';
import { cx } from '@epam/uui-core';
import css from './SizeInfo.module.scss';
import { FlexRow, FlexCell, Text } from '@epam/uui';

interface SizeInfoProps {
    size: '48' | '42' | '36' | '30' | '24' | '18';
    caption?: string;
    showHorizontalHighlight: boolean;
}

export class SizeInfo extends React.Component<SizeInfoProps, any> {
    render() {
        const iconSizes: string[][] = [
            [
                '18', '24', '30', '36', '42', '48',
            ], // control size
            [
                '12', '12', '18', '18', '18', '24',
            ], // icon size with caption
        ];

        const index = iconSizes[0].findIndex((i) => i === this.props.size);
        const renderSizeCell = (size: string) => {
            const isActive = this.props.size === size;
            return (
                <FlexCell key={ size } minWidth={ 38 } shrink={ 0 } cx={ isActive && css.activeV }>
                    <Text size="24" fontWeight="600" color="primary" cx={ isActive && css.activeText }>
                        {size}
                    </Text>
                </FlexCell>
            );
        };
        const renderIconSizeCell = (size: string, i: number) => {
            const isActive = i === index;
            return (
                <FlexCell key={ i } minWidth={ 38 } shrink={ 0 } cx={ isActive && css.activeV }>
                    <Text color="primary" cx={ isActive && css.activeText }>{size}</Text>
                </FlexCell>
            );
        };

        return (
            <div className={ css.root }>
                <Text color="white" size="18" fontSize="14" fontWeight="600" cx={ css.recommendedText }>
                    Use the recommended icon sizes
                </Text>
                <div className={ css.infoTable }>
                    <FlexRow cx={ css.height18 }>
                        <FlexCell minWidth={ 80 } shrink={ 0 } cx={ cx(css.leftCell, css.height18) } />
                        <FlexCell width="auto" shrink={ 0 } grow={ 1 }>
                            <Text size="18" fontSize="12" cx={ css.borderBottom } fontWeight="600">
                                Control Size
                            </Text>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow cx={ css.borderBottom } size="24">
                        <FlexCell minWidth={ 80 } shrink={ 0 } cx={ cx(css.leftCell, css.height24) } />
                        {iconSizes[0].map(renderSizeCell)}
                    </FlexRow>
                    <FlexRow>
                        <FlexCell minWidth={ 80 } shrink={ 0 } cx={ css.leftCell }>
                            <Text fontSize="12" fontWeight="600">
                                Icon size
                            </Text>
                        </FlexCell>
                        {iconSizes[1].map(renderIconSizeCell)}
                    </FlexRow>
                </div>
            </div>
        );
    }
}
