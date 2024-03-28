import { FlexRow, Text, FlexCell, ModalHeader, ModalFooter, FlexSpacer, Button } from '@epam/uui';
import * as React from 'react';

export const childrenExamples = [
    {
        name: 'grid',
        value: (
            <>
                <FlexRow padding="12">
                    <Text>GRID</Text>
                </FlexRow>
                <FlexRow padding="12">
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
                <FlexRow padding="12" size="36" borderBottom>
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
                <FlexRow padding="12" size="36" borderBottom>
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
                <FlexRow padding="12" size="36" borderBottom>
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
        name: 'modal',
        value: (
            <>
                <ModalHeader borderBottom title="Modal Header" onClose={ () => {} } />
                <FlexRow padding="24" vPadding="24">
                    <Text>You can use Modal Header inside a panel.</Text>
                </FlexRow>
                <ModalFooter borderTop>
                    <FlexSpacer />
                    <Button caption="Cancel" onClick={ () => {} } color="secondary" fill="outline" />
                    <Button caption="Ok" onClick={ () => {} } color="primary" fill="solid" />
                </ModalFooter>
            </>
        ),
        isDefault: true,
    },
];
