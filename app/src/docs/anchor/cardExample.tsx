import { FlexSpacer, IconContainer } from '@epam/uui-components';
import { FlexCell, FlexRow, Panel, Text } from '@epam/uui';
import * as React from 'react';
import css from './cardExample.module.scss';
import { ReactComponent as gitIcon } from '@epam/assets/icons/common/social-network-github-18.svg';
import { ReactComponent as PinterestIcon } from '@epam/assets/icons/common/social-network-pinterest-18.svg';
import { ReactComponent as InstagramIcon } from '@epam/assets/icons/common/social-network-instagram-18.svg';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/notification-info-outline-18.svg';
import { ReactComponent as GearIcon } from '@epam/assets/icons/common/action-settings-12.svg';

export function CardExample() {
    return (
        <Panel cx={ css.panel } style={ { display: 'inline-flex' } }>
            <FlexRow alignItems="center" columnGap="6" cx={ css.iconRow }>
                <IconContainer icon={ gitIcon } cx={ css.icon } />
                <IconContainer icon={ PinterestIcon } cx={ css.icon } />
                <IconContainer icon={ InstagramIcon } cx={ css.icon } />
                <FlexSpacer />
                <IconContainer icon={ InfoIcon } cx={ css.icon } />
            </FlexRow>
            <FlexRow alignItems="center" columnGap="12" margin="12">
                <FlexCell width="100%">
                    <Text cx={ css.text } lineHeight="24" fontSize="16" color="secondary">
                        John Doe
                    </Text>
                    <Text cx={ css.text } lineHeight="18" fontSize="12" color="secondary">
                        Corporate Function Management | L3
                    </Text>
                </FlexCell>
            </FlexRow>
            <FlexRow padding="12" columnGap="6" cx={ css.footer }>
                <IconContainer icon={ GearIcon } cx={ css.icon } />
                <FlexSpacer />
                <Text size="36" color="secondary">
                    98%
                </Text>
            </FlexRow>
        </Panel>
    );
}
