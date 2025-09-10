import React from 'react';
import { ScrollBars, Panel, Text, FlexRow } from '@epam/uui';
import css from './BasicExample.module.scss';

export default function BasicScrollBarsExample() {
    return (
        <Panel background="surface-main" shadow cx={ css.container }>
            <FlexRow padding="24" borderBottom>
                <Text fontWeight="600">
                    Title
                </Text>
            </FlexRow>
            <ScrollBars>
                <div className={ css.gridLayout }>
                    {Array.from({ length: 80 }, (_, index) => (
                        <Panel
                            key={ index }
                            background="surface-main"
                            cx={ css.card }
                            shadow
                        >
                            <Text fontSize="12" fontWeight="600">
                                Cell
                                {' '}
                                {index + 1}
                            </Text>
                        </Panel>
                    ))}
                </div>
            </ScrollBars>
            <FlexRow padding="24" borderTop>
                <Text fontSize="12" color="secondary">
                    Footer
                </Text>
            </FlexRow>
        </Panel>
    );
}
