import React from 'react';
import { Button, FlexRow, IconButton, RichTextView, Text, Tooltip } from '@epam/uui';
import { ReactComponent as copyIcon } from '@epam/assets/icons/common/content-link-18.svg';
import { ReactComponent as plusIcon } from '@epam/assets/icons/common/content-add-fill-18.svg';
import { ReactComponent as infoIcon } from '@epam/assets/icons/common/notification-info-outline-18.svg';
import css from './TypesExample.module.scss';

export default function TypesTooltipExample() {
    const renderTypesMarkup = () => (
        <RichTextView>
            <h5>Infotip</h5>
            <p>Infotip has a title and description, that can have up to 3 rows.</p>
        </RichTextView>
    );

    return (
        <div className={ css.container }>
            <Tooltip
                content="Copy to clipboard"
                rawProps={ { id: 'copyTooltip' } }
            >
                <Button
                    rawProps={ {
                        'aria-describedby': 'copyTooltip',
                    } }
                    icon={ copyIcon }
                    caption="Copy"
                    fill="outline"
                    color="primary"
                    cx={ css.firstColumn }
                    onClick={ () => null }
                />
            </Tooltip>

            <FlexRow size={ null } alignItems="center" cx={ css.firstColumn }>
                <RichTextView>
                    <span className={ css.permissionText }>Permissions</span>
                </RichTextView>
                <Tooltip
                    rawProps={ {
                        id: 'permissionTooltip',
                    } }
                    content="Default tooltip. Can be inside as one row as 3 rows of text"
                >
                    <IconButton
                        rawProps={ {
                            'aria-describedby': 'permissionTooltip',
                            'aria-label': 'More information about permissions',
                        } }
                        icon={ infoIcon }
                        color="primary"
                        onClick={ () => null }
                    />
                </Tooltip>
            </FlexRow>

            <Tooltip
                rawProps={ {
                    id: 'addTooltip',
                } }
                content={ renderTypesMarkup() }
                color="neutral"
            >
                <Button
                    rawProps={ {
                        'aria-describedby': 'addTooltip',
                        'aria-label': 'Add file',
                    } }
                    icon={ plusIcon }
                    onClick={ () => null }
                    cx={ css.firstColumn }
                />
            </Tooltip>

            <Text fontSize="14" cx={ css.secondColumn }>
                Compact tooltip normally uses to deliver small hint, 1-4 words
            </Text>
            <Text fontSize="14" cx={ css.secondColumn }>
                Default tooltip use to deliver important hint, that can have a sentence mostly
            </Text>
            <Text fontSize="14" cx={ css.secondColumn }>
                Infotip uses to deliver a hint in a more structured way, as it has a title (e.g. start from action name)
            </Text>
        </div>
    );
}
