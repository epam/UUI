import * as React from 'react';
import { FlexRow, FlexSpacer } from '@epam/promo';
import * as css from './DownloadsDoc.scss';
import { BaseDocsBlock, UUI3 } from '../../common/docs';

import { PromoColorsDoc } from './promo/PromoColors.doc';
import { LoveshipColorsDoc as LoveshipColorsDoc } from './loveship/LoveshipColors.doc';

export class ColorsPageDoc extends BaseDocsBlock {
    title = 'Colors';

    renderDocTitle() {
        return (
            <FlexRow>
                <div className={ css.title }>{ this.title }</div>
                <FlexSpacer />
                { this.renderMultiSwitch() }
            </FlexRow>
        );
    }

    renderContent(): React.ReactNode {
        return (
            <>
                { this.getQuery('skin') === UUI3 ? React.createElement(LoveshipColorsDoc) : React.createElement(PromoColorsDoc) }
            </>
        );
    }
}