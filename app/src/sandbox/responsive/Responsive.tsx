import React from 'react';
import css from './Responsive.module.scss';
import { PromoPickerInput } from './PromoPickerInput';
import { LoveshipPickerInput } from './LoveshipPickerInput';
import cx from 'classnames';

export const Responsive: React.FC = () => {
    return (
        <>
            <div className={ cx(css.wrapper, '.uui-theme-promo') }>
                promo:
                <PromoPickerInput type="single" />
                <PromoPickerInput type="multi" />
            </div>
            <div className={ cx(css.wrapper, '.uui-theme-loveship') }>
                loveship:
                <LoveshipPickerInput type="single" />
                <LoveshipPickerInput type="multi" />
            </div>
            ;
        </>
    );
};
