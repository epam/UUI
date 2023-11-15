import React from 'react';
import { FlexRow, LinkButton } from '@epam/uui';
import { ReactComponent as playIcon } from '@epam/assets/icons/common/media-play-outline-18.svg';
import { ReactComponent as navigationIcon } from '@epam/assets/icons/common/navigation-chevron-right-18.svg';

export default function IconPositionExample() {
    return (
        <FlexRow columnGap="18">
            <LinkButton caption="PLAY" link={ { pathname: '/' } } icon={ playIcon } size="48" />
            <LinkButton caption="NEXT STEP" link={ { pathname: '/' } } icon={ navigationIcon } size="48" iconPosition="right" />
        </FlexRow>
    );
}
