import React from 'react';
import { Dropdown, FlexRow, Panel, Text, Badge } from '@epam/uui';
import { ReactComponent as mediaIcon } from '@epam/assets/icons/common/media-play-fill-18.svg';
import { ReactComponent as doneIcon } from '@epam/assets/icons/common/notification-done-24.svg';
import { ReactComponent as navigationDownIcon } from '@epam/assets/icons/common/navigation-chevron-down-18.svg';

export default function TypesExample() {
    return (
        <>
            <Panel style={ { rowGap: '18px', padding: '12px', flex: '1 1 auto' } }>
                <FlexRow spacing="18" key="01">
                    <Badge icon={ mediaIcon } color="warning" fill="outline" caption="Video" />
                    <Text fontSize="14">Use as an attribute or label</Text>
                </FlexRow>
                <FlexRow spacing="18" key="02">
                    <Badge icon={ doneIcon } color="success" fill="outline" caption="Ready" />
                    <Text fontSize="14">View statuses</Text>
                </FlexRow>
                <FlexRow spacing="18" key="03">
                    <Badge color="info" fill="outline" caption="Java" onClick={ () => {} } indicator />
                    <Text fontSize="14">Status with indicator</Text>
                </FlexRow>
            </Panel>
            <Panel style={ { rowGap: '18px', padding: '12px', flex: '1 1 auto' } }>
                <FlexRow spacing="18" key="04">
                    <Badge count={ 25 } color="critical" fill="solid" caption="Rejected" onClick={ () => {} } />
                    <Text fontSize="14">Quick filters selection with informer</Text>
                </FlexRow>
                <FlexRow spacing="18" key="05">
                    <Dropdown
                        renderBody={ () => null }
                        renderTarget={ (props) => (
                            <Badge
                                { ...props }
                                dropdownIcon={ navigationDownIcon }
                                color="neutral"
                                fill="outline"
                                caption="In Progress"
                            />
                        ) }
                        placement="bottom-end"
                    />
                    <Text fontSize="14">Label & trigger for selection using dropdown</Text>
                </FlexRow>
                <FlexRow spacing="18" key="06">
                    <Badge color="neutral" fill="outline" caption="Projects" />
                    <Text fontSize="14">Simple attribute or label</Text>
                </FlexRow>
            </Panel>
        </>
    );
}
