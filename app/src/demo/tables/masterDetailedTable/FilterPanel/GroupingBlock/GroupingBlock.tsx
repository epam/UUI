import React from 'react';
import { Accordion } from '@epam/uui';

const GroupingBlock: React.FC = () => {
    return (
        <Accordion title="Grouping" mode="inline" padding="18">
            {/* <RadioGroup value={ value } onValueChange={ setValue } items={ items }/> */}
        </Accordion>
    );
};

export default React.memo(GroupingBlock);
