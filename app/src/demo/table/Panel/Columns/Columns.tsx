import React, { useState } from "react";
import { Accordion, CheckboxGroup } from "@epam/promo";
import { items } from "../../data";

const Columns: React.FC = () => {
    const [value, setValue] = useState(null);

    return (
        <Accordion title="Columns" mode="inline" padding="18">
            <CheckboxGroup items={ items } value={ value } onValueChange={ setValue }/>
        </Accordion>
    );
};

export default React.memo(Columns);