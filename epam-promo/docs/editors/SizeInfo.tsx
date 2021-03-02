import * as React from 'react';
import { cx } from '@epam/uui';
import * as css from './SizeInfo.scss';
import { FlexRow, FlexCell, Text } from '../../components';

interface SizeInfoProps {
    size: '48'| '42' | '36' | '30' | '24' | '18';
    caption?: string;
    showHorizontalHighlight: boolean;
}

export class SizeInfo extends React.Component<SizeInfoProps, any> {

    render() {
        const iconSizes: string[][] = [
            ['18', '24', '30', '36', '42', '48'], // control size
            ['12', '12', '18', '18', '18', '24'], // icon size with caption
        ];

        let index = iconSizes[0].findIndex(i => i == this.props.size);

        return <div className={ css.root }>
            <Text color='gray5' size='18' fontSize='14' font='sans-semibold' cx={ css.recommendedText }>Use the recommended icon sizes</Text>
            <div className={ css.infoTable }>
                <FlexRow cx={ css.height18 }>
                    <FlexCell minWidth={ 80 } shrink={ 0 } cx={ cx(css.leftCell, css.height18) }/>
                    <FlexCell width='auto' shrink={ 0 } grow={ 1 }>
                        <Text size='18' fontSize='12' cx={ css.borderBottom } font='sans-semibold'>Control Size</Text>
                    </FlexCell>
                </FlexRow>
                <FlexRow cx={ css.borderBottom } size='24'>
                    <FlexCell minWidth={ 80 } shrink={ 0 } cx={ cx(css.leftCell, css.height24) }/>
                    { iconSizes[0].map(size => <FlexCell key={ size } minWidth={ 38 } shrink={ 0 } cx={ this.props.size == size && css.activeV }>
                        <Text size='24' font='sans-semibold'>{ size }</Text>
                    </FlexCell>) }
                </FlexRow>
                <FlexRow>
                    <FlexCell minWidth={ 80 } shrink={ 0 } cx={ css.leftCell }>
                        <Text fontSize='12' font='sans-semibold'>Icon size</Text>
                    </FlexCell>
                    { iconSizes[1].map((size, i) => <FlexCell key={ i } minWidth={ 38 } shrink={ 0 } cx={ i === index && css.activeV }>
                        <Text>{ size }</Text>
                    </FlexCell>) }
                </FlexRow>
            </div>
        </div>;
    }
}