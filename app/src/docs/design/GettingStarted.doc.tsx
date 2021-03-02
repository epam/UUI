import * as React from 'react';
import { FlexRow, FlexSpacer } from '@epam/promo';
import { EditableDocContent, BaseDocsBlock, UUI3 } from '../../common';
import * as css from '../assets/DownloadsDoc.scss';

export class GettingStartedForDesignersDoc extends BaseDocsBlock {
    title = 'Getting Started';

    renderDocTitle() {
        return (
            <FlexRow>
                <div className={ css.title }>{ this.title }</div>
                <FlexSpacer />
                { this.renderMultiSwitch() }
            </FlexRow>
        );
    }

    renderLoveshipContent() {
        return <EditableDocContent key='gettingStarted-for-designers-uui3' fileName='gettingStarted-for-designers-uui3' />;
    }

    renderPromoContent() {
        return <EditableDocContent key='gettingStarted-for-designers-uui4' fileName='gettingStarted-for-designers-uui4' />;
    }

    renderContent() {
        return (
            <>
                { this.getQuery('skin') === UUI3 ? this.renderLoveshipContent() : this.renderPromoContent() }
            </>
        );
    }
}
