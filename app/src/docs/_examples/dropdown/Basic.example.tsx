import React from 'react';
import { Dropdown, FlexSpacer } from '@epam/uui-components';
import { Panel, Text, FlexRow, LinkButton, DropdownContainer, IconButton, FlexCell, IconContainer, Avatar } from '@epam/uui';
import { Badge } from '@epam/promo';
import { IDropdownToggler, DropdownBodyProps } from '@epam/uui-core';
import css from './BasicExample.module.scss';
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
            <DropdownContainer showArrow={ true } cx={ css.container } { ...props }>
                <FlexRow alignItems="top" padding="12" vPadding="24">
                    <Panel style={ { width: '100%' } }>
                        <FlexRow cx={ css.containerItem } padding="6">
                            <Avatar size="48" alt="avatar" img="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50" />

                            <FlexRow padding="12">
                                <FlexCell width="auto">
                                    <Text cx={ css.textTitle } lineHeight="24" fontSize="16" color="primary" font="semibold">
                                        John Doe
                                    </Text>
                                    <Text cx={ css.text } lineHeight="18" fontSize="12" color="secondary">
                                        Corporate Function Management | L3
                                    </Text>
                                </FlexCell>
                            </FlexRow>
                            <FlexSpacer />
                            <FlexRow spacing="6">
                                <IconButton icon={ pinIcon } onClick={ () => null } />
                                <IconButton icon={ aimIcon } onClick={ () => null } />
                            </FlexRow>
                        </FlexRow>

                        <FlexRow padding="6">
                            <Panel>
                                <FlexRow alignItems="center" spacing="6">
                                    <Badge cx={ css.badge } color="green" size="18" fill="semitransparent" icon={ notificationIcon } caption="Available" />
                                    <Badge cx={ css.badge } color="blue" size="18" fill="semitransparent" caption="Bench" />
                                    <Badge cx={ css.badge } color="cyan" size="18" fill="semitransparent" caption="Remote" />
                                </FlexRow>
                                <Text cx={ css.text } lineHeight="18" fontSize="12" color="secondary">
                                    On vacation till 19 Aug till 26 Aug
                                </Text>
                            </Panel>
                        </FlexRow>
                    </Panel>
                </FlexRow>

                <div className={ css.divider }></div>

                <FlexRow padding="12" vPadding="24">
                    <Panel>
                        <FlexRow alignItems="center" spacing="12" padding="6">
                            <IconButton icon={ telescopeIcon } color="info" onClick={ () => null } />
                            <IconButton icon={ chatIcon } color="info" onClick={ () => null } />
                            <IconButton icon={ githubIcon } color="info" onClick={ () => null } />
                            <IconButton icon={ skypeIcon } color="info" onClick={ () => null } />
                            <IconButton icon={ instaIcon } color="info" onClick={ () => null } />
                            <IconButton icon={ shareIcon } color="info" onClick={ () => null } />
                        </FlexRow>
                        <FlexRow padding="6">
                            <Text cx={ css.text } lineHeight="18" fontSize="12" color="secondary">
                                Contacts
                            </Text>
                        </FlexRow>

                        <FlexCell width="100%">
                            <FlexRow spacing="6" alignItems="center" padding="6">
                                <IconContainer icon={ phoneIcon } cx={ css.iconGray50 } />
                                <LinkButton
                                    onClick={ () => {
                                        /* redirect implementation */
                                    } }
                                    size="36"
                                    caption="+3809324353424"
                                />
                            </FlexRow>
                            <FlexRow spacing="6" alignItems="center" padding="6">
                                <IconContainer icon={ chatIcon } cx={ css.iconGray50 } />
                                <LinkButton
                                    onClick={ () => {
                                        /* redirect implementation */
                                    } }
                                    size="36"
                                    caption="x43059"
                                />
                            </FlexRow>
                            <FlexRow spacing="6" alignItems="center" padding="6">
                                <IconContainer icon={ mailIcon } cx={ css.iconGray50 } />
                                <LinkButton
                                    onClick={ () => {
                                        /* redirect implementation */
                                    } }
                                    size="36"
                                    caption="user@epam.com"
                                />
                            </FlexRow>
                            <FlexRow spacing="6" alignItems="bottom" padding="6">
                                <IconContainer icon={ inIcon } cx={ css.iconGray50 } />
                                <LinkButton
                                    onClick={ () => {
                                        /* redirect implementation */
                                    } }
                                    size="36"
                                    caption="https://www.linkedin.com/fakeid/..."
                                />
                            </FlexRow>
                            <FlexRow spacing="6" alignItems="center" padding="6">
                                <IconContainer icon={ geoIcon } cx={ css.iconGray50 } />
                                <Text fontSize="14" lineHeight="18" color="primary" cx={ css.text }>
                                    Gratkorn, Austria UTC+01:00 | 16:54
                                </Text>
                            </FlexRow>
                        </FlexCell>
                    </Panel>
                </FlexRow>

                <div className={ css.divider }></div>

                <FlexRow padding="18" vPadding="24">
                    <Panel>
                        <Text cx={ css.text } lineHeight="18" fontSize="12" color="secondary">
                            Reporting to
                        </Text>
                        <FlexRow spacing="12" vPadding="12">
                            <Avatar size="42" alt="avatar" img="https://avatars.dicebear.com/api/human/avatar125.svg?background=%23EBEDF5&radius=50" />

                            <div>
                                <Text cx={ css.textTitle } lineHeight="24" fontSize="14" color="primary" font="semibold">
                                    John Wick
                                </Text>
                                <Text cx={ css.text } lineHeight="18" fontSize="12" color="secondary">
                                    Senior Management | L4
                                </Text>
                            </div>
                        </FlexRow>
                    </Panel>
                </FlexRow>

                <div className={ css.divider }></div>

                <FlexRow padding="18" vPadding="24">
                    <LinkButton onClick={ () => {} } caption="Show Reporting Line" size="36" icon={ rightArrIcon } iconPosition="right" />
                </FlexRow>
            </DropdownContainer>
        );
    };

    return (
        <Dropdown
            renderBody={ (props) => renderDropdownBody(props) }
            placement="right-start"
            modifiers={ [{ name: 'offset', options: { offset: [0, 6] } }] }
            renderTarget={ (props: IDropdownToggler) => <LinkButton caption="Click to open" size="36" { ...props } /> }
        />
    );
}
