import React from 'react';
import { Blocker, FlexCell, FlexRow, FlexSpacer, Panel, RichTextView, SuccessNotification, Text, Tooltip } from '@epam/uui';
import { useUuiContext } from '@epam/uui-core';
import { copyTextToClipboard } from '../../../helpers';
import { useTokensDoc } from '../../../sandbox/tokens/docs/useTokensDoc';
import { ITokensDocGroup, ITokensDocItem } from '../../../sandbox/tokens/docs/types';
import css from './TokenGroups.module.scss';

// The config file with titles and descriptions to data groups and subgroups placed here: ( app/src/sandbox/tokens/docs/config.ts )

export function TokenGroups() {
    const { loading, tokens } = useTokensDoc();

    const renderAllTokens = () => {
        if (loading) {
            return null;
        }
        return tokens.map((group) => <TokensGroup group={ group } level={ 1 } key={ group.id } />);
    };

    return (
        <>
            <Blocker isEnabled={ loading } />
            { renderAllTokens() }
        </>
    );
}

function TokensGroup(props: { group: ITokensDocGroup, level: number }) {
    const { group, level } = props;
    const { title, description } = group;

    if (level === 1) {
        return (
            <div className={ css.root }>
                <RichTextView size="16">
                    <h2 className={ css.groupTitle }>{ title }</h2>
                    <p className={ css.groupInfo }>{ description }</p>
                </RichTextView>
                <Panel background="surface-main" cx={ css.subgroup } shadow={ true }>
                    <TokenGroupChildren group={ group } level={ 2 } />
                </Panel>
            </div>
        );
    }

    return (
        <div>
            <RichTextView size="16">
                <h3 className={ css.subgroupTitle }>{ title }</h3>
                <p>{ description }</p>
            </RichTextView>
            <TokenGroupChildren group={ group } level={ 2 } />
        </div>
    );
}

function TokenGroupChildren(props: { group: ITokensDocGroup, level: number }) {
    const { group, level } = props;
    const { _type } = group;
    const NO_DATA_IN_GROUP = <Text color="info" fontSize="16" fontStyle="italic">The data of this group is in work. It will be soon...</Text>;

    if (_type === 'group_with_subgroups') {
        if (group.subgroups.length) {
            const list = group.subgroups.map((subgroup) => {
                return (
                    <TokensGroup level={ level } group={ subgroup } key={ subgroup.id } />
                );
            });
            return (
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <React.Fragment>
                    { list }
                </React.Fragment>
            );
        }
        return NO_DATA_IN_GROUP;
    } else {
        if (group.items.length) {
            return (
                <TokenGroupItems items={ group.items } />
            );
        }
        return NO_DATA_IN_GROUP;
    }
}

function TokenGroupItems(props: { items: ITokensDocItem[] }) {
    const { items } = props;
    const { uuiNotifications } = useUuiContext();

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

    const list = items.map((item) => {
        const valueBackground = item.value ? `var(${item.cssVar})` : 'transparent';
        return (
            <FlexRow cx={ css.tokenCard } borderBottom={ true } alignItems="center" key={ item.value }>
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
    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <React.Fragment>
            {list}
        </React.Fragment>
    );
}
