import React from 'react';
import moment from 'moment';
import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import {RangeDatePickerValue, rangeDatePickerPresets, Day, IconContainer} from '@epam/uui-components';
import { RangeDatePicker, RangeDatePickerProps } from '../RangeDatePicker';
import * as css from '../RangeDatePicker.scss';
import { iEditable, sizeDoc, isDisabledDoc, isInvalidDoc, modeDoc } from '../../../docs';
import { FormContext, DefaultContext, GridContext, ResizableContext } from '../../../docs';
import { Button } from '../..';
import * as point from "../../icons/radio-point.svg";

const getCustomDay = (day: moment.Moment) => {
    return <>
        { day.format('D') }
        <IconContainer style={ { fill: '#fcaa00', height: '4px', width: '4px', position: "absolute", top: '7px', right: '10px' } }  icon={ point } />
    </>;
};

const getRangeLength = (value: RangeDatePickerValue) => {
    return moment(value.to).isValid() && moment(value.from).isValid() && (moment(value.from).valueOf() < moment(value.to).valueOf()) ?
        moment(value.to).diff(moment(value.from), 'days') + 1 :
        0;
};

const RangeDatePickerDoc = new DocBuilder<RangeDatePickerProps>({ name: 'RangeDatePicker', component: RangeDatePicker })
    .implements([iEditable, sizeDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc, modeDoc] as any)
    .prop('value', { examples: [
            { name: '{ from: \'2017-01-22\', to: \'2017-01-28\' }', value: { from: '2017-01-22', to: '2017-01-28' } },
        ] })
    .prop('getPlaceholder', {
        examples: [
            {
                name: 'Custom placeholder',
                value: (type: any) => type === 'from' ? 'Enter start day' : type === 'to' ? 'Enter end day' : null,
            },
        ],
    })
    .prop('format', { examples: ['DD-MM-YYYY', 'DD/MM/YYYY'], defaultValue: 'MMM D, YYYY' })
    .prop('filter', {
        examples: [
            {
                name: 'Filter before current day and after 2 months',
                value: (day: moment.Moment) => day.valueOf() >= moment().subtract(1, 'days').valueOf() && day.valueOf() < moment().add(2, 'months').valueOf(),
            },
        ],
    })
    .prop('renderDay', { examples: ctx => [{
            name: 'Render custom day',
            value: (day: moment.Moment, onDayClick: (day: moment.Moment) => void) => {
                return <Day renderDayNumber={ getCustomDay }
                            value={ day }
                            onValueChange={ onDayClick }
                            isSelected={ day && ctx.getSelectedProps().value && day.isBetween(ctx.getSelectedProps().value.from, ctx.getSelectedProps().value.to, undefined, '[]') }
                            filter={ ctx.getSelectedProps().filter }
                />;
            },
        }] })
    .prop('presets', {
        examples: [
            {
                name: 'default',
                value: rangeDatePickerPresets,
            },
            {
                name: 'custom',
                value: {
                    ...rangeDatePickerPresets,
                    lastMonth: null,
                    last3Days: {
                        name: 'Last 3 days (custom)',
                        getRange: () => {
                            return { from: moment().subtract(3, 'day').toString(), to: moment().toString(), order: 11 };
                        },
                    },
                },
            },
        ],
    })
    .prop('renderFooter', {
        examples: [
            {
                name: 'footer',
                value: (value: RangeDatePickerValue) => <div className={ css.container }>
                    <div>
                        <div className={ css.counter }>Days: { getRangeLength(value) }</div>
                    </div>
                    <div className={ css.buttonGroup }>
                        <Button cx={ css.buttonContainer } caption="clear" color="carbon" fill="none" size="30" />
                    </div>
                </div>,
            },
        ],
    })
    .prop('disableClear', { examples: [true], defaultValue: false})
    .prop('isHoliday', { examples: [{ name: 'without Holidays', value: day => false }] })
    .withContexts(DefaultContext, FormContext, ResizableContext, GridContext);

export = RangeDatePickerDoc;