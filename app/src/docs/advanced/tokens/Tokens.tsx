import React from 'react';
import { BaseDocsBlock } from '../../../common';
import { TokenGroups } from './TokenGroups';
import { Blocker, RichTextView } from '@epam/uui';
import css from './TokensPage.module.scss';

export class Tokens extends BaseDocsBlock {
    title: string;
    subtitle: string;

    setTitleAndSubtitle = (title: string, subtitle: string) => {
        this.title = title;
        this.subtitle = subtitle;
        this.forceUpdate(); // This is crucial since class properties don't trigger a re-render.
    };

    renderDocTitle() {
        return (
            <>
                <Blocker isEnabled={ !this.title && !this.subtitle } />
                { this.title && this.subtitle && (
                    <RichTextView size="16">
                        <div className={ css.title }>{ this.title }</div>
                        <p>{ this.subtitle }</p>
                    </RichTextView>
                ) }
            </>
        );
    }

    renderContent() {
        return (
            <TokenGroups setTitleAndSubtitle={ this.setTitleAndSubtitle } />
        );
    }
}
