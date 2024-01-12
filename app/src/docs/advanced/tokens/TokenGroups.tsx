import React, { ReactNode, useEffect } from 'react';
import { Blocker, FlexCell, FlexRow, FlexSpacer, Panel, RichTextView, SuccessNotification, Text, Tooltip } from '@epam/uui';
import { useUuiContext } from '@epam/uui-core';
import { copyTextToClipboard } from '../../../helpers';
import { useTokensDoc } from '../../../sandbox/tokens/docs/useTokensDoc';
import { ITokensDocGroup, ITokensDocItem } from '../../../sandbox/tokens/docs/types';
import css from './TokensPage.module.scss';

interface TokenGroupsProps {
    setTitleAndSubtitle: (title: string, subtitle: string) => void
}

// There the config file with titles and descriptions to data groups and subgroups (app/src/sandbox/tokens/docs/config.ts)

export function TokenGroups({ setTitleAndSubtitle }: TokenGroupsProps) {
    const { uuiNotifications } = useUuiContext();
    const { loading, tokens } = useTokensDoc();

    useEffect(() => {
        if (!loading && tokens?.children?.length) {
            setTitleAndSubtitle(tokens.title, tokens.description);
        }
    }, [loading, setTitleAndSubtitle]);

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
                        { tokensCard.children.length ? renderCardTitle(tokensCard.children) : <Text color="warning" fontSize="16">The data of this group is in work. They will be soon...</Text> }
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
                    <div key={ item.id }>
                        <RichTextView size="16">
                            <h3 className={ css.subgroupTitle }>{ item.title }</h3>
                            <p>{ item.description}</p>
                        </RichTextView>
                        {cardBody}
                    </div>
                );
            });
        } else {
            return renderCardBody(tokenItemArray);
        }
    };

    const renderCardBody = (itemBodyArray: ITokensDocItem[]) => {
        return itemBodyArray.map((item, index) => {
            const valueNotPresent = item.value ? null : 'No data...'; // this marker uses to show text only if the value not present
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
            { !loading && tokens?.children?.length && tokens?.children.map((tokensCard, index) => (
                <div className={ css.root } key={ tokensCard.description + index }>
                    {renderCard(tokensCard)}
                </div>
            )) }
        </>
    );
}
