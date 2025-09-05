import React from 'react';
import { ScrollBars, Panel, Text, FlexRow } from '@epam/uui';

export default function TwoAxisScrollExample() {
    return (
        <Panel background="surface-main" shadow style={ { width: '600px', height: '400px' } }>
            <FlexRow padding="24" borderBottom>
                <Text fontWeight="600">
                    Title
                </Text>
            </FlexRow>
            <ScrollBars hasTopShadow hasBottomShadow>

                <div style={ {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(8, 140px)',
                    gridTemplateRows: 'repeat(10, 80px)',
                    gap: '16px',
                    minWidth: 'max-content',
                    minHeight: 'max-content',
                    padding: '24px',
                } }
                >
                    {Array.from({ length: 80 }, (_, index) => (
                        <Panel
                            key={ index }
                            background="surface-main"
                            style={ {
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            } }
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
