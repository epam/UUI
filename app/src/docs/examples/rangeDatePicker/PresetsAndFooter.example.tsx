import React, { useState } from 'react';
import { RangeDatePicker, FlexRow, Text } from '@epam/promo';
import { rangeDatePickerPresets, RangeDatePickerValue } from '@epam/uui-components';
import moment from 'moment';
import * as css from './PresetsAndFooter.scss';

export const DatePickerBaseExample = () => {
    const [value, onValueChange] = useState({from: null, to: null});

    return (
        <FlexRow>
            <RangeDatePicker
                value={ value }
                onValueChange={ onValueChange }
                format='MMM D, YYYY'
                presets={ {
                    ...rangeDatePickerPresets,
                    last3Days: {
                        name: 'Last 3 days',
                        getRange: () => {
                            return {from: moment().subtract(3, 'day').toString(), to: moment().toString(), order: 11};
                        },
                    },
                    last7Days: {
                        name: 'Last 7 days',
                        getRange: () => {
                            return {from: moment().subtract(7, 'day').toString(), to: moment().toString(), order: 12};
                        },
                    },
                } }
                renderFooter={ (value: RangeDatePickerValue) => <div className={ css.container }>
                    <FlexRow padding='24'>
                        <Text>Range days count: { getRangeLength(value) }</Text>
                    </FlexRow>
                </div>
                }
            />
        </FlexRow>
    );
};

const getRangeLength = (value: RangeDatePickerValue) => {
    return moment(value.to).isValid() && moment(value.from).isValid() && (moment(value.from).valueOf() < moment(value.to).valueOf()) ?
        moment(value.to).diff(moment(value.from), 'days') + 1 :
        0;
};