import React, {useMemo, useState} from "react";
import { CheckboxGroup} from "@epam/promo";
import { columns } from "../../data";

const Columns: React.FC = () => {
    const [value, setValue] = useState(null);
    // const items = useMemo(() => data.map(item => ({
    //     id: item.key,
    //     name: item.caption,
    // })), []);

    return (
        <CheckboxGroup items={ columns } value={ value } onValueChange={ setValue }/>
    );
};

export default React.memo(Columns);