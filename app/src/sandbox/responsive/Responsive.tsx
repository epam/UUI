import React from 'react';
import css from './Responsive.module.scss';
import { PromoPickerInput } from './PromoPickerInput';
import { LoveshipPickerInput } from './LoveshipPickerInput';
import cx from 'classnames';

export function Responsive() {
    return (
        <>
            <div className={ cx(css.wrapper, css.uuiThemePromo) }>
                promo:
                <PromoPickerInput type="single" />
                <PromoPickerInput type="multi" />
            </div>
            <div className={ cx(css.wrapper, css.uuiThemeLoveship) }>
                loveship:
                <LoveshipPickerInput type="single" />
                <LoveshipPickerInput type="multi" />
            </div>
        </>
    );
}
