import React from 'react';
import { BaseDocsBlock } from '../../../common';
import { TokenGroups } from './TokenGroups';
import { RichTextView } from '@epam/uui';
import css from './TokensPage.module.scss';

export class Tokens extends BaseDocsBlock {
    title = 'Tokens';
    subtitle = 'Core tokens are 2nd level of tokens and recommended to use for every case. Also, core tokens uses in the component level. Core tokens have many categories for every role. Find these categories below.';

    renderDocTitle() {
        return (
            <RichTextView size="16">
                <div className={ css.title }>{ this.title }</div>
                <p>{ this.subtitle }</p>
            </RichTextView>
        );
    }

    renderContent() {
        return (
            <TokenGroups />
        );
    }
}
