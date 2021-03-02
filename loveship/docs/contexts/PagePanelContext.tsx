import * as React from 'react';
import { DemoComponentProps } from '@epam/uui-docs';
import { Panel, FlexRow, Text, FlexCell } from '../../components';
import * as css from './PagePanelContext.scss';

const items = [
    { country: 'Belarus' },
    { country: 'Russia' },
    { country: 'China' },
    { country: 'USA' },
    { country: 'Japan' },
    { country: 'Poland' },
    { country: 'Italy' },
    { country: 'France' },
    { country: 'Germany' },
];

export class PagePanelContext extends React.Component<DemoComponentProps, any> {
    public static displayName = 'Page panel';

    state = {
        totalPages: items.length,
    };

    renderTable(item: any) {
        return (
            <React.Fragment>
                <FlexRow padding='12' borderBottom>
                    <Text font='sans-semibold'>{ item.country }</Text>
                </FlexRow>
                <FlexRow padding='12' background='night50' borderBottom>
                    <FlexCell minWidth={ 100 } grow={ 4 }>
                        <Text font='sans-semibold' size='24'>Column1</Text>
                    </FlexCell>
                    <FlexCell grow={ 3 }>
                        <Text font='sans-semibold' size='24'>Column2</Text>
                    </FlexCell>
                    <FlexCell grow={ 2 }>
                        <Text font='sans-semibold' size='24'>Column3</Text>
                    </FlexCell>
                    <FlexCell grow={ 1 }>
                        <Text font='sans-semibold' size='24'>Column3</Text>
                    </FlexCell>
                </FlexRow>
                <FlexRow padding='12' size='36' borderBottom>
                    <FlexCell minWidth={ 100 } grow={ 4 }><Text size='24'>Republic Cruiser</Text></FlexCell>
                    <FlexCell grow={ 3 }><Text size='24'>{ item.country }</Text></FlexCell>
                    <FlexCell grow={ 2 }><Text size='24'>1234</Text></FlexCell>
                    <FlexCell grow={ 1 }><Text size='24'>B1</Text></FlexCell>
                </FlexRow>
                <FlexRow padding='12' size='36' borderBottom>
                    <FlexCell minWidth={ 100 } grow={ 4 }><Text size='24'>Calamari Cruiser</Text></FlexCell>
                    <FlexCell grow={ 3 }><Text size='24'>{ item.country }</Text></FlexCell>
                    <FlexCell grow={ 2 }><Text size='24'>1020</Text></FlexCell>
                    <FlexCell grow={ 1 }><Text size='24'>B1</Text></FlexCell>
                </FlexRow>
                <FlexRow padding='12' size='36' borderBottom>
                    <FlexCell minWidth={ 100 } grow={ 4 }><Text size='24'>Naboo Royal Starship</Text></FlexCell>
                    <FlexCell grow={ 3 }><Text font='sans-semibold' size='24'>{ item.country }</Text></FlexCell>
                    <FlexCell grow={ 2 }><Text size='24'>1050</Text></FlexCell>
                    <FlexCell grow={ 1 }><Text size='24'>B1</Text></FlexCell>
                </FlexRow>
            </React.Fragment>
        );
    }

    render() {
        const { DemoComponent, props } = this.props;


        return (
            <Panel cx={ css.container } margin='24'>
                <Panel background='white'  cx={ css.demo }>
                    { this.renderTable(items[props.value - 1]) }
                    <FlexRow padding='12' vPadding='12' size='36' >
                        <DemoComponent { ...props } totalPages={ this.state.totalPages } />
                    </FlexRow>
                </Panel>
            </Panel>
        );
    }
}