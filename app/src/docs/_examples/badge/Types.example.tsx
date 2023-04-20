import React from 'react';
import { Badge, Dropdown, FlexRow, Panel, Text } from '@epam/promo';
import { ReactComponent as mediaIcon } from '@epam/assets/icons/common/media-play-fill-18.svg';
import { ReactComponent as doneIcon } from '@epam/assets/icons/common/notification-done-24.svg';
import { ReactComponent as navigationDownIcon } from '@epam/assets/icons/common/navigation-chevron-down-18.svg';

export default function TypesExample() {
    return (
        <>
            <Panel style={{ rowGap: '18px', marginRight: '42px' }}>
                <FlexRow spacing="18">
                    <Badge icon={mediaIcon} color="orange" fill="semitransparent" caption="Video" />
                    <Text fontSize="14">Use as an attribute or label</Text>
                </FlexRow>
                <FlexRow spacing="18">
                    <Badge icon={doneIcon} color="green" fill="semitransparent" caption="Ready" />
                    <Text fontSize="14">View statuses</Text>
                </FlexRow>
                <FlexRow spacing="18">
                    <Badge color="blue" fill="semitransparent" caption="Java" onClear={() => {}} />
                    <Text fontSize="14">Filter chips</Text>
                </FlexRow>
            </Panel>
            <Panel style={{ rowGap: '18px' }}>
                <FlexRow spacing="18">
                    <Badge count={25} color="red" fill="solid" caption="Rejected" onClick={() => {}} />
                    <Text fontSize="14">Quick filters selection with informer</Text>
                </FlexRow>
                <FlexRow spacing="18">
                    <Dropdown
                        renderBody={() => null}
                        renderTarget={(props) => (
                            <Badge
                                {...props}
                                dropdownIcon={navigationDownIcon}
                                dropdownIconPosition="right"
                                color="gray30"
                                fill="semitransparent"
                                caption="In Progress"
                            />
                        )}
                        placement="bottom-end"
                    />
                    <Text fontSize="14">Label & trigger for selection using dropdown</Text>
                </FlexRow>
                <FlexRow spacing="18">
                    <Badge color="gray30" fill="semitransparent" caption="Projects" />
                    <Text fontSize="14">Simple attribute or label</Text>
                </FlexRow>
            </Panel>
        </>
    );
}
