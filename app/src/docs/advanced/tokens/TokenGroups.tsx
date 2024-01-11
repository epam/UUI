import React, { ReactNode } from 'react';
import { Blocker, FlexCell, FlexRow, FlexSpacer, Panel, RichTextView, SuccessNotification, Text, Tooltip } from '@epam/uui';
import { useUuiContext } from '@epam/uui-core';
import { copyTextToClipboard } from '../../../helpers';
import { useTokensDoc } from '../../../sandbox/tokens/docs/useTokensDoc';
import { ITokensDocGroup, ITokensDocItem } from '../../../sandbox/tokens/docs/types';
import css from './TokensPage.module.scss';

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

    // type guard to determine the type of tokenItem
    function isTokensDocGroup(tokenGroup: ITokensDocGroup | ITokensDocItem): tokenGroup is ITokensDocGroup {
        return 'id' in tokenGroup;
    }

    // type guard to determine the type of tokenItem array
    function isTokensDocGroupArray(tokenItem: ITokensDocGroup[] | ITokensDocItem[]): tokenItem is ITokensDocGroup[] {
        return tokenItem.length > 0 && 'id' in tokenItem[0];
    }

    const renderCard = (tokensCard: ITokensDocGroup | ITokensDocItem) => {
        if (isTokensDocGroup(tokensCard)) {
            return (
                <>
                    <RichTextView size="16">
                        <h2 className={ css.groupTitle }>{ tokensCard.title }</h2>
                        <p className={ css.groupInfo }>{ tokensCard.description }</p>
                    </RichTextView>
                    <Panel background="surface-main" cx={ css.subgroup } shadow={ true }>
                        { renderCardTitle(tokensCard.children) }
                    </Panel>
                </>
            );
        }
    };

    const renderCardTitle = (tokenItemArray: ITokensDocGroup[] | ITokensDocItem[]) => {
        let cardBody: null | ReactNode = null;

        if (isTokensDocGroupArray(tokenItemArray)) {
            return tokenItemArray.map((item) => {
                if (item?.children && item?.children.length && !isTokensDocGroupArray(item.children)) {
                    cardBody = renderCardBody(item.children);
                }
                return (
                    <>
                        <RichTextView size="16">
                            <h3 className={ css.subgroupTitle }>{ item.title }</h3>
                            <p>{ item.description}</p>
                        </RichTextView>
                        {cardBody}
                    </>
                );
            });
        } else {
            return renderCardBody(tokenItemArray);
        }
    };

    const renderCardBody = (itemBodyArray: ITokensDocItem[]) => {
        return itemBodyArray.map((item) => {
            const valueNotPresent = item.value ? null : 'No data...'; // this marker uses to show text only if the value not present
            const valueBackground = item.value ? `var(${item.cssVar})` : 'transparent';

            return (
                <FlexRow cx={ css.tokenCard } borderBottom={ true }>
                    <FlexCell width="auto">
                        <Tooltip content={ `Copy var(${item.cssVar}) to clipboard` } placement="top" openDelay={ 200 }>
                            <Text cx={ css.var } onClick={ () => copyTextToClipboard(item.cssVar, () => showNotification(item.cssVar)) }>{ item.cssVar }</Text>
                        </Tooltip>
                        <Text>{ item.description || (item.useCases ? null : 'No description...') }</Text>
                        <Text cx={ css.tokenCardInfo }>{ item.useCases || 'No useCases data...' }</Text>
                    </FlexCell>
                    <FlexSpacer />
                    <FlexCell width="auto" alignSelf="flex-start">
                        <Tooltip content={ item.value || 'No data' } placement="top" openDelay={ 200 }>
                            <div className={ css.colorViewer } style={ { backgroundColor: valueBackground } }>
                                { valueNotPresent && <Text children={ valueNotPresent } color="critical" fontWeight="600" /> }
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
            { !loading && tokens?.children?.length && tokens?.children.map((tokensCard) => (
                <div className={ css.root }>
                    {renderCard(tokensCard)}
                </div>
            )) }
        </>
    );
}
