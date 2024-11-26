import React from 'react';
import { Button, FlexCell, FlexRow, Text, Tooltip } from '@epam/uui';
import css from './CustomMarkupExample.module.scss';

export default function CustomMarkupExample() {
    const months = [
        'MAY', 'JUN', 'JUL', 'AUG', 'SEP',
    ];
    const renderCustomMarkup = () => (
        <>
            <Text fontSize="14" size="none" fontWeight="600" lineHeight="18" cx={ css.header }>
                Copy Workload Based Revenue to Forecast
            </Text>
            <FlexRow columnGap="6" vPadding="12">
                {months.map((month) => (
                    <FlexCell minWidth={ 50 } width="auto" cx={ css.textBlock } key={ month }>
                        <Text fontSize="14" lineHeight="18" fontWeight="600" cx={ css.text }>
                            {month}
                            {' '}
                            - 22
                        </Text>
                        <Text fontSize="12" lineHeight="18" cx={ css.text }>
                            120k USD
                        </Text>
                    </FlexCell>
                ))}
            </FlexRow>
        </>
    );

    return (
        <FlexRow>
            <Tooltip maxWidth={ 500 } renderContent={ renderCustomMarkup } color="neutral" placement="right">
                <Button data-foo={ 123 } fill="outline" caption="Custom tooltip" onClick={ () => null } />
            </Tooltip>
        </FlexRow>
    );
}
