import * as React from 'react';
import css from './AppFooter.module.scss';
import {
    FlexRow, Text, Anchor, IconContainer,
} from '@epam/uui';
import { ReactComponent as EPAMIcon } from '../icons/EPAM.svg';

const EPAM_LINK = 'https://www.epam.com';

export class AppFooter extends React.Component {
    render() {
        return (
            <div className={ css.layout }>
                <FlexRow cx={ css.footer }>
                    <Anchor rawProps={ { tabIndex: -1, 'aria-label': 'EPAM' } } href={ EPAM_LINK } target="_blank">
                        <IconContainer icon={ EPAMIcon } />
                    </Anchor>
                    <Text color="secondary" fontSize="14" lineHeight="24" cx={ css.copyright }>
                        {`© ${new Date().getFullYear()} EPAM Systems. All Rights reserved`}
                    </Text>
                </FlexRow>
            </div>
        );
    }
}
