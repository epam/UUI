import * as css from './Copyright.scss';
import * as React from "react";
import { Anchor, IconContainer, Text } from "@epam/promo";
import { ReactComponent as EPAMIcon } from "../../../icons/EPAM.svg";

const EPAM_LINK = 'https://www.epam.com';

Copyright.displayName = 'Copyright';
export function Copyright() {
    return (
        <div className={ css.container }>
            <Anchor rawProps={ { tabIndex: -1, "aria-label": "EPAM" } } href={ EPAM_LINK } target='_blank' >
                <IconContainer icon={ EPAMIcon } />
            </Anchor>
            <Text color='gray60' font='sans' fontSize='14' lineHeight='24' cx={ css.copyright } >© 2020 EPAM Systems. All Rights reserved</Text>
        </div>
    );
}
