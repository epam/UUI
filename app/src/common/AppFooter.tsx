import * as React from 'react';
import css from './AppFooter.scss';
import { FlexRow, Text, Anchor, IconContainer } from '@epam/promo';
import { ReactComponent as EPAMIcon } from '../icons/EPAM.svg';

const EPAM_LINK = 'https://www.epam.com';

export class AppFooter extends React.Component {
    render() {
        return (
            <div className={css.layout}>
                <FlexRow cx={css.footer}>
                    <Anchor rawProps={{ tabIndex: -1, 'aria-label': 'EPAM' }} href={EPAM_LINK} target="_blank">
                        <IconContainer icon={EPAMIcon} />
                    </Anchor>
                    <Text color="gray60" font="sans" fontSize="14" lineHeight="24" cx={css.copyright}>
                        © 2020 EPAM Systems. All Rights reserved
                    </Text>
                </FlexRow>
            </div>
        );
    }
}
