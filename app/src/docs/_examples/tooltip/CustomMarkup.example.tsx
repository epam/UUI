import React from 'react';
import { Button, FlexCell, FlexRow, Text, Tooltip } from '@epam/promo';
import css from './CustomMarkupExample.scss';

export default function CustomMarkupExample() {
    const months = ['MAY', 'JUN', 'JUL', 'AUG', 'SEP'];
    const renderCustomMarkup = () => (
        <>
            <Text fontSize="14" color="gray5">
                Copy Workload Based Revenue to Forecast
            </Text>
            <FlexRow spacing="12">
                {months.map((month) => (
                    <FlexCell minWidth={60} cx={css.textBlock} key={month}>
                        <Text fontSize="14" lineHeight="18" color="gray5" cx={css.text}>
                            {month} - 22
                        </Text>
                        <Text fontSize="12" lineHeight="18" color="gray5" cx={css.text}>
                            120k USD
                        </Text>
                    </FlexCell>
                ))}
            </FlexRow>
        </>
    );

    return (
        <FlexRow>
            <Tooltip maxWidth={366} trigger="hover" renderContent={renderCustomMarkup} placement="right">
                <Button data-foo={123} fill="white" caption="Custom tooltip" onClick={() => null} />
            </Tooltip>
        </FlexRow>
    );
}
