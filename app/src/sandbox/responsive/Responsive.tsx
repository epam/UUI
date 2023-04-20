import React from 'react';
import css from './Responsive.scss';
import { PromoPickerInput } from './PromoPickerInput';
import { LoveshipPickerInput } from './LoveshipPickerInput';

export const Responsive: React.FC = () => {
    return (
        <div className={ css.wrapper }>
            promo:
            <PromoPickerInput type="single" />
            <PromoPickerInput type="multi" />
            loveship:
            <LoveshipPickerInput type="single" />
            <LoveshipPickerInput type="multi" />
        </div>
    );
};
