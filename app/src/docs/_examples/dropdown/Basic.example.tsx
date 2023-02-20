import React from 'react';
import { Dropdown, FlexSpacer } from '@epam/uui-components';
import { DropdownBodyProps } from '@epam/uui-core';
import { Panel, Text, FlexRow, LinkButton, DropdownContainer, Badge, IconButton, FlexCell, IconContainer } from '@epam/promo';
import { Avatar, IDropdownToggler } from '@epam/uui';
import css from './BasicExample.scss';
import { ReactComponent as pinIcon } from '@epam/assets/icons/common/action-pin_on-18.svg';
import { ReactComponent as notificationIcon } from '@epam/assets/icons/common/notification-done-12.svg';
import { ReactComponent as aimIcon } from '@epam/assets/icons/common/action-target-18.svg';
import { ReactComponent as telescopeIcon } from '@epam/assets/icons/common/communication-telescope-18.svg';
import { ReactComponent as chatIcon } from '@epam/assets/icons/common/action-chat-18.svg';
import { ReactComponent as githubIcon } from '@epam/assets/icons/common/social-network-github-18.svg';
import { ReactComponent as skypeIcon } from '@epam/assets/icons/common/communication-skype-18.svg';
import { ReactComponent as instaIcon } from '@epam/assets/icons/common/social-network-instagram-18.svg';
import { ReactComponent as shareIcon } from '@epam/assets/icons/common/social-share-18.svg';
import { ReactComponent as phoneIcon } from '@epam/assets/icons/common/communication-phone-18.svg';
import { ReactComponent as mailIcon } from '@epam/assets/icons/common/communication-mail-18.svg';
import { ReactComponent as inIcon } from '@epam/assets/icons/common/social-network-linkedin-18.svg';
import { ReactComponent as geoIcon } from '@epam/assets/icons/common/action-map_pin-18.svg';
import { ReactComponent as rightArrIcon } from '@epam/assets/icons/common/navigation-chevron-right-12.svg';

