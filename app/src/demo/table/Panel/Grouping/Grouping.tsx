import React, { useState } from "react";
import { Accordion, RadioGroup } from "@epam/promo";
import { columns } from "../../data";

const Grouping: React.FC = () => {
    const [value, setValue] = useState(null);

    return (
        <Accordion title="Grouping" mode="inline" padding="18">
            <RadioGroup value={ value } onValueChange={ setValue } items={ columns }/>
        </Accordion>
    );
};

export default React.memo(Grouping);