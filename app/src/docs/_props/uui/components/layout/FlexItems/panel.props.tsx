import * as React from 'react';
import { PanelMods, Panel, FlexRow, Text, FlexCell } from '@epam/uui';
import { DocBuilder } from '@epam/uui-docs';
import { VPanelProps } from '@epam/uui-core';
import { DefaultContext, onClickDoc } from '../../../docs';

const panelDoc = new DocBuilder<VPanelProps & PanelMods>({ name: 'Panel', component: Panel })
    .implements([onClickDoc])
    .prop('children', {
        examples: [
            {
                name: 'grid',
                value: (
                    <>
                        <FlexRow padding="12">
                            <Text>GRID</Text>
                        </FlexRow>
                        <FlexRow padding="12" background="surface" spacing="6">
                            <FlexCell minWidth={ 100 } grow={ 4 }>
                                <Text size="24">Column1</Text>
                            </FlexCell>
                            <FlexCell grow={ 3 }>
                                <Text size="24">Column2</Text>
                            </FlexCell>
                            <FlexCell grow={ 2 }>
                                <Text size="24">Column3</Text>
                            </FlexCell>
                            <FlexCell grow={ 1 }>
                                <Text size="24">Column3</Text>
                            </FlexCell>
                        </FlexRow>
                        <FlexRow padding="12" size="36" spacing="6" borderBottom>
                            <FlexCell minWidth={ 100 } grow={ 4 }>
                                <Text size="24">Republic Cruiser</Text>
                            </FlexCell>
                            <FlexCell grow={ 3 }>
                                <Text size="24">Belarus</Text>
                            </FlexCell>
                            <FlexCell grow={ 2 }>
                                <Text size="24">1234</Text>
                            </FlexCell>
                            <FlexCell grow={ 1 }>
                                <Text size="24">B1</Text>
                            </FlexCell>
                        </FlexRow>
                        <FlexRow padding="12" size="36" spacing="6" borderBottom>
                            <FlexCell minWidth={ 100 } grow={ 4 }>
                                <Text size="24">Calamari Cruiser</Text>
                            </FlexCell>
                            <FlexCell grow={ 3 }>
                                <Text size="24">Belarus</Text>
                            </FlexCell>
                            <FlexCell grow={ 2 }>
                                <Text size="24">1020</Text>
                            </FlexCell>
                            <FlexCell grow={ 1 }>
                                <Text size="24">B1</Text>
                            </FlexCell>
                        </FlexRow>
                        <FlexRow padding="12" size="36" spacing="6" borderBottom>
                            <FlexCell minWidth={ 100 } grow={ 4 }>
                                <Text size="24">Naboo Royal Starship</Text>
                            </FlexCell>
                            <FlexCell grow={ 3 }>
                                <Text size="24">Belarus</Text>
                            </FlexCell>
                            <FlexCell grow={ 2 }>
                                <Text size="24">1050</Text>
                            </FlexCell>
                            <FlexCell grow={ 1 }>
                                <Text size="24">B1</Text>
                            </FlexCell>
                        </FlexRow>
                    </>
                ),
                isDefault: true,
            }, {
                name: 'grid-dark',
                value: (
                    <>
                        <FlexRow padding="12">
                            <Text color="secondary">
                                GRID DARK
                            </Text>
                        </FlexRow>
                        <FlexRow padding="12" spacing="6" background="surface">
                            <FlexCell minWidth={ 100 } grow={ 4 }>
                                <Text size="24" color="secondary">
                                    Column1
                                </Text>
                            </FlexCell>
                            <FlexCell grow={ 3 }>
                                <Text size="24" color="secondary">
                                    Column2
                                </Text>
                            </FlexCell>
                            <FlexCell grow={ 2 }>
                                <Text size="24" color="secondary">
                                    Column3
                                </Text>
                            </FlexCell>
                            <FlexCell grow={ 1 }>
                                <Text size="24" color="secondary">
                                    Column3
                                </Text>
                            </FlexCell>
                        </FlexRow>
                        <FlexRow padding="12" size="36" spacing="6" borderBottom>
                            <FlexCell minWidth={ 100 } grow={ 4 }>
                                <Text size="24" color="white">
                                    Republic Cruiser
                                </Text>
                            </FlexCell>
                            <FlexCell grow={ 3 }>
                                <Text size="24" color="white">
                                    Belarus
                                </Text>
                            </FlexCell>
                            <FlexCell grow={ 2 }>
                                <Text size="24" color="white">
                                    1234
                                </Text>
                            </FlexCell>
                            <FlexCell grow={ 1 }>
                                <Text size="24" color="white">
                                    B1
                                </Text>
                            </FlexCell>
                        </FlexRow>
                        <FlexRow padding="12" size="36" spacing="6" borderBottom>
                            <FlexCell minWidth={ 100 } grow={ 4 }>
                                <Text size="24" color="white">
                                    Calamari Cruiser
                                </Text>
                            </FlexCell>
                            <FlexCell grow={ 3 }>
                                <Text size="24" color="white">
                                    Belarus
                                </Text>
                            </FlexCell>
                            <FlexCell grow={ 2 }>
                                <Text size="24" color="white">
                                    1020
                                </Text>
                            </FlexCell>
                            <FlexCell grow={ 1 }>
                                <Text size="24" color="white">
                                    B1
                                </Text>
                            </FlexCell>
                        </FlexRow>
                        <FlexRow padding="12" size="36" spacing="6" borderBottom>
                            <FlexCell minWidth={ 100 } grow={ 4 }>
                                <Text size="24" color="white">
                                    Naboo Royal Starship
                                </Text>
                            </FlexCell>
                            <FlexCell grow={ 3 }>
                                <Text size="24" color="white">
                                    Belarus
                                </Text>
                            </FlexCell>
                            <FlexCell grow={ 2 }>
                                <Text size="24" color="white">
                                    1050
                                </Text>
                            </FlexCell>
                            <FlexCell grow={ 1 }>
                                <Text size="24" color="white">
                                    B1
                                </Text>
                            </FlexCell>
                        </FlexRow>
                    </>
                ),
            },
        ],
    })
    .prop('shadow', { examples: [{ value: true, isDefault: true }] })
    .prop('margin', { examples: ['24'] })
    .prop('background', { examples: [{ value: 'surface', isDefault: true }] })
    .withContexts(DefaultContext);

export default panelDoc;
