import React from 'react';
import { Button, FlexRow, IconContainer, RichTextView, Tooltip } from '@epam/promo';
import { ReactComponent as copyIcon } from '@epam/assets/icons/common/content-link-18.svg';
import { ReactComponent as plusIcon } from '@epam/assets/icons/common/content-add-fill-18.svg';
import { ReactComponent as infoIcon } from '@epam/assets/icons/common/notification-info-fill-18.svg';

export default function TypesTooltipExample() {
    const renderTypesMarkup = () => <RichTextView>
        <h5>Infotip</h5>
        <p>Infotip has a title and description? that can have up to 3 rows.</p>
    </RichTextView>;

    return (
        <FlexRow spacing='12' >
            <Tooltip content='Compact' placement='bottom'>
                <Button icon={copyIcon} caption='Copy' fill='white' color='blue' onClick={ () => null } />
            </Tooltip>

            <Tooltip content={ renderTypesMarkup() } placement='bottom' color='white' >
                <Button icon={plusIcon} onClick={ () => null } />
            </Tooltip>

            <FlexRow alignItems="center">
                <RichTextView>
                    <span style={{marginRight: "4px", fontSize: "18px", fontWeight: 600}}>Permissions</span>
                </RichTextView>
                <Tooltip content='Default tooltip. Can be inside as one row as 3 rows of text' placement='bottom' >
                    <IconContainer icon={infoIcon} color='blue' />
                </Tooltip>
            </FlexRow>
        </FlexRow>
    );
}