import dayjs, { Dayjs } from 'dayjs';
import {
    Day, DayProps, IconContainer,
} from '@epam/uui-components';
import * as React from 'react';
import { ReactComponent as Point } from '@epam/assets/icons/common/radio-point-10.svg';
import { IPropSamplesCreationContext } from '@epam/uui-docs';
import {
    DatePickerProps, FlexRow, LinkButton,
} from '@epam/uui';
import css from './datePickerExamples.module.scss';

export const renderFooter = (ctx: IPropSamplesCreationContext<DatePickerProps>) => [
    {
        name: 'footer',
        value: () => (
            <FlexRow cx={ css.footer } size="48">
                <LinkButton
                    size="36"
                    caption="Today"
                    onClick={ () => ctx.getSelectedProps().onValueChange(dayjs().format('YYYY-MM-DD')) }
                />
            </FlexRow>
        ),
    },
];

export const renderCustomDayExample = (ctx: IPropSamplesCreationContext<DatePickerProps>) => {
    return [
        {
            name: 'Render custom day',
            value: (renderProps: DayProps) => {
                const getCustomDay = (dayInner: Dayjs) => {
                    return (
                        <>
                            {dayInner.format('D')}
                            <IconContainer
                                style={ {
                                    fill: '#fcaa00',
                                    height: '4px',
                                    width: '4px',
                                    position: 'absolute',
                                    top: '7px',
                                    right: '10px',
                                } }
                                icon={ Point }
                            />
                        </>
                    );
                };
                return (
                    <Day
                        { ...renderProps }
                        renderDayNumber={ getCustomDay }
                        isSelected={ renderProps.value && renderProps.value.isSame(ctx.getSelectedProps().value) }
                        filter={ ctx.getSelectedProps().filter }
                    />
                );
            },
        },
    ];
};
