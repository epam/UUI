import * as React from 'react';
import { PanelMods, Panel, FlexRow, Text, FlexCell} from '../../../../components';
import { DocBuilder } from '@epam/uui-docs';
import { VPanelProps } from '@epam/uui';
import { DefaultContext, onClickDoc } from '../../../../docs';

const panelDoc = new DocBuilder<VPanelProps & PanelMods>({ name: 'Panel', component: Panel })
    .implements([onClickDoc] as any)
    .prop('children', { examples: [
        {
            name: 'grid',
            value:
                <>
                    <FlexRow padding='12'>
                        <Text font='sans'>GRID</Text>
                    </FlexRow>
                    <FlexRow padding='12' background='gray5' spacing='6'>
                        <FlexCell minWidth={ 100 } grow={ 4 }>
                            <Text size='24'>Column1</Text>
                        </FlexCell>
                        <FlexCell grow={ 3 }>
                            <Text size='24'>Column2</Text>
                        </FlexCell>
                        <FlexCell grow={ 2 }>
                            <Text size='24'>Column3</Text>
                        </FlexCell>
                        <FlexCell grow={ 1 }>
                            <Text size='24'>Column3</Text>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow padding='12' size='36' spacing='6' borderBottom>
                        <FlexCell minWidth={ 100 } grow={ 4 }><Text size='24'>Republic Cruiser</Text></FlexCell>
                        <FlexCell grow={ 3 }><Text size='24'>Belarus</Text></FlexCell>
                        <FlexCell grow={ 2 }><Text size='24'>1234</Text></FlexCell>
                        <FlexCell grow={ 1 }><Text size='24'>B1</Text></FlexCell>
                    </FlexRow>
                    <FlexRow padding='12' size='36' spacing='6' borderBottom>
                        <FlexCell minWidth={ 100 } grow={ 4 }><Text size='24'>Calamari Cruiser</Text></FlexCell>
                        <FlexCell grow={ 3 }><Text size='24'>Belarus</Text></FlexCell>
                        <FlexCell grow={ 2 }><Text size='24'>1020</Text></FlexCell>
                        <FlexCell grow={ 1 }><Text size='24'>B1</Text></FlexCell>
                    </FlexRow>
                    <FlexRow padding='12' size='36' spacing='6' borderBottom>
                        <FlexCell minWidth={ 100 } grow={ 4 }><Text size='24'>Naboo Royal Starship</Text></FlexCell>
                        <FlexCell grow={ 3 }><Text size='24'>Belarus</Text></FlexCell>
                        <FlexCell grow={ 2 }><Text size='24'>1050</Text></FlexCell>
                        <FlexCell grow={ 1 }><Text size='24'>B1</Text></FlexCell>
                    </FlexRow>
                </>,
            isDefault: true,
        },
        {
            name: 'grid-dark',
            value:
                <>
                    <FlexRow padding='12'>
                        <Text font='sans' color={ 'gray5' }>GRID DARK</Text>
                    </FlexRow>
                    <FlexRow padding='12' spacing='6' background={ 'gray5' }>
                        <FlexCell minWidth={ 100 } grow={ 4 }>
                            <Text size='24' color={ 'gray80' }>Column1</Text>
                        </FlexCell>
                        <FlexCell grow={ 3 }>
                            <Text size='24' color={ 'gray80' }>Column2</Text>
                        </FlexCell>
                        <FlexCell grow={ 2 }>
                            <Text size='24' color={ 'gray80' }>Column3</Text>
                        </FlexCell>
                        <FlexCell grow={ 1 }>
                            <Text size='24' color={ 'gray80' }>Column3</Text>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow padding='12' size='36' spacing='6' borderBottom>
                        <FlexCell minWidth={ 100 } grow={ 4 }><Text size='24' color={ 'gray5' }>Republic Cruiser</Text></FlexCell>
                        <FlexCell grow={ 3 }><Text size='24' color={ 'gray5' }>Belarus</Text></FlexCell>
                        <FlexCell grow={ 2 }><Text size='24' color={ 'gray5' }>1234</Text></FlexCell>
                        <FlexCell grow={ 1 }><Text size='24' color={ 'gray5' }>B1</Text></FlexCell>
                    </FlexRow>
                    <FlexRow padding='12' size='36' spacing='6' borderBottom>
                        <FlexCell minWidth={ 100 } grow={ 4 }><Text size='24' color={ 'gray5' }>Calamari Cruiser</Text></FlexCell>
                        <FlexCell grow={ 3 }><Text size='24' color={ 'gray5' }>Belarus</Text></FlexCell>
                        <FlexCell grow={ 2 }><Text size='24' color={ 'gray5' }>1020</Text></FlexCell>
                        <FlexCell grow={ 1 }><Text size='24' color={ 'gray5' }>B1</Text></FlexCell>
                    </FlexRow>
                    <FlexRow padding='12' size='36' spacing='6' borderBottom>
                        <FlexCell minWidth={ 100 } grow={ 4 }><Text size='24' color={ 'gray5' }>Naboo Royal Starship</Text></FlexCell>
                        <FlexCell grow={ 3 }><Text size='24' color={ 'gray5' }>Belarus</Text></FlexCell>
                        <FlexCell grow={ 2 }><Text size='24' color={ 'gray5' }>1050</Text></FlexCell>
                        <FlexCell grow={ 1 }><Text size='24' color={ 'gray5' }>B1</Text></FlexCell>
                    </FlexRow>
                </>,
        },
    ] })
    .prop('shadow', { examples: [{ value: true, isDefault: true }] })
    .prop('margin', { examples: ['24'] })
    .prop('background', { examples: [{ value: 'white', isDefault: true }, 'gray90'] })
    .withContexts(DefaultContext);

export = panelDoc;