export default function BasicDropdownExample() {
    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownContainer showArrow={true} cx={css.container} {...props}>
                <FlexRow alignItems="top" padding="18" vPadding="24">
                    <Panel style={{ width: '100%' }}>
                        <FlexRow cx={css.containerItem}>
                            <Avatar size="48" alt="avatar" img="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50" />

                            <FlexRow padding="12">
                                <FlexCell width="auto">
                                    <Text cx={css.textTitle} lineHeight="24" fontSize="16" color="gray80" font="sans-semibold">
                                        John Doe
                                    </Text>
                                    <Text cx={css.text} lineHeight="18" fontSize="12" color="gray60">
                                        Corporate Function Management | L3
                                    </Text>
                                </FlexCell>
                            </FlexRow>
                            <FlexSpacer />
                            <FlexRow spacing="6">
                                <IconButton icon={pinIcon} onClick={() => null} />
                                <IconButton icon={aimIcon} onClick={() => null} />
                            </FlexRow>
                        </FlexRow>

                        <FlexRow>
                            <Panel>
                                <FlexRow alignItems="center" spacing="6">
                                    <Badge
                                        cx={css.badge}
                                        color="green"
                                        size="18"
                                        fill="semitransparent"
                                        icon={notificationIcon}
                                        caption="Available"
                                    />
                                    <Badge cx={css.badge} color="blue" size="18" fill="semitransparent" caption="Bench" />
                                    <Badge cx={css.badge} color="cyan" size="18" fill="semitransparent" caption="Remote" />
                                </FlexRow>
                                <Text cx={css.text} lineHeight="18" fontSize="12" color="gray60">
                                    On vacation till 19 Aug till 26 Aug
                                </Text>
                            </Panel>
                        </FlexRow>
                    </Panel>
                </FlexRow>

                <div className={css.divider}></div>

                <FlexRow padding="18" vPadding="24">
                    <Panel>
                        <FlexRow alignItems="center" spacing="12">
                            <IconButton icon={telescopeIcon} color="blue" onClick={() => null} />
                            <IconButton icon={chatIcon} color="blue" onClick={() => null} />
                            <IconButton icon={githubIcon} color="blue" onClick={() => null} />
                            <IconButton icon={skypeIcon} color="blue" onClick={() => null} />
                            <IconButton icon={instaIcon} color="blue" onClick={() => null} />
                            <IconButton icon={shareIcon} color="blue" onClick={() => null} />
                        </FlexRow>
                        <FlexRow>
                            <Text cx={css.text} lineHeight="18" fontSize="12" color="gray60">
                                Contacts
                            </Text>
                        </FlexRow>

                        <FlexCell width="100%">
                            <FlexRow spacing="6" alignItems="center">
                                <IconContainer icon={phoneIcon} color="gray50" />
                                <LinkButton
                                    onClick={() => {
                                        /*redirect implementation*/
                                    }}
                                    size="36"
                                    color="blue"
                                    caption="+3809324353424"
                                />
                            </FlexRow>
                            <FlexRow spacing="6" alignItems="center">
                                <IconContainer icon={chatIcon} color="gray50" />
                                <LinkButton
                                    onClick={() => {
                                        /*redirect implementation*/
                                    }}
                                    size="36"
                                    color="blue"
                                    caption="x43059"
                                />
                            </FlexRow>
                            <FlexRow spacing="6" alignItems="center">
                                <IconContainer icon={mailIcon} color="gray50" />
                                <LinkButton
                                    onClick={() => {
                                        /*redirect implementation*/
                                    }}
                                    size="36"
                                    color="blue"
                                    caption="user@epam.com"
                                />
                            </FlexRow>
                            <FlexRow spacing="6" alignItems="bottom">
                                <IconContainer icon={inIcon} color="gray50" />
                                <LinkButton
                                    onClick={() => {
                                        /*redirect implementation*/
                                    }}
                                    size="36"
                                    color="blue"
                                    caption="https://www.linkedin.com/fakeid/..."
                                />
                            </FlexRow>
                            <FlexRow spacing="6" alignItems="center">
                                <IconContainer icon={geoIcon} color="gray50" />
                                <Text fontSize="14" lineHeight="18" color="gray80" cx={css.text}>
                                    Gratkorn, Austria UTC+01:00 | 16:54
                                </Text>
                            </FlexRow>
                        </FlexCell>
                    </Panel>
                </FlexRow>

                <div className={css.divider}></div>

                <FlexRow padding="18" vPadding="24">
                    <Panel>
                        <Text cx={css.text} lineHeight="18" fontSize="12" color="gray60">
                            Reporting to
                        </Text>
                        <FlexRow spacing="12" vPadding="12">
                            <Avatar
                                size="42"
                                alt="avatar"
                                img="https://avatars.dicebear.com/api/human/avatar125.svg?background=%23EBEDF5&radius=50"
                            />

                            <div>
                                <Text cx={css.textTitle} lineHeight="24" fontSize="14" color="gray80" font="sans-semibold">
                                    John Wick
                                </Text>
                                <Text cx={css.text} lineHeight="18" fontSize="12" color="gray60">
                                    Senior Management | L4
                                </Text>
                            </div>
                        </FlexRow>
                    </Panel>
                </FlexRow>

                <div className={css.divider}></div>

                <FlexRow padding="18" vPadding="24">
                    <LinkButton onClick={() => {}} caption="Show Reporting Line" size="36" icon={rightArrIcon} iconPosition="right" />
                </FlexRow>
            </DropdownContainer>
        );
    };

    return (
        <Dropdown
            renderBody={props => renderDropdownBody(props)}
            placement="right-start"
            modifiers={[{ name: 'offset', options: { offset: [0, 6] } }]}
            renderTarget={(props: IDropdownToggler) => <LinkButton caption="Click to open" size="36" {...props} />}
        />
    );
}
