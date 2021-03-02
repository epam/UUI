import * as React from 'react';
import moment from 'moment';
import { DocBuilder } from '@epam/uui-docs';
import { Day, IconContainer } from '@epam/uui-components';
import { DatePicker, DatePickerProps } from '../DatePicker';
import { LinkButton, FlexRow } from '../../';
import { iEditable, sizeDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc } from '../../../docs';
import { FormContext, DefaultContext, ResizableContext } from '../../../docs';
import * as point from '../../../icons/radio-point.svg';


const getCustomDay = (day: moment.Moment) => {
    return <>
        { day.format('D') }
        <IconContainer style={ { fill: '#fcaa00', height: '4px', width: '4px', position: "absolute", top: '7px', right: '10px' } }  icon={ point } />
    </>;
};

const DatePickerDoc = new DocBuilder<DatePickerProps>({ name: 'DatePicker', component: DatePicker })
    .implements([iEditable, sizeDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc] as any)
    .prop('value', { examples: ['2020-09-03'] })
    .prop('placeholder', { examples: ['Enter start date'] })
    .prop('format', { examples: ['DD/MM/YYYY', 'MMM D, YYYY'], defaultValue: 'MMM D, YYYY' })
    .prop('filter', { examples: [
        {
            name: 'Filter before current day',
            value: (day: moment.Moment) => day.valueOf() >= moment().subtract(1, 'days').valueOf(),
        },
    ] })
    .prop('renderDay', { examples: ctx => [{
            name: 'Render custom day',
            value: (day: moment.Moment, onDayClick: (day: moment.Moment) => void) => {
                return <Day renderDayNumber={ getCustomDay } value={ day } onValueChange={ onDayClick } isSelected={ day && day.isSame(ctx.getSelectedProps().value) } filter={ ctx.getSelectedProps().filter } />;
            },
        }] })
    .prop('disableClear', { examples: [true], defaultValue: false})
    .prop('isHoliday', { examples: [{ name: 'without Holidays', value: day => false }] })
    .prop('renderFooter', {
        examples: ctx => [
            {
                name: 'footer',
                value: () => <FlexRow><LinkButton size='42' caption='Today' onClick={ () => ctx.getSelectedProps().onValueChange(moment().format('MMM D, YYYY')) } /></FlexRow>,
            },
        ],
    })
    .withContexts(DefaultContext, FormContext, ResizableContext);

export = DatePickerDoc;
