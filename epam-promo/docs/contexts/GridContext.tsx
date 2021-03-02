import * as React from 'react';
import { DemoComponentProps } from '@epam/uui-docs';
import { Panel, FlexRow, FlexCell, Text } from '../../components';
import * as css from './GridContext.scss';

export class GridContext extends React.Component<DemoComponentProps, any> {
    public static displayName = "Grid";
    render() {
        const { DemoComponent, props } = this.props;
        return (
            <Panel cx={ css.container } margin='24' background='white'>
                <FlexRow padding='12'>
                    <Text font='sans'>GRID</Text>
                </FlexRow>
                <FlexRow padding='12' spacing='6' background='gray5'>
                    <FlexCell grow={ 4 } width={ 0 }>
                        <Text size='24'>Column1</Text>
                    </FlexCell>
                    <FlexCell grow={ 3 } width={ 0 }>
                        <Text size='24'>Column2</Text>
                    </FlexCell>
                    <FlexCell grow={ 2 } width={ 0 }>
                        <Text size='24'>Column3</Text>
                    </FlexCell>
                    <FlexCell grow={ 1 } width={ 0 }>
                        <Text size='24'>Column3</Text>
                    </FlexCell>
                </FlexRow>
                <FlexRow padding='12' size='36' spacing='6' borderBottom>
                    <FlexCell grow={ 4 } width={ 0 }><Text size='24'>Republic Cruiser</Text></FlexCell>
                    <FlexCell grow={ 3 } width={ 0 }><Text size='24'>Belarus</Text></FlexCell>
                    <FlexCell grow={ 2 } width={ 0 }><Text size='24'>1234</Text></FlexCell>
                    <FlexCell grow={ 1 } width={ 0 }><Text size='24'>B1</Text></FlexCell>

                </FlexRow>
                <FlexRow padding='12' size='36' spacing='6' borderBottom>
                    <FlexCell grow={ 4 } width={ 0 }><Text size='24'>Calamari Cruiser</Text></FlexCell>
                    <FlexCell grow={ 3 } width={ 0 }><Text size='24'>Belarus</Text></FlexCell>
                    <FlexCell grow={ 2 } width={ 0 }><DemoComponent { ...props } /></FlexCell>
                    <FlexCell grow={ 1 } width={ 0 }><Text size='24'>B1</Text></FlexCell>
                </FlexRow>
                <FlexRow padding='12' size='36' spacing='6' borderBottom>
                    <FlexCell grow={ 4 } width={ 0 }><Text size='24'>Naboo Royal Starship</Text></FlexCell>
                    <FlexCell grow={ 3 } width={ 0 }><Text size='24'>Belarus</Text></FlexCell>
                    <FlexCell grow={ 2 } width={ 0 }><Text size='24'>1050</Text></FlexCell>
                    <FlexCell grow={ 1 } width={ 0 }><Text size='24'>B1</Text></FlexCell>
                </FlexRow>
            </Panel>
        );
    }
}