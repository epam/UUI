import React, { useState } from 'react';
import { Dropdown, FlexSpacer } from '@epam/uui-components';
import { offset } from '@floating-ui/react';
import {
    Panel,
    Text,
    FlexRow,
    LinkButton,
    DropdownContainer,
    IconButton,
    FlexCell,
    IconContainer,
    Avatar,
    TimePicker,
    TimePickerValue,
} from '@epam/uui';
import { IDropdownToggler, DropdownBodyProps } from '@epam/uui-core';
import css from './BasicExample.module.scss';
import { ReactComponent as pinIcon } from '@epam/assets/icons/action-pin_on-fill.svg';
import { ReactComponent as aimIcon } from '@epam/assets/icons/action-target-fill.svg';
import { ReactComponent as telescopeIcon } from '@epam/assets/icons/internal_logo/telescope-fill.svg';
import { ReactComponent as chatIcon } from '@epam/assets/icons/external_logo/microsoft_teams-fill.svg';
import { ReactComponent as teamsIcon } from '@epam/assets/icons/external_logo/microsoft_teams-outline.svg';
import { ReactComponent as githubIcon } from '@epam/assets/icons/external_logo/github-fill.svg';
import { ReactComponent as instaIcon } from '@epam/assets/icons/external_logo/instagram-outline.svg';
import { ReactComponent as shareIcon } from '@epam/assets/icons/action-social_share-outline.svg';
import { ReactComponent as phoneIcon } from '@epam/assets/icons/communication-phone-outline.svg';
import { ReactComponent as mailIcon } from '@epam/assets/icons/communication-mail-outline.svg';
import { ReactComponent as inIcon } from '@epam/assets/icons/external_logo/linkedin-outline.svg';
import { ReactComponent as geoIcon } from '@epam/assets/icons/action-map_pin-outline.svg';
import { ReactComponent as rightArrIcon } from '@epam/assets/icons/navigation-chevron_right-outline.svg';
import { Tag } from '@epam/electric';

export default function BasicDropdownExample() {
    const [state, setState] = useState<TimePickerValue>({ hours: 0, minutes: 0 });

    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownContainer showArrow={ true } cx={ css.container } { ...props }>
                <FlexRow alignItems="top" padding="12" vPadding="24">
                    <Panel background="surface-main" style={ { width: '100%' } }>
                        <FlexRow cx={ css.containerItem } padding="6">
                            <Avatar size="48" alt="avatar" img="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4" />

                            <FlexRow padding="12">
                                <FlexCell width="auto">
                                    <Text cx={ css.text } lineHeight="24" fontSize="16" color="primary" fontWeight="600">
                                        John Doe
                                    </Text>
                                    <Text cx={ css.text } lineHeight="18" fontSize="12" color="secondary">
                                        Corporate Function Management | L3
                                    </Text>
                                </FlexCell>
                            </FlexRow>
                            <FlexSpacer />
                            <FlexRow columnGap="6" alignItems="top">
                                <IconButton size="18" icon={ pinIcon } onClick={ () => null } />
                                <IconButton size="18" icon={ aimIcon } onClick={ () => null } />
                            </FlexRow>
                        </FlexRow>

                        <FlexRow padding="6">
                            <Panel background="surface-main">
                                <FlexRow alignItems="center" columnGap="6">
                                    <Tag fill="outline" color="success" size="18" caption="Available" />
                                    <Tag fill="outline" color="critical" size="18" caption="Bench" />
                                    <Tag fill="outline" color="info" size="18" caption="Remote" />
                                </FlexRow>
                                <Text cx={ css.text } lineHeight="18" fontSize="12" color="secondary">
                                    On vacation from 19 Aug till 26 Aug
                                </Text>
                            </Panel>
                        </FlexRow>

                        <FlexRow alignItems="center" columnGap="12" padding="6">
                            <IconButton size="18" icon={ telescopeIcon } color="primary" onClick={ () => null } />
                            <IconButton size="18" icon={ chatIcon } color="primary" onClick={ () => null } />
                            <IconButton size="18" icon={ githubIcon } color="primary" onClick={ () => null } />
                            <IconButton size="18" icon={ instaIcon } color="primary" onClick={ () => null } />
                            <IconButton size="18" icon={ shareIcon } color="primary" onClick={ () => null } />
                        </FlexRow>
                    </Panel>
                </FlexRow>

                <div className={ css.divider }></div>

                <FlexRow padding="12" vPadding="18">
                    <Panel background="surface-main">
                        <FlexRow size="24">
                            <Text cx={ css.text } lineHeight="18" fontSize="12" color="secondary" fontWeight="700">
                                Contacts
                            </Text>
                        </FlexRow>

                        <FlexCell width="100%">
                            <FlexRow columnGap="12" alignItems="center" padding="6">
                                <IconContainer size={ 18 } icon={ phoneIcon } cx={ css.iconGray50 } />
                                <LinkButton
                                    onClick={ () => {
                                        /* redirect implementation */
                                    } }
                                    size="36"
                                    caption="+3809324353424"
                                    weight="regular"
                                />
                            </FlexRow>
                            <FlexRow columnGap="12" alignItems="center" padding="6">
                                <IconContainer size={ 18 } icon={ teamsIcon } cx={ css.iconGray50 } />
                                <LinkButton
                                    onClick={ () => {
                                        /* redirect implementation */
                                    } }
                                    size="36"
                                    caption="x43059"
                                    weight="regular"
                                />
                            </FlexRow>
                            <FlexRow columnGap="12" alignItems="center" padding="6">
                                <IconContainer size={ 18 } icon={ mailIcon } cx={ css.iconGray50 } />
                                <LinkButton
                                    onClick={ () => {
                                        /* redirect implementation */
                                    } }
                                    size="36"
                                    caption="user@epam.com"
                                    weight="regular"
                                />
                            </FlexRow>
                            <FlexRow columnGap="12" alignItems="bottom" padding="6">
                                <IconContainer size={ 18 } icon={ inIcon } cx={ css.iconGray50 } />
                                <LinkButton
                                    onClick={ () => {
                                        /* redirect implementation */
                                    } }
                                    size="36"
                                    caption="https://www.linkedin.com/fakeid/..."
                                    weight="regular"
                                />
                            </FlexRow>
                            <FlexRow columnGap="12" alignItems="center" padding="6">
                                <IconContainer size={ 18 } icon={ geoIcon } cx={ css.iconGray50 } />
                                <Text fontSize="14" lineHeight="18" color="primary" cx={ css.text }>
                                    Gratkorn, Austria UTC+01:00 | 16:54
                                </Text>
                            </FlexRow>
                        </FlexCell>
                    </Panel>
                </FlexRow>

                <div className={ css.divider }></div>

                <FlexRow padding="18" vPadding="24">
                    <Panel background="surface-main">
                        <Text cx={ css.text } lineHeight="18" fontSize="12" color="secondary" fontWeight="600">
                            Reporting to
                        </Text>
                        <FlexRow columnGap="12" vPadding="12">
                            <Avatar size="42" alt="avatar" img="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4" />

                            <div>
                                <Text cx={ css.text } lineHeight="24" fontSize="14" color="primary" fontWeight="600">
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

                <TimePicker value={ state } onValueChange={ (val) => setState(val) } />

            </DropdownContainer>
        );
    };

    return (
        <Dropdown
            renderBody={ (props) => renderDropdownBody(props) }
            placement="right-start"
            middleware={ [offset(6)] }
            renderTarget={ (props: IDropdownToggler) => <LinkButton caption="Click to open" size="36" { ...props } /> }
        />
    );
}
