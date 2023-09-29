import React from 'react';
import { Dropdown, FlexRow, Panel, Text, Badge } from '@epam/uui';
import { ReactComponent as mediaIcon } from '@epam/assets/icons/common/media-play-fill-18.svg';
import { ReactComponent as doneIcon } from '@epam/assets/icons/common/notification-done-24.svg';
import { ReactComponent as navigationDownIcon } from '@epam/assets/icons/common/navigation-chevron-down-18.svg';

export default function TypesExample() {
    return (
        <>
            <Panel background="surface" style={ { rowGap: '18px', padding: '12px', flex: '1 1 auto' } }>
                <FlexRow spacing="18">
                    <Badge icon={ mediaIcon } color="warning" fill="outline" caption="Video" />
                    <Text fontSize="14">Use as an attribute or label</Text>
                </FlexRow>
                <FlexRow spacing="18">
                    <Badge icon={ doneIcon } color="success" fill="outline" caption="Ready" />
                    <Text fontSize="14">View statuses</Text>
                </FlexRow>
                <FlexRow spacing="18">
                    <Badge color="info" fill="outline" caption="Java" onClick={ () => {} } onClear={ () => {} } />
                    <Text fontSize="14">Filter chips</Text>
                </FlexRow>
            </Panel>
            <Panel background="surface" style={ { rowGap: '18px', padding: '12px', flex: '1 1 auto' } }>
                <FlexRow spacing="18">
                    <Badge count={ 25 } color="error" fill="solid" caption="Rejected" onClick={ () => {} } />
                    <Text fontSize="14">Quick filters selection with informer</Text>
                </FlexRow>
                <FlexRow spacing="18">
                    <Dropdown
                        renderBody={ () => null }
                        renderTarget={ (props) => (
                            <Badge
                                { ...props }
                                dropdownIcon={ navigationDownIcon }
                                dropdownIconPosition="right"
                                color="neutral"
                                fill="outline"
                                caption="In Progress"
                            />
                        ) }
                        placement="bottom-end"
                    />
                    <Text fontSize="14">Label & trigger for selection using dropdown</Text>
                </FlexRow>
                <FlexRow spacing="18">
                    <Badge color="neutral" fill="outline" caption="Projects" />
                    <Text fontSize="14">Simple attribute or label</Text>
                </FlexRow>
            </Panel>
        </>
    );
}
