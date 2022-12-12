import React from 'react';
import { Button, FlexRow, IconContainer, RichTextView, Text, Tooltip } from '@epam/promo';
import { ReactComponent as copyIcon } from '@epam/assets/icons/common/content-link-18.svg';
import { ReactComponent as plusIcon } from '@epam/assets/icons/common/content-add-fill-18.svg';
import { ReactComponent as infoIcon } from '@epam/assets/icons/common/notification-info-fill-18.svg';
import css from './TypesExample.scss';

export default function TypesTooltipExample() {
    const renderTypesMarkup = () => <RichTextView>
        <h5>Infotip</h5>
        <p>Infotip has a title and description? that can have up to 3 rows.</p>
    </RichTextView>;

    return (
        <div className={ css.container } >
            <Tooltip content='Compact' placement='bottom'>
                <Button icon={ copyIcon } caption='Copy' fill='white' color='blue'
                cx={ css.firstColumn } onClick={ () => null } />
            </Tooltip>

            <FlexRow alignItems="center" cx={ css.firstColumn }>
                <RichTextView>
                    <span style={ {marginRight: "4px", fontSize: "18px", fontWeight: 600} }>Permissions</span>
                </RichTextView>
                <Tooltip content='Default tooltip. Can be inside as one row as 3 rows of text' placement='bottom' >
                    <IconContainer icon={ infoIcon } color='blue' />
                </Tooltip>
            </FlexRow>

            <Tooltip content={ renderTypesMarkup() } placement='bottom' color='white' >
                <Button icon={ plusIcon } onClick={ () => null } cx={ css.firstColumn } />
            </Tooltip>

            <Text fontSize='14' cx={ css.secondColumn }>Compact tooltip normally uses to deliver small hint, 1-4 words</Text>
            <Text fontSize='14' cx={ css.secondColumn }>Default tooltip use to deliver important hint, that can have a sentence mostly</Text>
            <Text fontSize='14' cx={ css.secondColumn }>Infotip uses to deliver a hint in a more structured way, as it has a title (eg. start from action name)</Text>
        </div>
    );
}