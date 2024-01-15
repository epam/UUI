import React, { ReactNode } from 'react';
import { Blocker, FlexCell, FlexRow, FlexSpacer, Panel, RichTextView, SuccessNotification, Text, Tooltip } from '@epam/uui';
import { useUuiContext } from '@epam/uui-core';
import { copyTextToClipboard } from '../../../helpers';
import { useTokensDoc } from '../../../sandbox/tokens/docs/useTokensDoc';
import { isGroupWithItems, isGroupWithItemsArray, isGroupWithSubgroups, ITokensDocGroup, ITokensDocGroupWithItems, ITokensDocItem } from '../../../sandbox/tokens/docs/types';
import css from './TokensPage.module.scss';

// The config file with titles and descriptions to data groups and subgroups placed here: ( app/src/sandbox/tokens/docs/config.ts )

export function TokenGroups() {
    const { uuiNotifications } = useUuiContext();
    const { loading, tokens } = useTokensDoc();

    const showNotification = (color: string) => {
        uuiNotifications
            .show(
                (props) => (
                    <SuccessNotification { ...props }>
                        <Text size="36" fontSize="14">
                            { `The (${color}) token successfully copied to clipboard!` }
                        </Text>
                    </SuccessNotification>
                ),
                { position: 'bot-left' },
            )
            .catch(() => null);
    };

    const renderCardSubgroup = (tokensCard: ITokensDocGroup, index: number) => {
        let CARD: ReactNode;
        const TEXT = <Text color="info" fontSize="16" fontStyle="italic">The data of this group is in work. It will be soon...</Text>;

        if (isGroupWithSubgroups(tokensCard)) {
            CARD = tokensCard.subgroups.length ? renderCardTitle(tokensCard.subgroups) : TEXT;
        } else {
            CARD = tokensCard.items.length ? renderCardTitle(tokensCard.items) : TEXT;
        }
        return (
            <div className={ css.root } key={ tokensCard.description + index }>
                <RichTextView size="16">
                    <h2 className={ css.groupTitle }>{ tokensCard.title }</h2>
                    <p className={ css.groupInfo }>{ tokensCard.description }</p>
                </RichTextView>
                <Panel background="surface-main" cx={ css.subgroup } shadow={ true }>
                    {CARD}
                </Panel>
            </div>
        );
    };

    const renderGroupWithItemsArray = (item: ITokensDocGroupWithItems) => {
        let CARD_BODY: ReactNode;

        if (item?.items && item?.items.length) {
            CARD_BODY = renderCardBody(item.items);
        }
        return (
            <div key={ item.id }>
                <RichTextView size="16">
                    <h3 className={ css.subgroupTitle }>{ item.title }</h3>
                    <p>{ item.description }</p>
                </RichTextView>
                {CARD_BODY}
            </div>
        );
    };

    const renderCardTitle = (tokenItemArray: ITokensDocGroup[] | ITokensDocItem[]) => {
        if (isGroupWithItemsArray(tokenItemArray)) {
            return tokenItemArray.map((item) => renderGroupWithItemsArray(item));
        } else if (isGroupWithItems(tokenItemArray)) {
            return renderCardBody(tokenItemArray);
        }
    };

    const renderCardBody = (itemBodyArray: ITokensDocItem[]) => {
        return itemBodyArray.map((item, index) => {
            const valueBackground = item.value ? `var(${item.cssVar})` : 'transparent';

            return (
                <FlexRow key={ item.value + index } cx={ css.tokenCard } borderBottom={ true } alignItems="center">
                    <FlexCell width="auto">
                        <Tooltip content={ `Copy var(${item.cssVar}) to clipboard` } placement="top" openDelay={ 200 }>
                            <Text cx={ css.var } onClick={ () => copyTextToClipboard(item.cssVar, () => showNotification(item.cssVar)) }>{ item.cssVar }</Text>
                        </Tooltip>
                        {/* { item.description && <Text>{ item.description }</Text> } */}
                        {/* { item.useCases && <Text cx={ css.tokenCardInfo }>{ item.useCases }</Text> } */}
                    </FlexCell>
                    <FlexSpacer />
                    <FlexCell width="auto">
                        <Tooltip content={ item.value || 'No data' } placement="top" openDelay={ 200 }>
                            <div className={ css.colorViewer } style={ { backgroundColor: valueBackground } }>
                                { !item.value && <Text color="critical" fontWeight="600">No data...</Text> }
                            </div>
                        </Tooltip>
                    </FlexCell>
                </FlexRow>
            );
        });
    };

    return (
        <>
            <Blocker isEnabled={ loading } />
            { !loading && isGroupWithSubgroups(tokens) && tokens?.subgroups.map((tokensCard, index) => renderCardSubgroup(tokensCard, index)) }
        </>
    );
}
