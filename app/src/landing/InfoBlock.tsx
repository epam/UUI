import * as React from 'react';
import { cx } from '@epam/uui-core';
import { FlexCell, FlexRow, Text } from '@epam/promo';
import css from './InfoBlock.scss';

const infoData = [
    { caption: 'Clients', value: '40+', pulse: false },
    { caption: 'Years in Live', value: '6+', pulse: true },
    { caption: 'Design Skins', value: '3', pulse: false },
    { caption: 'Components', value: '150+', pulse: false },
    { caption: 'Downloads pre month', value: '25K+', pulse: false },
];


export class InfoBlock extends React.Component {
    render() {
        return (
            <div className={ css.layout } >
                <FlexRow cx={ css.info } >
                    {
                        infoData.map((data) => (
                            <FlexCell cx={ css.infoContainer } key={ data.caption } width='auto'  >
                                <Text font='museo-sans' cx={ css.infoValue } >{ data.value }</Text>
                                <Text font='museo-slab' cx={ cx(css.infoCaption, data.pulse && css.pulse) } >{ data.caption }</Text>
                            </FlexCell>
                        ))
                    }
                </FlexRow>
            </div>
        );
    }
}
