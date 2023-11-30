import * as React from 'react';
import { FlexRow, FlexSpacer } from '@epam/uui';
import { BaseDocsBlock } from '../../common';
import { getQuery } from '../../helpers';
import css from './DownloadsDoc.module.scss';

import { PromoColorsDoc } from './promo/PromoColors.doc';
import { LoveshipColorsDoc } from './loveship/LoveshipColors.doc';
import { TSkin } from '@epam/uui-docs';

export class ColorsPageDoc extends BaseDocsBlock {
    title = 'Colors';
    renderDocTitle() {
        return (
            <FlexRow>
                <div className={ css.title }>{this.title}</div>
                <FlexSpacer />
                {this.renderSkinSwitcher()}
            </FlexRow>
        );
    }

    renderContent(): React.ReactNode {
        return getQuery('skin') === TSkin.Loveship ? React.createElement(LoveshipColorsDoc) : React.createElement(PromoColorsDoc);
    }
}
