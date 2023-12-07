import * as React from 'react';
import { DemoComponentProps } from '../types';
import {
    Panel, FlexRow, Text, FlexCell,
} from '@epam/uui';
import css from './PagePanelContext.module.scss';

const items: Array<{ country: string }> = [
    { country: 'Belarus' }, { country: 'Russia' }, { country: 'China' }, { country: 'USA' }, { country: 'Japan' }, { country: 'Poland' }, { country: 'Italy' }, { country: 'France' }, { country: 'Germany' },
];

interface DemoComponentState {
    totalPages: number;
}

export class PagePanelContext extends React.Component<DemoComponentProps, DemoComponentState> {
    public static displayName = 'Page panel';
    state = {
        totalPages: items.length,
    };

    renderTable(item: (typeof items)[number]) {
        return (
            <React.Fragment>
                <FlexRow padding="12" borderBottom>
                    <Text fontWeight="600">{item.country}</Text>
                </FlexRow>
                <FlexRow padding="12" background="surface-main" borderBottom>
                    <FlexCell minWidth={ 100 } grow={ 4 }>
                        <Text fontWeight="600" size="24">
                            Column1
                        </Text>
                    </FlexCell>
                    <FlexCell grow={ 3 }>
                        <Text fontWeight="600" size="24">
                            Column2
                        </Text>
                    </FlexCell>
                    <FlexCell grow={ 2 }>
                        <Text fontWeight="600" size="24">
                            Column3
                        </Text>
                    </FlexCell>
                    <FlexCell grow={ 1 }>
                        <Text fontWeight="600" size="24">
                            Column3
                        </Text>
                    </FlexCell>
                </FlexRow>
                <FlexRow padding="12" size="36" borderBottom>
                    <FlexCell minWidth={ 100 } grow={ 4 }>
                        <Text size="24">Republic Cruiser</Text>
                    </FlexCell>
                    <FlexCell grow={ 3 }>
                        <Text size="24">{item.country}</Text>
                    </FlexCell>
                    <FlexCell grow={ 2 }>
                        <Text size="24">1234</Text>
                    </FlexCell>
                    <FlexCell grow={ 1 }>
                        <Text size="24">B1</Text>
                    </FlexCell>
                </FlexRow>
                <FlexRow padding="12" size="36" borderBottom>
                    <FlexCell minWidth={ 100 } grow={ 4 }>
                        <Text size="24">Calamari Cruiser</Text>
                    </FlexCell>
                    <FlexCell grow={ 3 }>
                        <Text size="24">{item.country}</Text>
                    </FlexCell>
                    <FlexCell grow={ 2 }>
                        <Text size="24">1020</Text>
                    </FlexCell>
                    <FlexCell grow={ 1 }>
                        <Text size="24">B1</Text>
                    </FlexCell>
                </FlexRow>
                <FlexRow padding="12" size="36" borderBottom>
                    <FlexCell minWidth={ 100 } grow={ 4 }>
                        <Text size="24">Naboo Royal Starship</Text>
                    </FlexCell>
                    <FlexCell grow={ 3 }>
                        <Text fontWeight="600" size="24">
                            {item.country}
                        </Text>
                    </FlexCell>
                    <FlexCell grow={ 2 }>
                        <Text size="24">1050</Text>
                    </FlexCell>
                    <FlexCell grow={ 1 }>
                        <Text size="24">B1</Text>
                    </FlexCell>
                </FlexRow>
            </React.Fragment>
        );
    }

    render() {
        const { DemoComponent, props } = this.props;

        /**
         * It looks odd, but the "PagePanelContext" context is only used
         * for the "Paginator" component at the moment.
         * And the assumption here is that the value is always a number.
         */
        const index = Number(props.value) - 1;

        return (
            <Panel cx={ css.container } margin="24">
                <Panel background="surface-main" cx={ css.demo }>
                    {this.renderTable(items[index])}
                    <FlexRow padding="12" vPadding="12" size="36">
                        <DemoComponent { ...props } totalPages={ this.state.totalPages } />
                    </FlexRow>
                </Panel>
            </Panel>
        );
    }
}
