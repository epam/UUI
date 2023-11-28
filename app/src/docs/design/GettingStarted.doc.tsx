import * as React from 'react';
import { FlexRow, FlexSpacer } from '@epam/promo';
import { EditableDocContent, BaseDocsBlock } from '../../common';
import { getQuery } from '../../helpers';
import css from '../assets/DownloadsDoc.module.scss';
import { TSkin } from '@epam/uui-docs';

export class GettingStartedForDesignersDoc extends BaseDocsBlock {
    title = 'Getting Started';
    renderDocTitle() {
        return (
            <FlexRow>
                <div className={ css.title }>{this.title}</div>
                <FlexSpacer />
                {this.renderSkinSwitcher()}
            </FlexRow>
        );
    }

    renderLoveshipContent() {
        return <EditableDocContent key="gettingStarted-for-designers-uui3" fileName="gettingStarted-for-designers-uui3" />;
    }

    renderPromoContent() {
        return <EditableDocContent key="gettingStarted-for-designers-uui4" fileName="gettingStarted-for-designers-uui4" />;
    }

    renderContent() {
        return getQuery('skin') === TSkin.Loveship ? this.renderLoveshipContent() : this.renderPromoContent();
    }
}
