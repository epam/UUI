import * as React from 'react';
import { FlexRow, FlexSpacer } from '@epam/promo';
import { BaseDocsBlock, UUI3 } from '../../common';
import { getQuery } from '../../helpers';
import css from './DownloadsDoc.scss';

import { PromoColorsDoc } from './promo/PromoColors.doc';
import { LoveshipColorsDoc } from './loveship/LoveshipColors.doc';

export class ColorsPageDoc extends BaseDocsBlock {
    title = 'Colors';
    renderDocTitle() {
        return (
            <FlexRow>
                <div className={ css.title }>{this.title}</div>
                <FlexSpacer />
                {this.renderMultiSwitch()}
            </FlexRow>
        );
    }

    renderContent(): React.ReactNode {
        return getQuery('skin') === UUI3 ? React.createElement(LoveshipColorsDoc) : React.createElement(PromoColorsDoc);
    }
}
