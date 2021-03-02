import React from 'react';
import { PanelMods, Panel, FlexRow, Text, Button, FlexSpacer, FlexCell, ModalHeader, ModalFooter } from '../../../../components';
import { DocBuilder } from '@epam/uui-docs';
import { VPanelProps } from '@epam/uui';
import { DefaultContext, onClickDoc, ResizableContext } from '../../../../docs';

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
                    <FlexRow padding='12' background='night50'>
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
                    <FlexRow padding='12' size='36' borderBottom>
                        <FlexCell minWidth={ 100 } grow={ 4 }><Text size='24'>Republic Cruiser</Text></FlexCell>
                        <FlexCell grow={ 3 }><Text size='24'>Belarus</Text></FlexCell>
                        <FlexCell grow={ 2 }><Text size='24'>1234</Text></FlexCell>
                        <FlexCell grow={ 1 }><Text size='24'>B1</Text></FlexCell>
                    </FlexRow>
                    <FlexRow padding='12' size='36' borderBottom>
                        <FlexCell minWidth={ 100 } grow={ 4 }><Text size='24'>Calamari Cruiser</Text></FlexCell>
                        <FlexCell grow={ 3 }><Text size='24'>Belarus</Text></FlexCell>
                        <FlexCell grow={ 2 }><Text size='24'>1020</Text></FlexCell>
                        <FlexCell grow={ 1 }><Text size='24'>B1</Text></FlexCell>
                    </FlexRow>
                    <FlexRow padding='12' size='36' borderBottom>
                        <FlexCell minWidth={ 100 } grow={ 4 }><Text size='24'>Naboo Royal Starship</Text></FlexCell>
                        <FlexCell grow={ 3 }><Text size='24'>Belarus</Text></FlexCell>
                        <FlexCell grow={ 2 }><Text size='24'>1050</Text></FlexCell>
                        <FlexCell grow={ 1 }><Text size='24'>B1</Text></FlexCell>
                    </FlexRow>
                </>,
            isDefault: true,
        },
        {
            name: 'modal',
            value:
                <>
                    <ModalHeader borderBottom title='Modal Header' onClose={ () => {} } />
                    <FlexRow type='form'>
                        <Text>
                            You can use Modal Header inside a panel.
                        </Text>
                    </FlexRow>
                    <ModalFooter borderTop>
                        <FlexSpacer />
                        <Button caption='Cancel' onClick={ () => {} } color='night400'/>
                        <Button caption='Ok' onClick={ () => {} } color='grass'/>
                    </ModalFooter>
                </>,
            isDefault: true,
        },
    ] })
    .prop('shadow', { examples: [{ value: true, isDefault: true }] })
    .prop('margin', { examples: ['24'] })
    .prop('background', { examples: [{ value: 'white', isDefault: true }, 'night50'] })
    .withContexts(ResizableContext, DefaultContext);

export = panelDoc;
